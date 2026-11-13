"use client";

import React, { ReactNode } from "react";

export interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-24 text-left leading-relaxed text-[#d4d4d8] sm:gap-14 sm:px-6 lg:px-8">
      {children}
    </main>
  );
}
