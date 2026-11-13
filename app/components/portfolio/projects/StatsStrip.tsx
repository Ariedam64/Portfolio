"use client";

import TranslateAnimation from "../../TranslateAnimation";

export interface Stat {
  value: string;
  label: string;
}

/** Chiffres clés sous le haut de page. 4 colonnes, 2x2 sur mobile. */
export default function StatsStrip({ items }: { items: Stat[] }) {
  if (items.length === 0) return null;

  return (
    <dl className="-mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border-2 border-[#3E304F] bg-[#18181be1] sm:-mt-6 lg:grid-cols-4">
      {items.map(({ value, label }, i) => (
        <div
          key={i}
          className="flex flex-col-reverse border-[#3E304F] p-4 sm:p-6 [&:nth-child(even)]:border-l max-lg:[&:nth-child(n+3)]:border-t lg:[&:not(:first-child)]:border-l"
        >
          <dt className="text-[13px] text-[#a1a1aa]">
            <TranslateAnimation text={label} />
          </dt>
          <dd className="text-2xl font-bold tracking-tight text-white sm:text-[30px]">
            <TranslateAnimation text={value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
