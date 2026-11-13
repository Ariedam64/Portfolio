"use client";

import React from "react";
import TranslateAnimation from "../../TranslateAnimation";

export interface ListSectionProps {
  /** Tableau de chaînes, ou d'objets { text } venant des traductions. */
  items: unknown;
}

function toTexts(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    if (typeof item === "string" || typeof item === "number") return [String(item)];
    if (item && typeof item === "object" && "text" in item) {
      const text = (item as { text: unknown }).text;
      if (typeof text === "string" || typeof text === "number") return [String(text)];
    }
    return [];
  });
}

export default function ListSection({ items }: ListSectionProps) {
  return (
    <ul className="list-none space-y-2">
      {toTexts(items).map((text, idx) => (
        <li key={idx} className="relative pl-4">
          <span aria-hidden className="absolute left-0 top-[0.6em] size-1.5 rounded-full bg-[#71717a]" />
          <TranslateAnimation text={text} />
        </li>
      ))}
    </ul>
  );
}
