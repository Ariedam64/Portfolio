"use client";

import React from "react";
import TranslateAnimation from "../../TranslateAnimation";

export interface Step {
  /** Conservé pour les données existantes, plus affiché. */
  icon?: string;
  title: string;
  desc: string;
}

export interface StepsListProps {
  /** Tableau d'objets { title, desc }. */
  steps: unknown;
}

/** Étapes d'un récit, en frise verticale. */
export default function StepsList({ steps }: StepsListProps) {
  const stepArray: Step[] = Array.isArray(steps) ? (steps as Step[]) : [];

  return (
    <ol className="list-none">
      {stepArray.map(({ title, desc }, index) => (
        <li
          key={index}
          className="relative pb-5 pl-7 last:pb-0 before:absolute before:bottom-[-4px] before:left-[5px] before:top-3 before:w-0.5 before:bg-[#3E304F] last:before:hidden"
        >
          <span aria-hidden className="absolute left-0 top-[7px] size-3 rounded-full border-2 border-[#c084fc] bg-[#18181b]" />
          <p className="font-bold text-[#e9d5ff]">
            <TranslateAnimation text={title} />
          </p>
          <p className="text-[#d4d4d8]">
            <TranslateAnimation text={desc} />
          </p>
        </li>
      ))}
    </ol>
  );
}
