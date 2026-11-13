import {
  Bot,
  Braces,
  Brain,
  Cable,
  Code2,
  Database,
  Headset,
  MonitorSmartphone,
  Plug,
  ScreenShare,
  ScanSearch,
  Server,
  ServerCog,
  Sparkles,
  Ticket,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Compétences regroupées comme sur le CV. Les libellés sont dans
 * public/locales/{fr,en}/common.json (portfolio.skills), dans le même ordre.
 *
 * Logo d'une techno : un SVG Devicon 2.18.0 hébergé dans public/img/skills, une
 * image locale, ou une icône lucide quand aucun logo n'existe. `invert` éclaircit
 * les logos noirs, illisibles sur le fond sombre.
 */
export type SkillIcon = { src: string; invert?: boolean } | { lucide: LucideIcon };

export type SkillCategory = { key: string; icon: LucideIcon; items: SkillIcon[] };

const devicon = (name: string, invert = false): SkillIcon => ({ src: `/img/skills/${name}.svg`, invert });

export const skillCategories: SkillCategory[] = [
  {
    key: "languages",
    icon: Code2,
    items: [devicon("typescript"), devicon("javascript"), devicon("python"), devicon("kotlin"), { lucide: Database }, devicon("powershell")],
  },
  {
    key: "backend",
    icon: Server,
    items: [devicon("nodejs"), devicon("express", true), { lucide: Braces }, { lucide: Cable }, devicon("postgresql"), devicon("sqlite")],
  },
  {
    key: "frontend",
    icon: MonitorSmartphone,
    items: [devicon("react"), devicon("nextjs"), devicon("android"), devicon("jetpackcompose")],
  },
  {
    key: "devops",
    icon: ServerCog,
    items: [devicon("linux", true), devicon("docker"), devicon("nginx"), devicon("pm2", true), devicon("githubactions"), devicon("cloudflare")],
  },
  {
    key: "ai",
    icon: Sparkles,
    items: [devicon("claude"), devicon("claude"), { lucide: Brain }, { lucide: Plug }, { lucide: Bot }],
  },
  {
    key: "reverse",
    icon: ScanSearch,
    items: [{ lucide: ScanSearch }, devicon("unity", true), { src: "/img/tampermonkey.webp" }, { src: "/img/dnSpy.webp" }],
  },
  {
    key: "support",
    icon: Headset,
    items: [{ lucide: ScreenShare }, { lucide: ScreenShare }, { lucide: Ticket }, { lucide: Wrench }],
  },
];
