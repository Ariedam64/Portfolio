import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/app/lib/chat/knowledge";
import { LIMITS, type ChatErrorCode, type StreamEvent } from "@/app/lib/chat/protocol";
import { allowRequest, clientIp } from "@/app/lib/chat/rateLimit";
import { TOOLS, toolCallToEvent } from "@/app/lib/chat/tools";

export const runtime = "nodejs";
export const maxDuration = 60;

type MessageParam = Anthropic.Beta.BetaMessageParam;
type ContentBlock = Anthropic.Beta.BetaContentBlock;

const MODEL = "claude-sonnet-5-5";
/** Nombre max d'appels au modèle pour un même message visiteur. */
const MAX_STEPS = 3;

const client = new Anthropic();

/** Bloc système unique, mis en cache : outils + consignes + fiche. */
const SYSTEM: Anthropic.Beta.BetaTextBlockParam[] = [
  { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
];

const USER_BLOCKS = new Set(["text", "tool_result"]);
const ASSISTANT_BLOCKS = new Set(["text", "thinking", "redacted_thinking", "tool_use", "fallback"]);

/**
 * Vérifie l'historique renvoyé par le client. On n'accepte que la forme que
 * ce serveur produit lui-même : pas de message "system", pas de type de bloc
 * inattendu. On ne modifie rien : les blocs de réflexion signés doivent
 * revenir à l'identique.
 */
function parseHistory(raw: unknown): MessageParam[] | null {
  if (!Array.isArray(raw)) return null;
  for (const [i, msg] of raw.entries()) {
    if (!msg || typeof msg !== "object") return null;
    const { role, content } = msg as { role?: unknown; content?: unknown };
    if (i === 0 && role !== "user") return null;
    if (role !== "user" && role !== "assistant") return null;
    if (!Array.isArray(content) || content.length === 0) return null;
    const allowed = role === "user" ? USER_BLOCKS : ASSISTANT_BLOCKS;
    for (const block of content) {
      if (!block || typeof block !== "object") return null;
      if (!allowed.has((block as { type?: unknown }).type as string)) return null;
    }
  }
  return raw as MessageParam[];
}

function countUserTurns(history: MessageParam[]): number {
  return history.filter(
    (m) => m.role === "user" && Array.isArray(m.content) && m.content.some((b) => b.type === "text"),
  ).length;
}

/**
 * Après un passage de relais vers le modèle de secours au milieu d'une
 * réponse, les blocs de réflexion et d'outil produits avant le dernier bloc
 * "fallback" ne doivent pas être renvoyés. Le bloc "fallback" reste en place.
 */
function contentToEcho(content: ContentBlock[]): ContentBlock[] {
  const lastFallback = content.map((b) => b.type).lastIndexOf("fallback");
  if (lastFallback === -1) return content;
  const dropBefore = new Set(["thinking", "redacted_thinking", "tool_use", "server_tool_use"]);
  return content.filter((b, i) => i >= lastFallback || !dropBefore.has(b.type));
}

function jsonError(code: ChatErrorCode, status: number) {
  return Response.json({ type: "error", code } satisfies StreamEvent, { status });
}

export async function POST(req: Request) {
  if (!allowRequest(clientIp(req))) return jsonError("rate_limited", 429);

  const raw = await req.text();
  if (raw.length > LIMITS.bodyBytes) return jsonError("conversation_limit", 413);

  let body: { history?: unknown; message?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError("invalid_request", 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return jsonError("invalid_request", 400);
  if (message.length > LIMITS.messageChars) return jsonError("message_too_long", 413);

  const history = parseHistory(body.history ?? []);
  if (!history) return jsonError("invalid_request", 400);
  // On refuse au lieu de tronquer : raccourcir l'historique casserait le cache
  // et invaliderait les blocs de réflexion déjà produits.
  if (countUserTurns(history) >= LIMITS.userTurns) return jsonError("conversation_limit", 413);

  const appended: MessageParam[] = [{ role: "user", content: [{ type: "text", text: message }] }];
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) => controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

      try {
        for (let step = 0; step < MAX_STEPS; step++) {
          const response = client.beta.messages.stream(
            {
              model: MODEL,
              max_tokens: 8000,
              system: SYSTEM,
              tools: TOOLS,
              messages: [...history, ...appended],
              // Chat : effort bas, le modèle saute la réflexion sur les questions simples.
              output_config: { effort: "low" },
              // Met aussi en cache le début de la conversation d'un tour à l'autre.
              cache_control: { type: "ephemeral" },
              // Si un classifieur de sécurité refuse à tort, l'API relance sur un autre modèle.
              betas: ["server-side-fallback-2026-07-01"],
              fallbacks: "default",
            },
            { signal: req.signal },
          );

          for await (const event of response) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              send({ type: "text", text: event.delta.text });
            }
          }

          const final = await response.finalMessage();
          if (process.env.NODE_ENV !== "production") {
            console.log(
              `[chat] step ${step} stop=${final.stop_reason} in=${final.usage.input_tokens} ` +
                `cacheRead=${final.usage.cache_read_input_tokens} cacheWrite=${final.usage.cache_creation_input_tokens} ` +
                `out=${final.usage.output_tokens}`,
            );
          }

          if (final.stop_reason === "refusal") {
            // Rien n'est ajouté à l'historique : le client retire ce tour.
            send({ type: "error", code: "refused" });
            controller.close();
            return;
          }

          const content = contentToEcho(final.content);
          appended.push({ role: "assistant", content });

          const toolUses = content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
          if (toolUses.length === 0) break;

          const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
          for (const call of toolUses) {
            const event = final.stop_reason === "max_tokens" ? null : toolCallToEvent(call.name, call.input);
            if (event) send(event);
            results.push({
              type: "tool_result",
              tool_use_id: call.id,
              content: event ? "Affiché." : "Appel invalide ou incomplet, rien n'a été affiché.",
              ...(event ? {} : { is_error: true }),
            });
          }
          appended.push({ role: "user", content: results });

          // Le modèle appelle ses outils d'abord, puis écrit sa réponse au tour
          // suivant. Sur Sonnet 5.5, un texte écrit entre deux appels d'outils
          // revient en bloc de réflexion invisible : la réponse doit venir en dernier.
          if (final.stop_reason === "max_tokens") break;
        }

        send({ type: "done", appended });
      } catch (err) {
        if (req.signal.aborted) {
          controller.close();
          return;
        }
        let code: ChatErrorCode = "server_error";
        if (err instanceof Anthropic.RateLimitError) code = "busy";
        else if (err instanceof Anthropic.APIError && (err.status === 529 || err.status === 503)) code = "busy";
        console.error("[chat] erreur:", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
        send({ type: "error", code });
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
