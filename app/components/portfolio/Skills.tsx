"use client";

import { useTranslation } from "react-i18next";
import TranslateAnimation from "../TranslateAnimation";
import { skillsData } from "@/app/data/skillsData";

export default function Skills() {
  const { t } = useTranslation("common");

return (
  <>
    <p className="text-3xl sm:text-4xl md:text-5xl font-light text-[#d4d4d4] tracking-[0.05em] sm:tracking-widest text-center pb-3 sm:pb-4">
      <TranslateAnimation text={t("portfolio.navigation.skills")} />
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skillsData.map(({ key, icon, titleKey, descriptionKey }) => (
        <div
          key={key}
          className="relative overflow-hidden bg-[#18181be1] text-[#222] box-border shadow-md rounded-2xl transition-transform duration-200 ease-in-out hover:-translate-y-1 border-2 border-[#3E304F] flex items-center p-4 min-h-[120px] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9333ea]"
        >
          <button
            type="button"
            aria-label={`${titleKey} Logo`}
            className="inline-flex items-center justify-center w-24 h-16 mr-4 p-2 bg-[#27272C] rounded-2xl pointer-events-none"
          >
            <img src={icon} alt={titleKey} width="40" height="40" className="object-contain" />
          </button>

          <div className="flex-1">
            <h3 className="text-base font-extrabold text-[#d4d4d4] mb-1 text-left">
              <TranslateAnimation text={t(titleKey)}/>
            </h3>
            <p className="text-sm text-[#a1a1aa] text-left m-0">
              <TranslateAnimation text={t(descriptionKey)} />
            </p>
          </div>
        </div>
      ))}
    </div>
  </>
)

}
