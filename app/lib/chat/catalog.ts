/**
 * Données de confiance affichées par le chatbot.
 *
 * Le modèle ne fournit que des identifiants (voir tools.ts) : titres, images,
 * liens et chiffres viennent toujours d'ici, jamais du texte généré. Ça évite
 * les liens inventés et les chiffres arrondis à la louche.
 */

export type Locale = "fr" | "en";
type Localized = Record<Locale, string>;

export interface ProjectEntry {
  title: Localized;
  tagline: Localized;
  image: string;
  stack: string[];
  /** Page de détail sur le portfolio. */
  page?: string;
  /** Dépôt GitHub public. Les dépôts privés ne sont jamais liés. */
  repo?: string;
  /** Démo ou site en ligne. */
  site?: string;
}

export const PROJECTS = {
  "magic-garden": {
    title: { fr: "Écosystème Magic Garden", en: "Magic Garden ecosystem" },
    tagline: {
      fr: "Un mod, une API publique, un backend, une app Android et un hub social autour d'un même jeu web.",
      en: "A mod, a public API, a backend, an Android app and a social hub built around one web game.",
    },
    image: "/img/ariesmod1.png",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "Kotlin", "Docker"],
    page: "/portfolio/projects/ariesmod",
  },
  "aries-mod": {
    title: { fr: "Arie's Mod", en: "Arie's Mod" },
    tagline: {
      fr: "Surcouche navigateur qui ajoute des dizaines d'outils au jeu. Plus de 1 000 commits.",
      en: "Browser overlay adding dozens of tools to the game. Over 1,000 commits.",
    },
    image: "/img/ariesmod2.png",
    stack: ["TypeScript", "esbuild", "Userscript"],
    page: "/portfolio/projects/ariesmod",
    repo: "https://github.com/Ariedam64/MG-AriesMod",
  },
  "mg-api": {
    title: { fr: "Magic Garden API", en: "Magic Garden API" },
    tagline: {
      fr: "API publique qui extrait les données du jeu depuis son code minifié et diffuse boutiques et météo en temps réel.",
      en: "Public API that extracts game data from its minified bundle and streams shops and weather in real time.",
    },
    image: "/img/api1.png",
    stack: ["Node.js", "Express", "SQLite", "SSE", "Rive"],
    page: "/portfolio/projects/ariesmod",
    repo: "https://github.com/Ariedam64/Magic-Garden-API",
    site: "https://mg-api.ariedam.fr/docs",
  },
  backend: {
    title: { fr: "Back-end temps réel", en: "Real-time backend" },
    tagline: {
      fr: "Express 5 et PostgreSQL (54 tables) : amis, messagerie, salons, classements. Optimisé de 5 M à 900 k requêtes par jour.",
      en: "Express 5 and PostgreSQL (54 tables): friends, messaging, rooms, leaderboards. Cut from 5M to 900k requests a day.",
    },
    image: "/img/backend1.png",
    stack: ["TypeScript", "Express", "PostgreSQL", "WebSocket", "Docker"],
    page: "/portfolio/projects/ariesmod",
  },
  "mg-maintenance": {
    title: { fr: "Maintenance assistée par IA", en: "AI-assisted maintenance" },
    tagline: {
      fr: "Surveille l'API, trie les bugs des joueurs et prépare des correctifs testés. Rien n'est publié sans validation humaine.",
      en: "Watches the API, triages player bug reports and prepares tested fixes. Nothing ships without human approval.",
    },
    image: "/img/maintenance2.png",
    stack: ["TypeScript", "Claude", "MCP", "PostgreSQL", "PM2"],
    page: "/portfolio/projects/ariesmod",
  },
  "mg-android": {
    title: { fr: "MG AFK (Android)", en: "MG AFK (Android)" },
    tagline: {
      fr: "App Kotlin qui garde la partie connectée en arrière-plan. 70 versions publiées, plus de 11 000 téléchargements.",
      en: "Kotlin app keeping the game session alive in the background. 70 releases, 11,000+ downloads.",
    },
    image: "/img/android1.jpg",
    stack: ["Kotlin", "Jetpack Compose", "OkHttp", "WebSocket"],
    page: "/portfolio/projects/ariesmod",
    repo: "https://github.com/Ariedam64/mg-afk-android",
  },
  gemini: {
    title: { fr: "Gemini", en: "Gemini" },
    tagline: {
      fr: "Refonte du mod en TypeScript strict, codée à deux. Plus de 6 000 téléchargements.",
      en: "Strict-TypeScript rewrite of the mod, built as a pair. 6,000+ downloads.",
    },
    image: "/img/gemini1.png",
    stack: ["TypeScript", "Vite", "Vitest", "Rive"],
    page: "/portfolio/projects/ariesmod",
    repo: "https://github.com/Ariedam64/Gemini",
  },
  "community-hub": {
    title: { fr: "MG Community Hub", en: "MG Community Hub" },
    tagline: {
      fr: "Réseau social intégré au jeu : amis, messages, groupes, classements et échecs en ligne.",
      en: "In-game social network: friends, DMs, groups, leaderboards and online chess.",
    },
    image: "/img/hub1.png",
    stack: ["TypeScript", "WebSocket", "PostgreSQL"],
    page: "/portfolio/projects/ariesmod",
    repo: "https://github.com/Ariedam64/MG-CommunityHub",
  },
  frida: {
    title: { fr: "IL2CPP Toolkit (Frida)", en: "IL2CPP Toolkit (Frida)" },
    tagline: {
      fr: "Outil pour explorer un jeu Unity en direct, pilotable par une IA via MCP. Environ 50 opérations typées.",
      en: "Tool to explore a running Unity game, driveable by an AI through MCP. About 50 typed operations.",
    },
    image: "/img/frida1.png",
    stack: ["TypeScript", "Frida", "MCP", "Node.js"],
    page: "/portfolio/projects/frida",
    repo: "https://github.com/Ariedam64/FridaIL2CPPToolkit",
  },
  mayaya: {
    title: { fr: "Mayaya", en: "Mayaya" },
    tagline: {
      fr: "Bot et overlay pour le jeu de mots BombParty, devenu un outil de la communauté.",
      en: "Bot and overlay for the word game BombParty, adopted by its community.",
    },
    image: "/img/mayaya_nodegif.gif",
    stack: ["Node.js", "Python", "PostgreSQL", "Socket.IO"],
    page: "/portfolio/projects/mayaya",
    repo: "https://github.com/Ariedam64/Bombparty-Bot",
  },
  arie: {
    title: { fr: "Arie (bot Discord)", en: "Arie (Discord bot)" },
    tagline: {
      fr: "Bot Discord multifonction pour remplacer une dizaine de bots sur un serveur.",
      en: "All-in-one Discord bot replacing a dozen bots on one server.",
    },
    image: "/img/arie.gif",
    stack: ["Node.js", "Discord.js", "PostgreSQL", "OpenAI"],
    page: "/portfolio/projects/arie",
  },
  snapscore: {
    title: { fr: "SnapScore+", en: "SnapScore+" },
    tagline: {
      fr: "Orchestration de navigateurs avec Puppeteer depuis une seule machine.",
      en: "Browser orchestration with Puppeteer from a single machine.",
    },
    image: "/img/snapchat2.png",
    stack: ["Node.js", "Puppeteer", "Tampermonkey"],
    page: "/portfolio/projects/snapscore",
    repo: "https://github.com/Ariedam64/SnapScore-V2",
  },
} satisfies Record<string, ProjectEntry>;

export type ProjectId = keyof typeof PROJECTS;
export const PROJECT_IDS = Object.keys(PROJECTS) as ProjectId[];

export interface MetricEntry {
  value: string;
  label: Localized;
}

export const METRICS = {
  "daily-users": {
    value: "~700",
    label: { fr: "utilisateurs par jour sur Arie's Mod", en: "daily users on Arie's Mod" },
  },
  "mod-installs": {
    value: "~6 600",
    label: { fr: "installations du mod depuis décembre 2025", en: "mod installs since December 2025" },
  },
  "players-tracked": {
    value: "~40 000",
    label: { fr: "joueurs référencés par le back-end", en: "players known to the backend" },
  },
  "daily-requests": {
    value: "~800 000",
    label: { fr: "requêtes par jour en production", en: "requests per day in production" },
  },
  "release-downloads": {
    value: "~20 000",
    label: { fr: "téléchargements de versions sur GitHub", en: "GitHub release downloads" },
  },
  "android-downloads": {
    value: "~11 300",
    label: { fr: "téléchargements de l'app Android", en: "Android app downloads" },
  },
  "android-releases": {
    value: "70",
    label: { fr: "versions Android publiées", en: "Android releases shipped" },
  },
  "ecosystem-commits": {
    value: "~2 000",
    label: { fr: "commits sur l'écosystème en 14 mois", en: "ecosystem commits in 14 months" },
  },
  "load-optimization": {
    value: "5 M → 900 k",
    label: { fr: "requêtes par jour après optimisation du back-end", en: "daily requests after backend optimization" },
  },
  "server-cost": {
    value: "3,60 €",
    label: { fr: "par mois pour le serveur qui fait tout tourner", en: "per month for the server running it all" },
  },
  "bug-reports-fixed": {
    value: "27 / 34",
    label: { fr: "premiers signalements de bugs corrigés par la maintenance IA", en: "first bug reports fixed by the AI maintenance" },
  },
  "weather-accuracy": {
    value: "100 %",
    label: { fr: "prévision météo exacte sur 24 h (287/287)", en: "weather forecast accuracy over 24 h (287/287)" },
  },
  "frida-commits": {
    value: "~920",
    label: { fr: "commits sur l'IL2CPP Toolkit en 7 mois", en: "commits on the IL2CPP Toolkit in 7 months" },
  },
  "frida-tests": {
    value: "~800",
    label: { fr: "tests sur la v3 de l'IL2CPP Toolkit", en: "tests on IL2CPP Toolkit v3" },
  },
  "chess-perft": {
    value: "4 865 609",
    label: { fr: "positions validées par le moteur d'échecs (perft 5)", en: "positions validated by the chess engine (perft 5)" },
  },
} satisfies Record<string, MetricEntry>;

export type MetricId = keyof typeof METRICS;
export const METRIC_IDS = Object.keys(METRICS) as MetricId[];

export interface ContactLink {
  label: Localized;
  href: Localized;
  kind: "email" | "linkedin" | "github" | "cv";
}

export const CONTACT_LINKS: ContactLink[] = [
  {
    kind: "email",
    label: { fr: "Email", en: "Email" },
    href: { fr: "mailto:ariedam.romann@gmail.com", en: "mailto:ariedam.romann@gmail.com" },
  },
  {
    kind: "linkedin",
    label: { fr: "LinkedIn", en: "LinkedIn" },
    href: {
      fr: "https://www.linkedin.com/in/romann-madeira-9991a41bb/",
      en: "https://www.linkedin.com/in/romann-madeira-9991a41bb/",
    },
  },
  {
    kind: "github",
    label: { fr: "GitHub", en: "GitHub" },
    href: { fr: "https://github.com/Ariedam64", en: "https://github.com/Ariedam64" },
  },
  {
    kind: "cv",
    label: { fr: "CV (PDF)", en: "Resume (PDF)" },
    href: {
      fr: "https://drive.google.com/file/d/1KR3GVRGmUCH37WHmdCveIKzYkLiTLrRZ/view?usp=sharing",
      en: "https://drive.google.com/file/d/17I2Vy9KzhkyuxIzHEjNCUH5HVgnL8CVj/view?usp=sharing",
    },
  },
];
