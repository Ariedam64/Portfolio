import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolShell from "@/app/components/tools/ToolShell";
import { isToolSlug, TOOLS } from "@/app/lib/tools/registry";
import frTools from "@/public/locales/fr/tools.json";

type Props = { params: Promise<{ tool: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map(({ slug }) => ({ tool: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  if (!isToolSlug(tool)) return {};
  const { title, description } = frTools.list[tool];
  const path = `/outils/${tool}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "Romann Madeira",
      title: `${title} · Romann Madeira`,
      description,
      url: path,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { tool } = await params;
  if (!isToolSlug(tool)) notFound();
  return <ToolShell slug={tool} />;
}
