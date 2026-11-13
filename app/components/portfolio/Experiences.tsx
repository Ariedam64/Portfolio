"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, CodeXml } from "lucide-react";
import { useTranslation } from "react-i18next";
import { studyEntries, workEntries, type TimelineEntry } from "@/app/data/experiencesData";
import { tList } from "@/utils/i18n";
import { cn } from "@/app/lib/utils";
import TranslateAnimation from "../TranslateAnimation";

type Tab = "work" | "studies";

type EntryText = { title: string; org: string; place: string; period: string; intro?: string; points?: string[] };

/** Pastille posée sur la ligne de temps : logo de l'organisme, ou icône pour les projets indépendants. */
function Marker({ icon, label }: { icon: TimelineEntry["icon"]; label: string }) {
  if (icon === "code" || icon === "bot") {
    const Icon = icon === "code" ? CodeXml : Bot;
    return (
      <span className="grid size-9 place-items-center rounded-full border-2 border-[#3E304F] bg-[#1f1a27] text-[#c4b5fd] md:size-11">
        <Icon className="size-4 md:size-5" />
      </span>
    );
  }
  return (
    <span className="grid size-9 place-items-center overflow-hidden rounded-full border-2 border-[#3E304F] bg-white md:size-11">
      <Image src={icon} alt={label} width={44} height={44} className="size-full object-cover" />
    </span>
  );
}

export default function Experiences() {
  const { t } = useTranslation("common");
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<Tab>("work");

  const entries = tab === "work" ? workEntries : studyEntries;
  const texts = tList<EntryText>(t, `portfolio.experiences.${tab}`);

  return (
    <>
      <p className="mb-6 text-center text-3xl font-light tracking-widest text-[#d4d4d4] md:text-5xl">
        <TranslateAnimation text={t("portfolio.navigation.career")} />
      </p>

      <div role="tablist" aria-label={t("portfolio.navigation.career")} className="mb-8 inline-flex rounded-full border border-[#3E304F] bg-[#18181be1] p-1">
        {(["work", "studies"] as const).map((key) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "cursor-pointer rounded-full px-5 py-2 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#9333ea] md:px-7 md:text-lg",
              tab === key ? "bg-[#9333ea33] text-[#c084fc]" : "text-[#a3a3a3] hover:text-white",
            )}
          >
            <TranslateAnimation text={t(`portfolio.experiences.${key === "work" ? "work_title" : "studies_title"}`)} />
          </button>
        ))}
      </div>

      <div role="tabpanel" className="w-full max-w-[900px] text-left">
        <AnimatePresence mode="wait">
          <motion.ol
            key={tab}
            className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[17px] md:before:left-[21px] before:w-px before:bg-gradient-to-b before:from-[#9333ea] before:via-[#3E304F] before:to-transparent"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
          >
            {entries.map((entry, i) => {
              const text = texts[i];
              if (!text) return null;
              return (
                <motion.li
                  key={i}
                  className="relative pl-12 md:pl-16"
                  variants={{
                    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <div className="absolute top-4 left-0">
                    <Marker icon={entry.icon} label={text.org} />
                  </div>

                  <article className="rounded-2xl border-2 border-[#3E304F] bg-[#18181be1] p-4 shadow-md sm:p-5 transition-colors hover:border-[#9333ea]/60 md:p-6">
                    <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white md:text-xl">
                          <TranslateAnimation text={text.title} />
                        </h3>
                        <p className="mt-0.5 text-sm text-[#a1a1aa]">
                          <TranslateAnimation text={`${text.org} · ${text.place}`} />
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {entry.current && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c4b5fd]">
                            <span className="size-1.5 animate-pulse rounded-full bg-[#a855f7]" />
                            <TranslateAnimation text={t("portfolio.experiences.current")} />
                          </span>
                        )}
                        <span className="rounded-full bg-[#9333ea26] px-3 py-1 text-xs font-semibold whitespace-nowrap text-[#c084fc]">
                          <TranslateAnimation text={text.period} />
                        </span>
                      </div>
                    </header>

                    {text.intro && (
                      <p className="mt-3 text-sm text-[#d4d4d8] italic">
                        <TranslateAnimation text={text.intro} />
                      </p>
                    )}

                    {text.points && text.points.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {text.points.map((point, j) => (
                          <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-[#d4d4d8]">
                            <span aria-hidden className="mt-[0.6em] h-px w-2.5 shrink-0 bg-[#a855f7]" />
                            <TranslateAnimation text={point} />
                          </li>
                        ))}
                      </ul>
                    )}

                    {entry.tags && (
                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                        {entry.tags.map((tag) => (
                          <li key={tag} className="rounded-full border border-[#3E304F] bg-[#27272A] px-2.5 py-0.5 text-xs text-gray-200">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </motion.li>
              );
            })}
          </motion.ol>
        </AnimatePresence>
      </div>
    </>
  );
}
