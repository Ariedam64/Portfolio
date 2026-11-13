import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import TranslateAnimation from "../../TranslateAnimation";

export interface ProjectLink {
  href: string;
  label: string;
  /** Lien vers le code : bouton plein. Les autres sont en contour. */
  primary?: boolean;
}

export default function ProjectLinks({ links, className }: { links: ProjectLink[]; className?: string }) {
  const valid = links.filter((l) => l.href);
  if (valid.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {valid.map(({ href, label, primary }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9333ea]",
            primary
              ? "bg-[#9333ea33] text-[#c084fc] hover:bg-[#9333ea55] hover:text-white"
              : "border border-[#3E304F] text-gray-200 hover:border-[#9333ea]/60 hover:text-white",
          )}
        >
          <TranslateAnimation text={label} />
          {primary ? <ArrowRight className="size-4" /> : <ArrowUpRight className="size-4" />}
        </a>
      ))}
    </div>
  );
}

/** Liens « Voir le code » / « Voir le site » d'un module, sans les vides. */
export function codeAndSiteLinks(
  t: (key: string) => string,
  { repoUrl, siteUrl }: { repoUrl?: string; siteUrl?: string },
): ProjectLink[] {
  return [
    { href: repoUrl ?? "", label: t("portfolio.sections.viewCode"), primary: true },
    { href: siteUrl ?? "", label: t("portfolio.sections.viewSite") },
  ].filter((l) => l.href);
}
