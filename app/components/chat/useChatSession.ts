"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatErrorCode, ChatRequestBody, DisplayPart, StreamEvent } from "@/app/lib/chat/protocol";

export type ClientErrorCode = ChatErrorCode | "network";

export interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  parts: DisplayPart[];
  /** Réponse en cours de réception. */
  pending?: boolean;
  /** Réponse coupée par le visiteur. */
  interrupted?: boolean;
  error?: ClientErrorCode;
  /** Message visiteur à renvoyer si on réessaie après une erreur. */
  retryText?: string;
}

let counter = 0;
const newId = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`;

function applyEvent(parts: DisplayPart[], event: StreamEvent): DisplayPart[] {
  switch (event.type) {
    case "text": {
      const last = parts.at(-1);
      if (last?.kind === "text") return [...parts.slice(0, -1), { kind: "text", text: last.text + event.text }];
      return [...parts, { kind: "text", text: event.text }];
    }
    case "projects":
      return [...parts, { kind: "projects", ids: event.ids }];
    case "metrics":
      return [...parts, { kind: "metrics", ids: event.ids }];
    case "contact":
      return [...parts, { kind: "contact" }];
    case "suggestions":
      return [...parts, { kind: "suggestions", questions: event.questions }];
    default:
      return parts;
  }
}

export function useChatSession() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  /** Historique brut de l'API, renvoyé tel quel au serveur. */
  const history = useRef<unknown[]>([]);
  const abort = useRef<AbortController | null>(null);

  const updateMessage = useCallback((id: string, update: (m: DisplayMessage) => DisplayMessage) => {
    setMessages((all) => all.map((m) => (m.id === id ? update(m) : m)));
  }, []);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || streaming || limitReached) return;

      const assistantId = newId();
      setMessages((all) => [
        // Une réponse en erreur ne se réessaie plus une fois qu'on est passé à autre chose.
        ...all.map((m) => (m.error ? { ...m, retryText: undefined } : m)),
        { id: newId(), role: "user", parts: [{ kind: "text", text: message }] },
        { id: assistantId, role: "assistant", parts: [], pending: true },
      ]);
      setStreaming(true);

      const controller = new AbortController();
      abort.current = controller;
      let finished = false;

      const fail = (code: ClientErrorCode) => {
        finished = true;
        if (code === "conversation_limit") setLimitReached(true);
        updateMessage(assistantId, (m) => ({ ...m, pending: false, error: code, retryText: message }));
      };

      try {
        const body: ChatRequestBody = { history: history.current, message };
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const payload = (await res.json().catch(() => null)) as StreamEvent | null;
          fail(payload?.type === "error" ? payload.code : "server_error");
          return;
        }

        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as StreamEvent;
            if (event.type === "done") {
              finished = true;
              history.current = [...history.current, ...event.appended];
              updateMessage(assistantId, (m) => ({ ...m, pending: false }));
            } else if (event.type === "error") {
              fail(event.code);
            } else {
              updateMessage(assistantId, (m) => ({ ...m, parts: applyEvent(m.parts, event) }));
            }
          }
        }
        if (!finished) fail("server_error");
      } catch {
        if (controller.signal.aborted) {
          // Le visiteur a coupé : on garde le texte reçu, mais ce tour n'entre
          // pas dans l'historique (le modèle ne l'a jamais terminé).
          updateMessage(assistantId, (m) => ({
            ...m,
            pending: false,
            interrupted: true,
            parts: m.parts.filter((p) => p.kind !== "suggestions"),
          }));
        } else if (!finished) {
          fail("network");
        }
      } finally {
        abort.current = null;
        setStreaming(false);
      }
    },
    [streaming, limitReached, updateMessage],
  );

  const stop = useCallback(() => abort.current?.abort(), []);

  const reset = useCallback(() => {
    abort.current?.abort();
    history.current = [];
    setMessages([]);
    setLimitReached(false);
  }, []);

  /** Renvoie la question d'un message en erreur, après l'avoir retiré. */
  const retry = useCallback(
    (assistantId: string) => {
      const index = messages.findIndex((m) => m.id === assistantId);
      const text = messages[index]?.retryText;
      if (!text) return;
      // Retire la question et la réponse ratée : send() les rajoute.
      setMessages((all) => all.filter((_, i) => i !== index && i !== index - 1));
      void send(text);
    },
    [messages, send],
  );

  return { messages, streaming, limitReached, send, stop, reset, retry };
}
