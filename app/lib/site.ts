/** Adresse publique du site, utilisée pour les liens absolus (aperçus, sitemap). */
export const SITE_URL = "https://www.ariedam.fr";

/**
 * Titre et description de chaque page, pour l'onglet, Google et les aperçus
 * de liens. En français, la langue servie par défaut.
 */
export const PAGES = {
  "/portfolio": {
    title: "Portfolio",
    description:
      "Parcours, compétences et projets de Romann Madeira : un écosystème en production autour de Magic Garden, des outils de rétro-ingénierie Unity et des bots.",
  },
  "/portfolio/projects/ariesmod": {
    title: "Écosystème Magic Garden",
    description:
      "Sept projets autour d'un même jeu : mod, API publique, back-end temps réel, application Android et maintenance pilotée par des agents IA. Près de 40 000 joueurs.",
  },
  "/portfolio/projects/frida": {
    title: "IL2CPP Toolkit (Frida)",
    description:
      "Outil d'analyse dynamique de jeux Unity, pilotable à la main ou par une IA via MCP : recherche de classes, capture d'objets, interception d'appels.",
  },
  "/portfolio/projects/mayaya": {
    title: "Mayaya",
    description:
      "Bot et overlay de statistiques pour le jeu de mots BombParty, en service pendant deux ans et devenu un outil de la communauté.",
  },
  "/portfolio/projects/arie": {
    title: "Arie, bot Discord",
    description:
      "Bot Discord multifonction en Node.js : conversation avec l'API OpenAI, Puissance 4 avec IA Minimax, musique avec paroles synchronisées.",
  },
  "/portfolio/projects/snapscore": {
    title: "SnapScore+",
    description: "Orchestration de navigateurs avec Puppeteer depuis une seule machine, projet d'expérimentation.",
  },
} as const;

export type PagePath = keyof typeof PAGES;
