# Pages détail projet : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** appliquer la maquette validée (`scratchpad/mockup.html`) aux 5 pages `/portfolio/projects/*`.

**Architecture:** on refait les composants partagés de `app/components/portfolio/projects/`. Deux nouveaux arrivent, `ProjectHero` et `StatsStrip`, plus un `ModulePanel` pour le haut de chaque onglet. Ensuite les 5 pages passent dessus. Les textes restent ceux de `public/locales/{fr,en}/common.json`.

**Tech Stack:** Next.js 15, Tailwind 4, react-i18next, swiper (`Caroussel`), next/image.

**Spec:** `docs/superpowers/specs/2026-11-13-project-pages-design.md`

## Global Constraints
- Aucun emoji décoratif et aucune bordure colorée par type de bloc. Les props `emoji`/`icon`/`borderColor`/`titleColor` disparaissent des composants.
- Couleurs de la maquette : bordure `#3E304F`, carte `#18181be1`, bloc interne `#1c1b21`, accent `#c084fc`, fond d'accent `#9333ea33`, texte secondaire `#a1a1aa`.
- Texte aligné à gauche, `leading-relaxed`.
- Les textes affichés passent par `TranslateAnimation` (bascule FR/EN).
- Les chiffres de `StatsStrip` sont repris de `portfolio.projects.ariesmod.impact.items`, sans rien inventer.

## Review Focus
- Onglet sans images (SnapScore, modules 1 et 2) : le haut du panneau passe en pleine largeur, sans cadre vide.
- Captures de téléphone (`frameHeight: "portrait"`, application Android) : elles restent lisibles dans la colonne du panneau.
- Page sans lien site (tous sauf Magic Garden) ou sans dépôt (module maintenance) : aucun bouton vide.
- 390px : pas de scroll horizontal (onglets, technos, bande de chiffres en 2×2).
- Bascule EN : aucune clé brute affichée (`portfolio.…`) pour les nouvelles clés.

---

### Task 1 : composants de base restylés
**Files:** modifier `PayeLayout.tsx`, `Section.tsx`, `SectionCard.tsx`, `StepsList.tsx`, `ListSection.tsx`, `TechPills.tsx`, `TabSection.tsx` ; supprimer `Header.tsx`, `Info.tsx` et `Origin.tsx` (inutilisés après la Task 3).

**Interfaces (produit) :**
- `Section({ eyebrow?: string; title: string; children; className? })` : carte `rounded-2xl border-2`, libellé violet en majuscules, puis `h2` blanc.
- `SectionCard({ title: string; children })` : bloc interne, avec le titre en libellé violet en majuscules.
- `StepsList({ steps })` : frise (trait `#3E304F`, point creux violet), titre `#e9d5ff`. Le champ `icon` est ignoré.
- `ListSection` : puce grise `#71717a`, texte `#d4d4d8`.
- `TechPills({ items: string[]; max?: number })` : pastilles de `ProjectCard`, au-delà de `max` un « +N » en pointillé. Sans libellé « Technologies : ».
- `TabsSection({ eyebrow?, title?, items, renderContent })` : en-tête centré, barre d'onglets `rounded-2xl`, contenu dans une carte.

- [ ] Restyler les composants, puis `npm run lint` : 0 erreur.

### Task 2 : `ProjectHero`, `StatsStrip`, `ModulePanel` et nouvelles clés i18n
**Files:** créer `ProjectHero.tsx`, `StatsStrip.tsx`, `ModulePanel.tsx` ; modifier `public/locales/{fr,en}/common.json`.

**Interfaces (produit) :**
- `ProjectHero({ title, subtitle, image?: string, tech: string[], links: { href: string; label: string; primary?: boolean }[] })` : 2 colonnes `lg:`, avec le fil d'Ariane « Projets / … » qui renvoie vers `/portfolio#projects` (ancre à vérifier). L'image passe par `next/image` `fill`, `object-cover object-top`, ratio 16/10, `priority`.
- `StatsStrip({ items: { value: string; label: string }[] })` : 4 colonnes, 2×2 sous `sm`.
- `ModulePanel({ title, objective, images?, frameHeight?, tech, links, children })` : haut du panneau en grille (carrousel à gauche, objectif, technos et liens à droite), puis `children`. Sans images, le haut prend toute la largeur.
- Les techs du hero sont l'union dédupliquée des `techKey` des modules, coupée à 8 par `TechPills max`.
- Nouvelles clés (FR/EN) : `portfolio.projects.ariesmod.stats` (4 × `{value,label}`), `portfolio.projects.ariesmod.origin.headline` (« D'une soirée Discord à un mod communautaire »), `portfolio.projects.ariesmod.architecture_headline` (« Sept briques, un seul écosystème »), `portfolio.sections.game` (« Le jeu »), `portfolio.sections.origin` (« Origine du projet »), `portfolio.sections.story`, `portfolio.nav.projects`. Retirer l'emoji de `portfolio.sections.architecture` et raccourcir en « Architecture technique ».

- [ ] Écrire les composants et les clés, puis lint.

### Task 3 : migrer les 5 pages
**Files:** `app/portfolio/projects/{ariesmod,snapscore,frida,mayaya,arie}/page.tsx`.

| Page | Image du hero | Liens du hero |
|---|---|---|
| ariesmod | `/img/ariesmod1.webp` | AriesMod (code), Garden Explorer (site) + `StatsStrip` |
| snapscore | `/img/snapchat2.webp` | SnapScore-V2 |
| frida | `/img/frida1.webp` | `REPO_URL` |
| mayaya | première image du 1er module | repo du 1er module |
| arie | première image du module | Discord-Bot |

Sur ariesmod, « Le jeu » et « Origine » passent côte à côte dans une `Section` à 2 colonnes `lg:`. Chaque onglet utilise `ModulePanel`, avec `frameHeight` à `compact` dans la colonne, sauf `portrait`.

- [ ] Migrer les pages, puis lint.

### Task 4 : vérification
- [ ] `npm run build` OK. `next start -p 3100`, captures pleine page des 5 pages en 1440px et en 390px, contrôle des points de Review Focus et de la bascule EN.
- [ ] Montrer à Romann. Commit et push seulement sur son OK.
