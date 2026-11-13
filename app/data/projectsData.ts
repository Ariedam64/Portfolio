import type { FrameHeight } from "@/app/components/portfolio/Caroussel";

export interface ModuleData {
  key: string;
  labelKey: string;
  objectiveKey: string;
  techKey: string;
  featuresKey: string;
  limitsKey: string;
  images?: string[];
  repoUrl?: string;
  /** Lien vers une démo publique, affiché à côté du lien du repo. */
  siteUrl?: string;
  /** Les captures d'écran de téléphone ont besoin d'un cadre plus haut. */
  frameHeight?: FrameHeight;
}

export const mayayaModule: ModuleData[] = [
  
  {
    key: "python",
    labelKey: "portfolio.projects.mayaya.modules.python.label",
    objectiveKey: "portfolio.projects.mayaya.modules.python.objective",
    techKey: "portfolio.projects.mayaya.modules.python.tech",
    featuresKey: "portfolio.projects.mayaya.modules.python.features",
    limitsKey: "portfolio.projects.mayaya.modules.python.limits",
    images: [
              "/img/mayaya_python1.webp",
              "/img/mayaya_python2.webp",
              "/img/mayaya_python3.webp",
              "/img/mayaya_python4.webp",
              "/img/mayaya_python5.webp"
            ],
    repoUrl: "https://github.com/Ariedam64/bp_bot_python",
  },
  {
    key: "node",
    labelKey: "portfolio.projects.mayaya.modules.node.label",
    objectiveKey: "portfolio.projects.mayaya.modules.node.objective",
    techKey: "portfolio.projects.mayaya.modules.node.tech",
    featuresKey: "portfolio.projects.mayaya.modules.node.features",
    limitsKey: "portfolio.projects.mayaya.modules.node.limits",
    images: [
              "/img/mayaya_nodegif.mp4",
              "/img/mayaya_node1.webp",
              "/img/mayaya_node2.webp",
            ],
    repoUrl: "https://github.com/Ariedam64/Bombparty-Bot",
  },
    {
    key: "overlay",
    labelKey: "portfolio.projects.mayaya.modules.overlay.label",
    objectiveKey: "portfolio.projects.mayaya.modules.overlay.objective",
    techKey: "portfolio.projects.mayaya.modules.overlay.tech",
    featuresKey: "portfolio.projects.mayaya.modules.overlay.features",
    limitsKey: "portfolio.projects.mayaya.modules.overlay.limits",
    images: [
              "/img/mayaya_overlay1.webp",
              "/img/mayaya_overlay2.webp",
              "/img/mayaya_overlay3.webp",
              "/img/mayaya_overlay4.webp",
              "/img/mayaya_overlay5.webp",
            ],
    repoUrl: "https://www.tampermonkey.net/script_installation.php#url=https://github.com/Ariedam64/overlayStats_Bp/raw/refs/heads/main/overlay.user.js",
  }
];

export const arieModule: ModuleData[] = [
  {
    key: "node",
    labelKey: "portfolio.projects.arie.modules.node.label",
    objectiveKey: "portfolio.projects.arie.modules.node.objective",
    techKey: "portfolio.projects.arie.modules.node.tech",
    featuresKey: "portfolio.projects.arie.modules.node.features",
    limitsKey: "portfolio.projects.arie.modules.node.limits",
    images: [
              "/img/arie.mp4",
              "/img/arie1.webp",
              "/img/arie2.webp",
              "/img/arie3.webp",
              "/img/arie4.webp",
              "/img/arie5.webp",
            ],
    repoUrl: "https://github.com/Ariedam64/Discord-Bot",
  }
];

export const snapscoreModule: ModuleData[] = [
  {
    key: "mobile",
    labelKey: "portfolio.projects.snapscore.modules.mobile.label",
    objectiveKey: "portfolio.projects.snapscore.modules.mobile.objective",
    techKey: "portfolio.projects.snapscore.modules.mobile.tech",
    featuresKey: "portfolio.projects.snapscore.modules.mobile.advantages",
    limitsKey: "portfolio.projects.snapscore.modules.mobile.limits",
    images: [],
    repoUrl: "",
  },
    {
    key: "web",
    labelKey: "portfolio.projects.snapscore.modules.web.label",
    objectiveKey: "portfolio.projects.snapscore.modules.web.objective",
    techKey: "portfolio.projects.snapscore.modules.web.tech",
    featuresKey: "portfolio.projects.snapscore.modules.web.advantages",
    limitsKey: "portfolio.projects.snapscore.modules.web.limits",
    images: [],
    repoUrl: "",
  },
    {
    key: "puppeteer",
    labelKey: "portfolio.projects.snapscore.modules.puppeteer.label",
    objectiveKey: "portfolio.projects.snapscore.modules.puppeteer.objective",
    techKey: "portfolio.projects.snapscore.modules.puppeteer.tech",
    featuresKey: "portfolio.projects.snapscore.modules.puppeteer.advantages",
    limitsKey: "portfolio.projects.snapscore.modules.puppeteer.limits",
    images: ["/img/snapchat2.webp","/img/snapchat1.webp"],
    repoUrl: "https://github.com/Ariedam64/SnapScore-V2",
  },
];

export const ariesmodModule: ModuleData[] = [
  {
    key: "api",
    labelKey: "portfolio.projects.ariesmod.modules.api.label",
    objectiveKey: "portfolio.projects.ariesmod.modules.api.objective",
    techKey: "portfolio.projects.ariesmod.modules.api.tech",
    featuresKey: "portfolio.projects.ariesmod.modules.api.features",
    limitsKey: "portfolio.projects.ariesmod.modules.api.limits",
    images: [
      // Historique météo du Garden Explorer en premier : c'est la capture qui
      // montre le plus de données. Puis la doc, avec ses endpoints et une vraie réponse.
      "/img/api4.webp",
      "/img/api-docs.webp",
      "/img/api2.webp",
      "/img/api3.webp",
      "/img/api5.webp",
      "/img/api6.webp",
      "/img/api7.webp",
      "/img/api8.webp",
    ],
    repoUrl: "https://github.com/Ariedam64/Magic-Garden-API",
    siteUrl: "https://ariesmod-api.ariedam.fr/explorer",
    frameHeight: "wide",
  },
  {
    key: "client",
    labelKey: "portfolio.projects.ariesmod.modules.client.label",
    objectiveKey: "portfolio.projects.ariesmod.modules.client.objective",
    techKey: "portfolio.projects.ariesmod.modules.client.tech",
    featuresKey: "portfolio.projects.ariesmod.modules.client.features",
    limitsKey: "portfolio.projects.ariesmod.modules.client.limits",
    images: [
      "/img/ariesmod1.webp",
      "/img/ariesmod2.webp",
      "/img/ariesmod3.webp",
      "/img/ariesmod4.webp",
      "/img/ariesmod5.webp",
      "/img/ariesmod6.webp",
    ],
    repoUrl: "https://github.com/Ariedam64/MG-AriesMod",
    frameHeight: "wide",
  },
  {
    key: "hub",
    labelKey: "portfolio.projects.ariesmod.modules.hub.label",
    objectiveKey: "portfolio.projects.ariesmod.modules.hub.objective",
    techKey: "portfolio.projects.ariesmod.modules.hub.tech",
    featuresKey: "portfolio.projects.ariesmod.modules.hub.features",
    limitsKey: "portfolio.projects.ariesmod.modules.hub.limits",
    images: [
      "/img/hub1.webp",
      "/img/hub2.webp",
      "/img/hub3.webp",
      "/img/hub4.webp",
      "/img/hub5.webp",
      "/img/hub6.webp",
      "/img/hub7.webp",
      "/img/hub8.webp",
      "/img/hub9.webp",
      "/img/hub10.webp",
    ],
    repoUrl: "https://github.com/Ariedam64/MG-CommunityHub",
  },
  {
    key: "backend",
    labelKey: "portfolio.projects.ariesmod.modules.backend.label",
    objectiveKey: "portfolio.projects.ariesmod.modules.backend.objective",
    techKey: "portfolio.projects.ariesmod.modules.backend.tech",
    featuresKey: "portfolio.projects.ariesmod.modules.backend.features",
    limitsKey: "portfolio.projects.ariesmod.modules.backend.limits",
    images: [
      "/img/backend1.webp",
      "/img/backend2.webp",
      "/img/backend3.webp",
    ],
  },
  {
    key: "android",
    labelKey: "portfolio.projects.ariesmod.modules.android.label",
    objectiveKey: "portfolio.projects.ariesmod.modules.android.objective",
    techKey: "portfolio.projects.ariesmod.modules.android.tech",
    featuresKey: "portfolio.projects.ariesmod.modules.android.features",
    limitsKey: "portfolio.projects.ariesmod.modules.android.limits",
    images: [
      "/img/android1.webp",
      "/img/android2.webp",
      "/img/android3.webp",
      "/img/android4.webp",
      "/img/android5.webp",
      "/img/android6.webp",
      "/img/android7.webp",
      "/img/android8.webp",
      "/img/android9.webp",
      "/img/android10.webp",
      "/img/android11.webp",
      "/img/android12.webp",
    ],
    repoUrl: "https://github.com/Ariedam64/mg-afk-android",
    frameHeight: "portrait",
  },
  {
    key: "gemini",
    labelKey: "portfolio.projects.ariesmod.modules.gemini.label",
    objectiveKey: "portfolio.projects.ariesmod.modules.gemini.objective",
    techKey: "portfolio.projects.ariesmod.modules.gemini.tech",
    featuresKey: "portfolio.projects.ariesmod.modules.gemini.features",
    limitsKey: "portfolio.projects.ariesmod.modules.gemini.limits",
    images: [
      "/img/gemini1.webp",
      "/img/gemini2.webp",
      "/img/gemini3.webp",
      "/img/gemini4.webp",
      "/img/gemini5.webp",
    ],
    repoUrl: "https://github.com/Ariedam64/Gemini",
    frameHeight: "wide",
  },
  {
    key: "maintenance",
    labelKey: "portfolio.projects.ariesmod.modules.maintenance.label",
    objectiveKey: "portfolio.projects.ariesmod.modules.maintenance.objective",
    techKey: "portfolio.projects.ariesmod.modules.maintenance.tech",
    featuresKey: "portfolio.projects.ariesmod.modules.maintenance.features",
    limitsKey: "portfolio.projects.ariesmod.modules.maintenance.limits",
    // Dépôt privé : pas de lien. Les captures viennent de la console d'administration.
    images: [
      "/img/maintenance1.webp",
      "/img/maintenance2.webp",
      "/img/maintenance3.webp",
      "/img/maintenance4.webp",
    ],
    frameHeight: "wide",
  },
];

/** Captures du toolkit Frida. La page n'a pas de modules, donc pas de
 *  ModuleData : deux simples listes d'images suffisent. */
export const fridaImages: string[] = [
  "/img/frida1.webp",
  "/img/frida2.webp",
];

/** Captures de la partie Dofus, montrees dans sa section dediee. */
export const fridaDofusImages: string[] = [
  "/img/dofus1.webp",
];
