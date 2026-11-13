"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/Tabs";
import TranslateAnimation from "../../TranslateAnimation";
import { Eyebrow } from "./Section";

export interface TabItem<T> {
  key: string;
  label: string;
  content: T;
}

export interface TabsSectionProps<T> {
  items: TabItem<T>[];
  renderContent: (item: TabItem<T>) => React.ReactNode;
  eyebrow?: string;
  title?: string;
}

export default function TabsSection<T>({ items, renderContent, eyebrow, title }: TabsSectionProps<T>) {
  if (items.length === 0) return null;

  return (
    <section>
      {(eyebrow || title) && (
        <div className="mb-5 space-y-1.5 text-center">
          {eyebrow && <Eyebrow text={eyebrow} />}
          {title && (
            <h2 className="text-2xl font-bold text-white sm:text-[26px]">
              <TranslateAnimation text={title} />
            </h2>
          )}
        </div>
      )}

      <Tabs defaultValue={items[0].key} className="w-full">
        {/* Un seul onglet : la barre ne sert à rien. Sinon, pastilles à largeur
            naturelle qui passent à la ligne entières, jamais en plein mot. */}
        {items.length > 1 && (
          <TabsList className="mx-auto mb-5 flex w-fit max-w-full flex-wrap justify-center gap-1.5 rounded-2xl border border-[#3E304F] bg-[#120f17] p-1.5 text-[#a1a1aa]">
            {items.map((item) => (
              <TabsTrigger
                key={item.key}
                value={item.key}
                className="whitespace-nowrap rounded-xl border-none px-3.5 py-2 text-sm font-semibold hover:text-white data-[state=active]:bg-[#9333ea33] data-[state=active]:text-[#c084fc] sm:text-[15px]"
              >
                <TranslateAnimation text={item.label} />
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {items.map((item) => (
          <TabsContent key={item.key} value={item.key}>
            <div className="flex flex-col gap-5 rounded-2xl border-2 border-[#3E304F] bg-[#18181be1] p-4 sm:p-7">
              {renderContent(item)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
