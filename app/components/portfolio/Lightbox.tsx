"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: readonly string[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  labels: { close: string; previous: string; next: string };
}

/**
 * Affiche une capture en plein écran, à partir du fichier d'origine : pas de
 * redimensionnement ni de recompression, le texte des captures reste net.
 *
 * Rendu dans un portail : les slides de Swiper sont transformées, et un
 * élément `fixed` placé dedans se positionnerait par rapport à la slide.
 */
export default function Lightbox({ images, index, onIndexChange, onClose, labels }: LightboxProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const count = images.length;
  const go = (step: number) => onIndexChange((index + step + count) % count);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && count > 1) onIndexChange((index - 1 + count) % count);
      else if (e.key === "ArrowRight" && count > 1) onIndexChange((index + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onClose, onIndexChange]);

  const button =
    "grid size-11 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-[#9333ea] focus-visible:outline-2 focus-visible:outline-[#BB86FC] cursor-pointer";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-2 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- fichier d'origine voulu, sans optimisation */}
      <img
        src={images[index]}
        alt={`Illustration ${index + 1}`}
        className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        ref={closeButton}
        type="button"
        aria-label={labels.close}
        className={`${button} absolute right-3 top-3`}
        onClick={onClose}
      >
        <X className="size-5" />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label={labels.previous}
            className={`${button} absolute left-3 top-1/2 -translate-y-1/2`}
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label={labels.next}
            className={`${button} absolute right-3 top-1/2 -translate-y-1/2`}
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <ChevronRight className="size-6" />
          </button>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
            {index + 1} / {count}
          </p>
        </>
      )}
    </div>,
    document.body,
  );
}
