"use client";

import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";
import Caroussel, { type FrameHeight } from "../Caroussel";
import TranslateAnimation from "../../TranslateAnimation";
import { Eyebrow } from "./Section";
import TechPills from "./TechPills";
import ProjectLinks, { ProjectLink } from "./ProjectLinks";

interface ModulePanelProps {
  /** Libellé au-dessus du titre (« Objectif du projet »). */
  eyebrow: string;
  title: string;
  objective: string;
  images?: readonly string[];
  frameHeight?: FrameHeight;
  tech: string[];
  links: ProjectLink[];
  children?: ReactNode;
}

/**
 * Contenu d'un onglet : captures et résumé en tête, puis les blocs de détail.
 * Sans captures, le résumé prend toute la largeur.
 */
export default function ModulePanel({ eyebrow, title, objective, images = [], frameHeight, tech, links, children }: ModulePanelProps) {
  const hasImages = images.length > 0;
  // Dans la colonne, un cadre « wide » serait plus haut que large : on passe en
  // « compact ». Les captures de téléphone gardent leur cadre haut.
  const frame: FrameHeight = frameHeight === "portrait" ? "portrait" : "compact";

  return (
    <>
      <div className={cn("grid items-center gap-6", hasImages && "lg:grid-cols-[1.4fr_1fr] lg:gap-8")}>
        {hasImages && (
          <div className="min-w-0 overflow-hidden rounded-xl bg-[#0e0c12]">
            <Caroussel images={images} frameHeight={frame} />
          </div>
        )}
        <div className="min-w-0">
          <Eyebrow text={eyebrow} />
          <h3 className="mt-1.5 text-xl font-bold text-white sm:text-[22px]">
            <TranslateAnimation text={title} />
          </h3>
          <p className="mt-2.5 text-[15px]">
            <TranslateAnimation text={objective} />
          </p>
          <TechPills items={tech} className="mt-4" />
          <ProjectLinks links={links} className="mt-5" />
        </div>
      </div>
      {children}
    </>
  );
}
