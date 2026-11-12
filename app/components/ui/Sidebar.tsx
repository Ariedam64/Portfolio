"use client";

import { useEffect, useRef, useState } from "react";
import { HomeIcon, LanguageIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import IconButton from './Buttons';
import { useLanguageSwitcher } from '../../../utils/languageSwitcher';
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { handleSwitch } = useLanguageSwitcher();
  const { t } = useTranslation("common");

  const [open, setOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const x = e.touches[0]?.clientX ?? 0;
      touchStartX.current = x;
      touchCurrentX.current = x;
    };

    const onTouchMove = (e: TouchEvent) => {
      touchCurrentX.current = e.touches[0]?.clientX ?? null;
    };

    const onTouchEnd = () => {
      const start = touchStartX.current;
      const current = touchCurrentX.current;
      if (start == null || current == null) {
        touchStartX.current = null;
        touchCurrentX.current = null;
        return;
      }

      const dx = current - start;
      const startNearEdge = start < 20; // bord gauche

      if (!open && startNearEdge && dx > 50) {
        setOpen(true);
      } else if (open && dx < -50) {
        setOpen(false);
      }

      touchStartX.current = null;
      touchCurrentX.current = null;
    };

    // Gestion des gestes uniquement sur mobile (approx via matchMedia)
    const mq = window.matchMedia('(max-width: 639px)');
    if (mq.matches) {
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
    }
    return () => {
      if (mq.matches) {
        window.removeEventListener('touchstart', onTouchStart as any);
        window.removeEventListener('touchmove', onTouchMove as any);
        window.removeEventListener('touchend', onTouchEnd as any);
      }
    };
  }, [open]);

  return (
    <>
      {/* MOBILE: wrapper qui contient panneau + poignée et glisse ensemble */}
      <div
        className={`
          sm:hidden fixed left-0 top-1/2 -translate-y-1/2 z-50
          flex items-center py-3
          bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-lg
          shadow-[12px_0_30px_-14px_rgba(147,51,234,0.35)]
          rounded-r-[36px] rounded-l-none
          transition-transform duration-300 will-change-transform
          ${open ? 'translate-x-0' : '-translate-x-[calc(100%-2.25rem)]'}
        `}
      >
        {/* Contenu (mobile) */}
        <div className="flex-1 min-w-0 px-4 py-3">
          <div className="flex flex-col space-y-2">
            <IconButton
              icon={<HomeIcon className="w-6 h-6" />}
              href="/"
              tooltip={t("sidebar.home")}
            />

            <IconButton
              icon={<LanguageIcon className="w-6 h-6" />}
              onClick={handleSwitch}
              tooltip={t("sidebar.translate")}
            />

          </div>
        </div>

        {/* Poignée hamburger intégrée (mobile) */}
        <button
          type="button"
          aria-label={open ? 'Masquer la barre latérale' : 'Afficher la barre latérale'}
          onClick={() => setOpen(!open)}
          className="
            sm:hidden ml-1
            flex items-center justify-center
            w-7 h-16
            text-[#d4d4d4]
            rounded-r-full
            transition-transform duration-200 active:scale-[0.98]
            cursor-pointer
          "
        >
          {open ? (
            <ChevronLeftIcon className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* DESKTOP: wrapper panneau + poignée ensemble */}
      <div
        className={`
          hidden sm:flex fixed left-0 top-1/2 -translate-y-1/2 z-50
          items-center py-3
          bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-lg
          shadow-[12px_0_30px_-14px_rgba(147,51,234,0.35)]
          rounded-r-[36px] rounded-l-none
          transition-transform duration-300 will-change-transform
          ${open ? 'translate-x-0' : '-translate-x-[calc(100%-2.25rem)]'}
        `}
      >
        <div className="flex-1 min-w-0 px-4 py-3">
          <div className="flex flex-col space-y-4">
            <IconButton
              icon={<HomeIcon className="w-6 h-6" />}
              href="/"
              tooltip={t("sidebar.home")}
            />

            <IconButton
              icon={<LanguageIcon className="w-6 h-6" />}
              onClick={handleSwitch}
              tooltip={t("sidebar.translate")}
            />

          </div>
        </div>

        {/* Poignée desktop intégrée */}
        <button
          type="button"
          aria-label={open ? 'Masquer la barre latérale' : 'Afficher la barre latérale'}
          onClick={() => setOpen(!open)}
          className="
            ml-1 flex items-center justify-center
            w-7 h-16
            text-[#d4d4d4]
            rounded-r-full
            transition-transform duration-200 active:scale-[0.98]
            cursor-pointer
          "
        >
          {open ? (
            <ChevronLeftIcon className="w-5 h-5" />
          ) : (
            <ChevronRightIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Voile de fond pour fermer en touchant l'extérieur (mobile) */}
      {open && (
        <button
          type="button"
          aria-label="Fermer la barre latérale"
          onClick={() => setOpen(false)}
          className="sm:hidden fixed inset-0 z-40 bg-black/30"
        />
      )}
    </>
  );
}
