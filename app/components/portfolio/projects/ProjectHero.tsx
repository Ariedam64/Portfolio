"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import TranslateAnimation from "../../TranslateAnimation";
import TechPills from "./TechPills";
import ProjectLinks, { ProjectLink } from "./ProjectLinks";

interface ProjectHeroProps {
  title: string;
  subtitle: string;
  /** Capture principale, affichée à droite sur grand écran. */
  image?: string;
  tech: string[];
  links: ProjectLink[];
}

/** Nombre de technos visibles dans le haut de page, le reste passe en « +N ». */
const MAX_TECH = 8;

export default function ProjectHero({ title, subtitle, image, tech, links }: ProjectHeroProps) {
  const { t } = useTranslation("common");
  const uniqueTech = Array.from(new Set(tech));

  return (
    <header className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
      <div className="min-w-0">
        <nav aria-label="Fil d'Ariane" className="text-[13px] text-[#a1a1aa]">
          <Link href="/portfolio#section-projects" className="hover:text-white">
            <TranslateAnimation text={t("portfolio.navigation.projects")} />
          </Link>
          <span aria-hidden> / </span>
          <span className="font-semibold text-[#c084fc]">
            <TranslateAnimation text={title} />
          </span>
        </nav>
        <h1 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight text-white sm:text-[44px]">
          <TranslateAnimation text={title} />
        </h1>
        <p className="mt-4 max-w-[46ch] text-base text-[#a1a1aa]">
          <TranslateAnimation text={subtitle} />
        </p>
        <TechPills items={uniqueTech} max={MAX_TECH} className="mt-6" />
        <ProjectLinks links={links} className="mt-7" />
      </div>

      {image && (
        <div className="rounded-[18px] border-2 border-[#3E304F] bg-[#18181be1] p-2.5 shadow-[0_30px_80px_-30px_#9333ea55]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-[#0e0c12]">
            <Image
              src={image}
              alt={title}
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) calc(100vw - 2rem), 620px"
              className="object-cover object-top"
            />
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * Fusionne les technos de plusieurs modules en les alternant (la 1re de chaque
 * module, puis la 2e…), pour que les premières visibles couvrent tout le projet
 * et pas seulement le premier module.
 */
export function interleaveTech(lists: string[][]): string[] {
  const longest = Math.max(0, ...lists.map((l) => l.length));
  const merged: string[] = [];
  for (let i = 0; i < longest; i++) {
    for (const list of lists) if (i < list.length) merged.push(list[i]);
  }
  return Array.from(new Set(merged));
}
