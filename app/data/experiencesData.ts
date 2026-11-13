import type { StaticImageData } from "next/image";
import burographic from "@/public/img/burographic.webp";
import iutBayonne from "@/public/img/iutBayonne.png";

/**
 * Parcours affiché dans la section « Parcours ». Les textes sont dans
 * public/locales/{fr,en}/common.json, sous portfolio.experiences, dans le même ordre.
 * Une expérience sans logo (projets indépendants) affiche une icône.
 */
export type TimelineEntry = {
  icon: "code" | "bot" | StaticImageData;
  current?: boolean;
  tags?: string[];
};

export const workEntries: TimelineEntry[] = [
  {
    icon: "code",
    current: true,
    tags: ["TypeScript", "Node.js", "Express", "PostgreSQL", "SQLite", "WebSocket", "Kotlin", "Jetpack Compose"],
  },
  {
    icon: "bot",
    current: true,
    tags: ["Claude Code", "Anthropic API", "MCP", "Linux", "PM2", "GitHub Actions"],
  },
  {
    icon: burographic,
    tags: ["Python", "SNMP", "VBA", "PowerShell", "Batch"],
  },
];

export const studyEntries: TimelineEntry[] = [{ icon: iutBayonne }, { icon: iutBayonne }];
