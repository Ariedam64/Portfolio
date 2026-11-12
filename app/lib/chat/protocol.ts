/**
 * Protocole entre /api/chat et le widget. Partagé client et serveur, sans
 * dépendance à un SDK.
 *
 * Le serveur répond en NDJSON : un objet JSON par ligne.
 */
import type { MetricId, ProjectId } from "./catalog";

/** Ce que le widget affiche dans une bulle de l'assistant, dans l'ordre. */
export type DisplayPart =
  | { kind: "text"; text: string }
  | { kind: "projects"; ids: ProjectId[] }
  | { kind: "metrics"; ids: MetricId[] }
  | { kind: "contact" }
  | { kind: "suggestions"; questions: string[] };

export type StreamEvent =
  | { type: "text"; text: string }
  | { type: "projects"; ids: ProjectId[] }
  | { type: "metrics"; ids: MetricId[] }
  | { type: "contact" }
  | { type: "suggestions"; questions: string[] }
  /**
   * Fin du tour. `appended` contient les messages bruts de l'API à ajouter à
   * l'historique (le message du visiteur inclus). Le client le renvoie tel
   * quel au tour suivant : il contient des blocs de réflexion signés qu'il ne
   * faut pas modifier.
   */
  | { type: "done"; appended: unknown[] }
  | { type: "error"; code: ChatErrorCode };

export type ChatErrorCode =
  | "rate_limited"
  | "conversation_limit"
  | "message_too_long"
  | "invalid_request"
  | "refused"
  | "busy"
  | "server_error";

export interface ChatRequestBody {
  /** Historique brut renvoyé par le serveur aux tours précédents. */
  history: unknown[];
  /** Nouveau message du visiteur. */
  message: string;
}

export const LIMITS = {
  /** Longueur max d'un message visiteur, en caractères. */
  messageChars: 800,
  /** Nombre max de messages visiteur dans une conversation. */
  userTurns: 12,
  /** Taille max du corps de requête, en octets. */
  bodyBytes: 300_000,
} as const;
