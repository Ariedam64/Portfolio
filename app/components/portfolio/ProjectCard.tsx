"use client";

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ArrowRight, Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/app/lib/utils";
import TranslateAnimation from "../TranslateAnimation";

export interface ProjectCardProps {
  /** Captures, ou chemin d'une vidéo .mp4 (plus légère qu'un GIF animé). */
  images: (StaticImageData | string)[];
  title: string;
  description: string;
  technologies: string[];
  detailsUrl?: string;
  sourceUrl?: string;
  /** Carte large, image à gauche et texte à droite sur grand écran. */
  featured?: boolean;
}

/** Au-delà, les technos restantes sont résumées en « +N ». */
const MAX_TAGS = 5;

function Carousel({ images, title, featured }: { images: ProjectCardProps["images"]; title: string; featured: boolean }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      rewind
      pagination={{ dynamicBullets: true, clickable: true }}
      observer
      observeParents
      className={cn("w-full overflow-hidden rounded-xl bg-[#0e0c12] max-sm:[&_.swiper-button-next]:hidden! max-sm:[&_.swiper-button-prev]:hidden!", featured ? "aspect-[2/1]" : "aspect-[16/10]")}
      style={
        {
          "--swiper-navigation-color": "#c084fc",
          "--swiper-navigation-size": "22px",
          "--swiper-pagination-color": "#c084fc",
          "--swiper-pagination-bullet-inactive-color": "#c084fc",
        } as React.CSSProperties
      }
    >
      {images.map((src, i) => (
        <SwiperSlide key={i} className="!h-full">
          {typeof src === "string" ? (
            // Ancien GIF animé converti en MP4 : 10 fois plus léger, même rendu.
            <video src={src} autoPlay loop muted playsInline aria-label={`${title} : capture ${i + 1}`} className="size-full object-contain" />
          ) : (
            // Next sert une version à la taille affichée au lieu du PNG 1920 px.
            // Qualité 90 pour garder le texte des captures net.
            <Image
              src={src}
              alt={`${title} : capture ${i + 1}`}
              fill
              sizes={featured ? "(max-width: 1024px) calc(100vw - 4rem), 640px" : "(max-width: 768px) calc(100vw - 4rem), 520px"}
              quality={90}
              className="object-contain"
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export function ProjectCard({ images, title, description, technologies, detailsUrl, sourceUrl, featured = false }: ProjectCardProps) {
  const { t } = useTranslation("common");
  const shown = technologies.slice(0, MAX_TAGS);
  const hidden = technologies.slice(MAX_TAGS);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[#3E304F] bg-[#18181be1] text-left shadow-md transition-colors hover:border-[#9333ea]/60",
        featured && "lg:flex-row",
      )}
    >
      <div className={cn("p-3 pb-0", featured && "lg:w-[58%] lg:shrink-0 lg:self-center lg:pr-0 lg:pb-3")}>
        <Carousel images={images} title={title} featured={featured} />
      </div>

      <div className={cn("flex flex-1 flex-col p-5 md:p-6", featured && "lg:justify-center lg:p-8")}>
        {featured && (
          <span className="mb-3 w-fit rounded-full bg-[#9333ea26] px-3 py-1 text-xs font-semibold text-[#c084fc]">
            <TranslateAnimation text={t("portfolio.projectCard.featured")} />
          </span>
        )}
        <h3 className={cn("font-bold text-white", featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl")}>
          <TranslateAnimation text={title} />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa] md:text-[15px]">
          <TranslateAnimation text={description} />
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {shown.map((tech) => (
            <li key={tech} className="rounded-full border border-[#3E304F] bg-[#27272A] px-2.5 py-0.5 text-xs text-gray-200">
              {tech}
            </li>
          ))}
          {hidden.length > 0 && (
            <li title={hidden.join(", ")} className="rounded-full border border-dashed border-[#3E304F] px-2.5 py-0.5 text-xs text-[#a1a1aa]">
              +{hidden.length}
            </li>
          )}
        </ul>

        {(detailsUrl || sourceUrl) && (
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {detailsUrl && (
              <Link
                href={detailsUrl}
                className="inline-flex items-center gap-2 rounded-xl bg-[#9333ea33] px-4 py-2 text-sm font-semibold text-[#c084fc] transition-colors hover:bg-[#9333ea55] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9333ea]"
              >
                <TranslateAnimation text={t("portfolio.projectCard.details")} />
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#3E304F] px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:border-[#9333ea]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9333ea]"
              >
                <Github className="size-4" />
                <TranslateAnimation text={t("portfolio.projectCard.source")} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
