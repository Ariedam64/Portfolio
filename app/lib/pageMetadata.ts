import type { Metadata } from "next";
import { PAGES, type PagePath } from "./site";

/** Métadonnées d'une page : titre, description, adresse canonique et aperçu. */
export function pageMetadata(path: PagePath): Metadata {
  const { title, description } = PAGES[path];
  return {
    // Titre complet : le modèle « %s · Romann Madeira » du layout racine ne
    // s'applique qu'à un niveau, pas aux pages sous /portfolio ou /outils.
    title: { absolute: `${title} · Romann Madeira` },
    description,
    alternates: { canonical: path },
    // Le bloc openGraph d'une page remplace celui du layout : on reprend tout.
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "Romann Madeira",
      title: `${title} · Romann Madeira`,
      description,
      url: path,
    },
  };
}
