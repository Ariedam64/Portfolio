"use client";

import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Github, Globe, Linkedin, Mail } from "lucide-react";
import {
  CONTACT_LINKS,
  METRICS,
  PROJECTS,
  type ContactLink,
  type Locale,
  type MetricId,
  type ProjectId,
} from "@/app/lib/chat/catalog";

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2.5 ml-4 list-disc space-y-1 last:mb-0 marker:text-[#8b5cf6]">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2.5 ml-4 list-decimal space-y-1 last:mb-0 marker:text-[#a49fb0]">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  a: ({ href = "", children }) =>
    isExternal(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#c4b5fd] underline underline-offset-2 hover:text-white">
        {children}
      </a>
    ) : (
      <Link href={href} className="text-[#c4b5fd] underline underline-offset-2 hover:text-white">
        {children}
      </Link>
    ),
  code: ({ children }) => <code className="rounded bg-[#2a2335] px-1 py-0.5 text-[0.85em] text-[#e9e3f5]">{children}</code>,
  // Pas de titres ni de tableaux dans une bulle de chat : on les ramène à du texte.
  h1: ({ children }) => <p className="mb-2 font-semibold text-white">{children}</p>,
  h2: ({ children }) => <p className="mb-2 font-semibold text-white">{children}</p>,
  h3: ({ children }) => <p className="mb-2 font-semibold text-white">{children}</p>,
};

export function Markdown({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {text}
    </ReactMarkdown>
  );
}

const chipLink =
  "inline-flex items-center gap-1.5 rounded-full border border-[#3a2f4c] px-2.5 py-1 text-xs text-[#d8d2e3] transition-colors hover:border-[#8b5cf6] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]";

export function ProjectCards({
  ids,
  locale,
  labels,
}: {
  ids: ProjectId[];
  locale: Locale;
  labels: { viewProject: string; github: string; site: string };
}) {
  return (
    <div className="mt-3 space-y-2.5">
      {ids.map((id) => {
        const p = PROJECTS[id];
        return (
          <article key={id} className="overflow-hidden rounded-xl border border-[#3a2f4c] bg-[#1c1824]">
            <div className="flex gap-3 p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element -- petites vignettes locales, pas besoin de next/image */}
              <img
                src={p.image}
                alt=""
                loading="lazy"
                className="h-[72px] w-[96px] shrink-0 rounded-lg object-cover object-top"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-[Comfortaa] text-sm font-bold leading-snug text-white">{p.title[locale]}</h4>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#a49fb0]">{p.tagline[locale]}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 border-t border-[#2a2335] px-2.5 py-2">
              {p.stack.map((tech) => (
                <span key={tech} className="rounded-md bg-[#2a2335] px-1.5 py-0.5 text-[11px] text-[#c9c2d6]">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 px-2.5 pb-2.5">
              {"page" in p && p.page && (
                <Link href={p.page} className={`${chipLink} border-[#8b5cf6]/60 bg-[#8b5cf6]/15 text-white`}>
                  {labels.viewProject}
                </Link>
              )}
              {"repo" in p && p.repo && (
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className={chipLink}>
                  <Github className="size-3.5" aria-hidden />
                  {labels.github}
                </a>
              )}
              {"site" in p && p.site && (
                <a href={p.site} target="_blank" rel="noopener noreferrer" className={chipLink}>
                  <Globe className="size-3.5" aria-hidden />
                  {labels.site}
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function MetricTiles({ ids, locale }: { ids: MetricId[]; locale: Locale }) {
  return (
    <dl className="mt-3 grid grid-cols-2 gap-2">
      {ids.map((id) => {
        const m = METRICS[id];
        return (
          <div key={id} className="rounded-xl border border-[#3a2f4c] bg-[#1c1824] px-3 py-2.5">
            <dd className="font-[Comfortaa] text-xl font-bold tabular-nums leading-tight text-[#c4b5fd]">{m.value}</dd>
            <dt className="mt-1 text-[11px] leading-snug text-[#a49fb0]">{m.label[locale]}</dt>
          </div>
        );
      })}
    </dl>
  );
}

const contactIcons: Record<ContactLink["kind"], typeof Mail> = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  cv: FileText,
};

export function ContactLinks({ locale }: { locale: Locale }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {CONTACT_LINKS.map((link) => {
        const Icon = contactIcons[link.kind];
        const href = link.href[locale];
        return (
          <a
            key={link.kind}
            href={href}
            {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="inline-flex items-center gap-2 rounded-lg border border-[#3a2f4c] bg-[#1c1824] px-3 py-2 text-sm text-[#ece9f1] transition-colors hover:border-[#8b5cf6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
          >
            <Icon className="size-4 text-[#c4b5fd]" aria-hidden />
            {link.label[locale]}
          </a>
        );
      })}
    </div>
  );
}

export function Suggestions({
  questions,
  onPick,
  disabled,
}: {
  questions: string[];
  onPick: (q: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-3 flex flex-col items-start gap-1.5">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onPick(q)}
          className="rounded-full border border-[#3a2f4c] bg-transparent px-3 py-1.5 text-left text-[13px] text-[#d8d2e3] transition-colors hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/10 hover:text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] cursor-pointer disabled:cursor-default"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
