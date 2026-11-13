"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { ArrowLeft } from "lucide-react";
import Background from "@/app/components/portfolio/Background";
import { getTool, type ToolSlug } from "@/app/lib/tools/registry";
import { useToolT } from "./ui";

function Loading() {
  return <div className="h-64 animate-pulse rounded-2xl border border-[#3a2f4c] bg-[#121016]/60" />;
}

// Chaque outil est chargé à part, seulement sur sa page, et uniquement dans le
// navigateur : ils lisent l'heure, le presse-papiers ou le stockage local.
const load = (importer: () => Promise<{ default: ComponentType }>) => dynamic(importer, { ssr: false, loading: Loading });

const TOOL_COMPONENTS: Record<ToolSlug, ComponentType> = {
  json: load(() => import("./tools/JsonTool")),
  yaml: load(() => import("./tools/YamlTool")),
  "json-to-ts": load(() => import("./tools/JsonToTsTool")),
  sql: load(() => import("./tools/SqlTool")),
  markdown: load(() => import("./tools/MarkdownTool")),
  diff: load(() => import("./tools/DiffTool")),
  regex: load(() => import("./tools/RegexTool")),
  base64: load(() => import("./tools/Base64Tool")),
  jwt: load(() => import("./tools/JwtTool")),
  hash: load(() => import("./tools/HashTool")),
  "base-converter": load(() => import("./tools/BaseConverterTool")),
  "unix-time": load(() => import("./tools/UnixTimeTool")),
  "discord-timestamp": load(() => import("./tools/DiscordTimestampTool")),
  cron: load(() => import("./tools/CronTool")),
  uuid: load(() => import("./tools/UuidTool")),
  qrcode: load(() => import("./tools/QrCodeTool")),
};

export default function ToolShell({ slug }: { slug: ToolSlug }) {
  const { t } = useToolT();
  const { icon: Icon } = getTool(slug);
  const Tool = TOOL_COMPONENTS[slug];

  return (
    <>
      <Background />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-24 text-[#ece9f1] sm:px-12 lg:px-16">
        <Link
          href="/outils"
          className="inline-flex w-fit items-center gap-1.5 rounded-lg text-sm text-[#a49fb0] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
        >
          <ArrowLeft className="size-4" />
          {t("ui.allTools")}
        </Link>

        <header className="flex items-center gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[#3a2f4c] bg-[#8b5cf6]/15 text-[#c4b5fd]">
            <Icon className="size-6" />
          </div>
          <h1 className="min-w-0 text-2xl font-bold text-white sm:text-3xl">{t(`list.${slug}.title`)}</h1>
        </header>

        <Tool />
      </main>
    </>
  );
}
