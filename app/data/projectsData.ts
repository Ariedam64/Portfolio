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
              "/img/mayaya_python1.png",
              "/img/mayaya_python2.png",
              "/img/mayaya_python3.png",
              "/img/mayaya_python4.png",
              "/img/mayaya_python5.png"
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
              "/img/mayaya_node1.png",
              "/img/mayaya_node2.png",
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
              "/img/mayaya_overlay1.png",
              "/img/mayaya_overlay2.png",
              "/img/mayaya_overlay3.png",
              "/img/mayaya_overlay4.png",
              "/img/mayaya_overlay5.png",
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
              "/img/arie1.png",
              "/img/arie2.png",
              "/img/arie3.png",
              "/img/arie4.png",
              "/img/arie5.png",
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
    images: ["/img/snapchat2.png","/img/snapchat1.png"],
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
      "/img/api1.png",
      "/img/api2.png",
      "/img/api3.png",
      "/img/api4.png",
      "/img/api5.png",
      "/img/api6.png",
      "/img/api7.png",
      "/img/api8.png",
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
      "/img/hub1.png",
      "/img/hub2.png",
      "/img/hub3.png",
      "/img/hub4.png",
      "/img/hub5.png",
      "/img/hub6.png",
      "/img/hub7.png",
      "/img/hub8.png",
      "/img/hub9.png",
      "/img/hub10.png",
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
      "/img/backend1.png",
      "/img/backend2.png",
      "/img/backend3.png",
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
      "/img/android1.jpg",
      "/img/android2.jpg",
      "/img/android3.jpg",
      "/img/android4.jpg",
      "/img/android5.jpg",
      "/img/android6.jpg",
      "/img/android7.jpg",
      "/img/android8.jpg",
      "/img/android9.jpg",
      "/img/android10.jpg",
      "/img/android11.jpg",
      "/img/android12.jpg",
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
      "/img/gemini1.png",
      "/img/gemini2.png",
      "/img/gemini3.png",
      "/img/gemini4.png",
      "/img/gemini5.png",
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
      "/img/maintenance1.png",
      "/img/maintenance2.png",
      "/img/maintenance3.png",
      "/img/maintenance4.png",
    ],
    frameHeight: "wide",
  },
];

/** Captures du toolkit Frida. La page n'a pas de modules, donc pas de
 *  ModuleData : deux simples listes d'images suffisent. */
export const fridaImages: string[] = [
  "/img/frida1.png",
  "/img/frida2.png",
];

/** Captures de la partie Dofus, montrees dans sa section dediee. */
export const fridaDofusImages: string[] = [
  "/img/dofus1.png",
];
