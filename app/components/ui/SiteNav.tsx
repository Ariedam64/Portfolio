"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import useActiveSection from "@/utils/useActiveSection";
import { cn } from "@/app/lib/utils";

const SECTIONS = [
  { id: "section-about", key: "portfolio.navigation.about" },
  { id: "section-career", key: "portfolio.navigation.career" },
  { id: "section-skills", key: "portfolio.navigation.skills" },
  { id: "section-projects", key: "portfolio.navigation.projects" },
] as const;
const SECTION_IDS = SECTIONS.map((s) => s.id);
const NO_SECTIONS: string[] = [];

const LOCALES = ["fr", "en"] as const;

/** Lien vers une section du portfolio : ancre sur la page, lien complet ailleurs. */
function sectionHref(id: string, onPortfolio: boolean) {
  return onPortfolio ? `#${id}` : `/portfolio#${id}`;
}

function LanguageToggle({ className }: { className?: string }) {
  const { t, i18n } = useTranslation("common");
  const current = i18n.language?.startsWith("en") ? "en" : "fr";
  return (
    <div role="group" aria-label={t("nav.language")} className={cn("inline-flex rounded-full border border-[#3a2f4c] bg-[#121016]/80 p-0.5 backdrop-blur-lg", className)}>
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          aria-pressed={current === locale}
          onClick={() => void i18n.changeLanguage(locale)}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1 text-xs font-bold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-[#8b5cf6]",
            current === locale ? "bg-[#8b5cf6] text-white" : "text-[#a49fb0] hover:text-white",
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}

function HomeLink() {
  const { t } = useTranslation("common");
  return (
    <Link
      href="/"
      aria-label={t("nav.home")}
      className="pointer-events-auto inline-flex h-11 items-center rounded-full border border-purple-200/10 bg-black/30 px-5 text-white shadow-lg shadow-purple-700/20 backdrop-blur-lg transition-colors hover:border-[#8b5cf6] focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
    >
      {/* Pas de photo ici : elle est déjà sur la bulle du chat. */}
      <span className="text-sm font-bold tracking-wide">Romann</span>
    </Link>
  );
}

/**
 * Navigation du site : ligne flottante sur ordinateur, bouton menu et panneau
 * qui monte du bas sur téléphone. Remplace l'ancienne barre latérale, qui
 * cachait le choix de la langue derrière une poignée.
 */
export default function SiteNav() {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const onPortfolio = pathname === "/portfolio";
  const onTools = pathname.startsWith("/outils");
  const active = useActiveSection(onPortfolio ? SECTION_IDS : NO_SECTIONS);
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Le menu se referme quand on change de page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus sur le panneau lui-même : les lecteurs d'écran l'annoncent, sans
    // allumer le contour d'un lien qu'on n'a pas choisi.
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const button = menuButton.current;
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  // « À propos » est en haut de page : on remonte tout en haut plutôt que sur l'ancre.
  const onSectionClick = (id: string) => (e: MouseEvent) => {
    setOpen(false);
    if (onPortfolio && id === "section-about") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const desktopItem = (isActive: boolean) =>
    cn(
      "block rounded-full px-4 py-2.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-[#8b5cf6]",
      isActive ? "bg-purple-600/20 font-semibold text-purple-400" : "text-gray-400 hover:text-white",
    );

  return (
    <>
      {/* Ordinateur : nom à gauche, sections au centre, langue à droite. */}
      <nav aria-label={t("nav.label")} className="pointer-events-none fixed inset-x-0 top-4 z-50 hidden items-center justify-between px-6 lg:flex">
        <HomeLink />
        <ul className="pointer-events-auto absolute left-1/2 flex -translate-x-1/2 items-center overflow-hidden rounded-full border border-purple-200/10 bg-black/20 shadow-lg shadow-purple-700/30 backdrop-blur-lg">
          {SECTIONS.map(({ id, key }) => (
            <li key={id}>
              <a href={sectionHref(id, onPortfolio)} onClick={onSectionClick(id)} aria-current={active === id ? "true" : undefined} className={desktopItem(active === id)}>
                {t(key)}
              </a>
            </li>
          ))}
          <li aria-hidden className="mx-1 h-5 w-px bg-purple-200/15" />
          <li>
            <Link href="/outils" aria-current={onTools ? "page" : undefined} className={desktopItem(onTools)}>
              {t("nav.tools")}
            </Link>
          </li>
        </ul>
        <LanguageToggle className="pointer-events-auto" />
      </nav>

      {/* Téléphone et tablette : nom à gauche, bouton menu à droite. */}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex items-center justify-between px-3 lg:hidden">
        <HomeLink />
        <button
          ref={menuButton}
          type="button"
          aria-label={t("nav.openMenu")}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
          className="pointer-events-auto grid size-11 cursor-pointer place-items-center rounded-full border border-purple-200/10 bg-black/30 text-white shadow-lg shadow-purple-700/20 backdrop-blur-lg transition-colors hover:border-[#8b5cf6] focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[70] lg:hidden">
                <motion.button
                  type="button"
                  aria-label={t("nav.closeMenu")}
                  tabIndex={-1}
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 cursor-default bg-black/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                />
                <motion.nav
                  ref={panel}
                  tabIndex={-1}
                  id="site-menu"
                  aria-label={t("nav.label")}
                  className="absolute inset-x-0 bottom-0 rounded-t-3xl outline-none border-t border-[#3a2f4c] bg-[#121016] px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[#ece9f1] shadow-[0_-20px_60px_-20px_rgba(139,92,246,0.45)]"
                  initial={{ y: reduceMotion ? 0 : "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: reduceMotion ? 0 : "100%" }}
                  transition={{ type: "tween", duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
                >
                  <div className="relative flex h-9 items-center justify-end">
                    <span aria-hidden className="absolute top-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-[#3a2f4c]" />
                    <button
                      type="button"
                      aria-label={t("nav.closeMenu")}
                      onClick={() => setOpen(false)}
                      className="grid size-9 cursor-pointer place-items-center rounded-full text-[#a49fb0] hover:bg-[#2a2335] hover:text-white focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                  <ul>
                    {SECTIONS.map(({ id, key }) => (
                      <li key={id} className="border-b border-[#2a2335]">
                        <a
                          href={sectionHref(id, onPortfolio)}
                          onClick={onSectionClick(id)}
                          aria-current={active === id ? "true" : undefined}
                          className={cn(
                            "block rounded-lg px-2 py-3.5 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-[#8b5cf6]",
                            active === id ? "font-semibold text-purple-400" : "text-[#d8d2e3] hover:text-white",
                          )}
                        >
                          {t(key)}
                        </a>
                      </li>
                    ))}
                    <li className="border-b border-[#2a2335]">
                      <Link
                        href="/outils"
                        onClick={() => setOpen(false)}
                        aria-current={onTools ? "page" : undefined}
                        className={cn(
                          "block rounded-lg px-2 py-3.5 text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-[#8b5cf6]",
                          onTools ? "font-semibold text-purple-400" : "text-[#d8d2e3] hover:text-white",
                        )}
                      >
                        {t("nav.tools")}
                      </Link>
                    </li>
                  </ul>
                  <div className="flex items-center justify-between px-2 pt-5 text-[15px] text-[#d8d2e3]">
                    {t("nav.language")}
                    <LanguageToggle />
                  </div>
                </motion.nav>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
