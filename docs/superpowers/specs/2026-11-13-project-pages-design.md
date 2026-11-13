# Pages détail projet : refonte de la mise en page

## Intention
Les 5 pages détail (`/portfolio/projects/{ariesmod,snapscore,frida,mayaya,arie}`) sont lues par des recruteurs. Aujourd'hui, c'est une suite de boîtes grises toutes pareilles, avec des emojis devant chaque titre et des bordures de couleur partout (ça fait « trop IA »). On ne voit aucune image en haut de page, et les chiffres clés sont enterrés en bas. Le but : qu'on voie l'essentiel sans scroller et que le style colle aux cartes projets de la home.

## Objectifs
- Un vrai haut de page : titre, sous-titre, technos, boutons code/site et une capture principale.
- Pour Magic Garden, une bande de 4 chiffres clés juste sous le haut de page.
- Un style sobre et cohérent avec `ProjectCard` : bordure `#3E304F`, fond `#18181b`, accents violets.
- Les étapes de récit (origine, histoire) présentées en frise verticale plutôt qu'en blocs de texte.

## Non-objectifs
- Pas de réécriture des textes. On ne touche aux traductions que pour les nouveaux libellés des chiffres clés.
- Pas de changement de la home ni des cartes projets.

## Anti-objectifs
- Pas d'encadrés teintés par couleur (vert = avantages, rouge = limites…), pas d'emojis décoratifs.
- Aucun chiffre ni fait inventé : les stats viennent mot pour mot de la liste « L'impact en chiffres » existante.

## Approches envisagées
1. Coup de propre visuel seul (même structure).
2. **Retenue :** refonte de la mise en page avec le haut de page, les chiffres clés et le style unifié, à contenu constant.
3. Refonte + réécriture des textes : écartée pour l'instant, trop de boulot sur les traductions FR/EN.

## Design
- **`ProjectHero`** (nouveau, remplace `Header`) : 2 colonnes sur desktop. À gauche le titre, le sous-titre, les technos (union des technos des onglets, 8 max puis « +N ») et les boutons « Voir le code » / « Voir le site » (style des boutons de `ProjectCard`). À droite la capture principale : la première image du premier onglet qui en a une, ou une image passée explicitement pour Frida. Sur mobile, tout est empilé, image sous le texte.
- **`StatsStrip`** (nouveau, Magic Garden uniquement) : 4 tuiles (gros chiffre + libellé court) avec 40 000 joueurs, ~700 utilisateurs/jour, ~800 000 requêtes/jour et un VPS à 3,60 €/mois. Nouvelles clés i18n FR/EN. Les autres projets n'ont pas de chiffres, donc pas de bande.
- **`Section`** : sans emoji ni bordure colorée. Conteneur dans le style des cartes (`rounded-2xl border-2 border-[#3E304F] bg-[#18181be1]`), titre blanc en gras.
- **`SectionCard`** (dans les onglets) : bordure neutre, sans icône, titre en petit libellé violet. Les « Limites » ne sont plus en rouge.
- **`StepsList`** : frise verticale (trait + point violet), titre en `purple-200`.
- **Onglets** : le carrousel passe en tête de chaque onglet, suivi des technos et des liens, puis des blocs de texte.
- **Texte** : aligné à gauche (on retire `md:text-justify`), interligne `leading-relaxed`.
- **`TechPills`** : on retire « 🛠️ Technologies : » au profit d'un libellé discret.
- Les 5 pages passent sur les nouveaux composants. Les props `emoji`/`icon` restent optionnelles mais ne sont plus passées.

## Laissé au builder
Espacements exacts, tailles de police, comportement du carrousel du haut de page (image fixe ou carrousel) : on choisit ce qui rend le mieux à 1440px et à 390px.
