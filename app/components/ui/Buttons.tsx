// src/components/IconButton.tsx
'use client';

import React, { ReactNode, ReactElement } from 'react';
import Link from 'next/link';
import TranslateAnimation from '../TranslateAnimation';

type IconButtonProps = {
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  tooltip?: string;
};

export default function IconButton({
  icon,
  href,
  onClick,
  ariaLabel,
  tooltip,
}: IconButtonProps): ReactElement {
  // Un bouton qui n'affiche qu'une icône a besoin d'un nom pour les lecteurs
  // d'écran : à défaut d'aria-label, on reprend le texte de l'infobulle.
  const label = ariaLabel ?? tooltip;
  const baseClasses = `
    p-3 bg-gray-800 text-white rounded-full shadow-lg
    hover:bg-gray-700 border-2 border-purple-500/80
    inline-flex items-center justify-center
    cursor-pointer
  `;

  const Control: ReactElement = href ? (
    <Link href={href} aria-label={label} className={baseClasses}>
      {icon}
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={baseClasses}
    >
      {icon}
    </button>
  );

  if (!tooltip) {
    return Control;
  }

  return (
    <div className="relative inline-block group">
      {Control}
      <span
        role="tooltip"
        className="
          absolute bottom-full left-1/2 mb-2
          -translate-x-1/2

          px-3 py-1.5 text-sm text-white
          bg-gray-800/90 rounded-md shadow-lg

          opacity-0 scale-75
          group-hover:opacity-100 group-hover:scale-100

          transform transition-all duration-200 ease-out

          whitespace-nowrap pointer-events-none z-50

          /* flèche sous la bulle */
          after:content-['']
          after:absolute
          after:top-full after:left-1/2
          after:-translate-x-1/2
          after:border-x-4 after:border-x-transparent
          after:border-t-4 after:border-t-gray-800/90
        "
      >
        <TranslateAnimation text={tooltip}/>
      </span>
    </div>
  );
}
