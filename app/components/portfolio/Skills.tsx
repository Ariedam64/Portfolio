"use client";

import { useTranslation } from "react-i18next";
import { skillCategories, type SkillIcon } from "@/app/data/skillsData";
import { tList } from "@/utils/i18n";
import { cn } from "@/app/lib/utils";
import TranslateAnimation from "../TranslateAnimation";

type CategoryText = { title: string; items: string[] };

function TechLogo({ icon }: { icon: SkillIcon }) {
  if ("lucide" in icon) {
    const Icon = icon.lucide;
    return <Icon aria-hidden className="size-4 text-[#c4b5fd]" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- petits logos SVG locaux, rien à optimiser
    <img src={icon.src} alt="" width={16} height={16} loading="lazy" className={cn("size-4 object-contain", icon.invert && "invert")} />
  );
}

export default function Skills() {
  const { t } = useTranslation("common");
  const texts = tList<CategoryText>(t, "portfolio.skills");

  return (
    <>
      <p className="pb-6 text-center text-3xl font-light tracking-[0.05em] text-[#d4d4d4] sm:pb-8 sm:text-4xl sm:tracking-widest md:text-5xl">
        <TranslateAnimation text={t("portfolio.navigation.skills")} />
      </p>

      {/* Flex plutôt que grille : la dernière ligne (7 cartes sur 3 colonnes) reste centrée. */}
      <div className="flex w-full max-w-[1100px] flex-wrap justify-center gap-5 text-left">
        {skillCategories.map(({ key, icon: CategoryIcon, items }, i) => {
          const text = texts[i];
          if (!text) return null;
          return (
            <section
              key={key}
              className="w-full rounded-2xl border-2 border-[#3E304F] bg-[#18181be1] p-5 shadow-md transition-colors hover:border-[#9333ea]/60 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <h3 className="flex items-center gap-3 text-lg font-bold text-white">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#9333ea26] text-[#c084fc]">
                  <CategoryIcon className="size-[18px]" />
                </span>
                <TranslateAnimation text={text.title} />
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {items.map((icon, j) => (
                  <li key={j} className="inline-flex items-center gap-1.5 rounded-full border border-[#3E304F] bg-[#27272A] py-1 pr-3 pl-2 text-sm text-gray-200">
                    <TechLogo icon={icon} />
                    <TranslateAnimation text={text.items[j] ?? ""} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
