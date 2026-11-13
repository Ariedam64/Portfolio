"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import TranslateAnimation from "../../TranslateAnimation";

export interface SectionProps {
  /** Petit libellé violet au-dessus du titre. */
  eyebrow?: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

/** Libellé violet en majuscules, partagé par les sections, blocs et onglets. */
export function Eyebrow({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn("text-[11px] font-bold uppercase tracking-[0.14em] text-[#c084fc]", className)}>
      <TranslateAnimation text={text} />
    </p>
  );
}

/** Titre de section, avec son libellé optionnel. */
export function SectionHeading({ eyebrow, title }: { eyebrow?: string; title?: string }) {
  if (!eyebrow && !title) return null;
  return (
    <div className="space-y-1.5">
      {eyebrow && <Eyebrow text={eyebrow} />}
      {title && (
        <h2 className="text-2xl font-bold leading-tight text-white sm:text-[26px]">
          <TranslateAnimation text={title} />
        </h2>
      )}
    </div>
  );
}

export default function Section({ eyebrow, title, className, children }: SectionProps) {
  return (
    <section className="rounded-2xl border-2 border-[#3E304F] bg-[#18181be1] p-5 sm:p-8">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className={cn("space-y-4 text-[15px] sm:text-base", (eyebrow || title) && "mt-5", className)}>
        {children}
      </div>
    </section>
  );
}

/** Colonne titrée, pour poser deux blocs côte à côte dans une même carte. */
export function SectionColumn({ eyebrow, title, children }: { eyebrow?: string; title?: string; children?: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-4">
      <SectionHeading eyebrow={eyebrow} title={title} />
      {children}
    </div>
  );
}

/** Carte à deux colonnes sur grand écran, empilées sur mobile. */
export function SplitSection({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "grid gap-8 rounded-2xl border-2 border-[#3E304F] bg-[#18181be1] p-5 text-[15px] sm:p-8 sm:text-base lg:grid-cols-2 lg:gap-10",
        className,
      )}
    >
      {children}
    </section>
  );
}
