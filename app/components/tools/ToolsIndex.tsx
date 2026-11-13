"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Background from "@/app/components/portfolio/Background";
import { CATEGORIES, TOOLS } from "@/app/lib/tools/registry";
import { useToolT } from "./ui";

/** Minuscules sans accents, pour que « hexa » trouve « Hexadécimal ». */
const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function ToolsIndex() {
  const { t } = useToolT();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return TOOLS;
    return TOOLS.filter((tool) =>
      normalize(`${tool.slug} ${t(`list.${tool.slug}.title`)} ${t(`list.${tool.slug}.description`)} ${t(`list.${tool.slug}.keywords`)}`).includes(q),
    );
  }, [query, t]);

  return (
    <>
      <Background />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-24 pb-24 text-[#ece9f1] sm:px-12 lg:px-16">
        <header className="flex flex-col gap-3 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{t("index.title")}</h1>
          <p className="mx-auto max-w-2xl text-[#a49fb0]">{t("index.subtitle")}</p>
          <p className="mx-auto text-sm text-[#6f687c]">{t("ui.local")}</p>
          <div className="relative mx-auto mt-2 w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-[#6f687c]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("index.search")}
              aria-label={t("index.search")}
              className="w-full rounded-full border border-[#3a2f4c] bg-[#121016]/85 py-2.5 pr-4 pl-10 text-[#ece9f1] placeholder:text-[#6f687c] backdrop-blur-md transition-colors focus:border-[#8b5cf6] focus:outline-none"
            />
          </div>
        </header>

        {visible.length === 0 && <p className="text-center text-[#a49fb0]">{t("index.empty")}</p>}

        {CATEGORIES.map((category) => {
          const tools = visible.filter((tool) => tool.category === category);
          if (tools.length === 0) return null;
          return (
            <section key={category} className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#a49fb0]">{t(`categories.${category}`)}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map(({ slug, icon: Icon }) => (
                  <Link
                    key={slug}
                    href={`/outils/${slug}`}
                    className="group flex min-h-20 items-center gap-3 rounded-2xl border border-[#3a2f4c] bg-[#121016]/85 p-4 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#8b5cf6] hover:shadow-[0_12px_40px_-16px_rgba(139,92,246,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#8b5cf6]/15 text-[#c4b5fd] transition-colors group-hover:bg-[#8b5cf6] group-hover:text-white">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="min-w-0 font-semibold text-white">{t(`list.${slug}.title`)}</h3>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </>
  );
}
