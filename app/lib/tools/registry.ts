import {
  Binary,
  Braces,
  Calculator,
  CalendarClock,
  Clock,
  Database,
  Diff,
  FileCode,
  FileText,
  Fingerprint,
  Hash,
  KeyRound,
  MessageSquare,
  QrCode,
  Regex,
  Repeat,
  type LucideIcon,
} from "lucide-react";

/**
 * Liste des outils de /outils. L'ordre ici est l'ordre d'affichage.
 * Titres, descriptions et textes d'interface sont dans public/locales/{fr,en}/tools.json.
 */
export const CATEGORIES = ["data", "text", "encoding", "time", "generate"] as const;
export type ToolCategory = (typeof CATEGORIES)[number];

export const TOOLS = [
  { slug: "json", category: "data", icon: Braces },
  { slug: "yaml", category: "data", icon: Repeat },
  { slug: "json-to-ts", category: "data", icon: FileCode },
  { slug: "sql", category: "data", icon: Database },
  { slug: "markdown", category: "text", icon: FileText },
  { slug: "diff", category: "text", icon: Diff },
  { slug: "regex", category: "text", icon: Regex },
  { slug: "base64", category: "encoding", icon: Binary },
  { slug: "jwt", category: "encoding", icon: KeyRound },
  { slug: "hash", category: "encoding", icon: Hash },
  { slug: "base-converter", category: "encoding", icon: Calculator },
  { slug: "unix-time", category: "time", icon: Clock },
  { slug: "discord-timestamp", category: "time", icon: MessageSquare },
  { slug: "cron", category: "time", icon: CalendarClock },
  { slug: "uuid", category: "generate", icon: Fingerprint },
  { slug: "qrcode", category: "generate", icon: QrCode },
] as const satisfies readonly { slug: string; category: ToolCategory; icon: LucideIcon }[];

export type ToolSlug = (typeof TOOLS)[number]["slug"];

export function isToolSlug(value: string): value is ToolSlug {
  return TOOLS.some((tool) => tool.slug === value);
}

export function getTool(slug: ToolSlug) {
  return TOOLS.find((tool) => tool.slug === slug)!;
}
