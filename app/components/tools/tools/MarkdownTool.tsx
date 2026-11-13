"use client";

import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeArea, CopyButton, Panel, Segmented, usePersistentState, useToolT } from "../ui";

const SAMPLE = `# Titre

Du texte avec **du gras**, de l'*italique*, du \`code\` et un [lien](https://github.com).

## Liste de tâches

- [x] Écrire le README
- [ ] Publier la release

| Outil | Lib |
| --- | --- |
| Diff | diff |
| Cron | cronstrue |

\`\`\`ts
const hello = (name: string) => \`Salut \${name}\`;
\`\`\`

> Une citation.
`;

const components: Components = {
  h1: ({ children }) => <h1 className="mt-6 mb-3 border-b border-[#3a2f4c] pb-2 text-2xl font-bold text-white first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-6 mb-3 border-b border-[#3a2f4c] pb-1.5 text-xl font-bold text-white first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-5 mb-2 text-lg font-semibold text-white first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-4 mb-2 font-semibold text-white first:mt-0">{children}</h4>,
  p: ({ children }) => <p className="mb-3 leading-relaxed last:mb-0">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#c4b5fd] underline underline-offset-2 hover:text-white">
      {children}
    </a>
  ),
  ul: ({ children, className }) => (
    <ul className={className?.includes("contains-task-list") ? "mb-3 space-y-1" : "mb-3 ml-5 list-disc space-y-1 marker:text-[#8b5cf6]"}>{children}</ul>
  ),
  ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1 marker:text-[#a49fb0]">{children}</ol>,
  input: (props) => <input {...props} disabled className="mr-2 size-3.5 translate-y-0.5 accent-[#8b5cf6]" />,
  blockquote: ({ children }) => <blockquote className="mb-3 border-l-4 border-[#8b5cf6]/60 pl-4 text-[#a49fb0]">{children}</blockquote>,
  hr: () => <hr className="my-5 border-[#3a2f4c]" />,
  pre: ({ children }) => <pre className="mb-3 overflow-x-auto rounded-xl border border-[#3a2f4c] bg-[#17141d] p-3 text-[13px] leading-relaxed">{children}</pre>,
  code: ({ children, className }) =>
    className ? (
      <code className="font-mono text-[#e9e3f5]">{children}</code>
    ) : (
      <code className="rounded bg-[#2a2335] px-1 py-0.5 font-mono text-[0.85em] text-[#e9e3f5]">{children}</code>
    ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-[#3a2f4c] bg-[#1c1824] px-3 py-1.5 text-left font-semibold text-white">{children}</th>,
  td: ({ children }) => <td className="border border-[#3a2f4c] px-3 py-1.5">{children}</td>,
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="my-2 max-w-full rounded-lg" />,
};

type View = "edit" | "preview";

export default function MarkdownTool() {
  const { t } = useToolT();
  const [input, setInput] = usePersistentState("markdown:input", SAMPLE);
  // Sur mobile, un seul volet à la fois.
  const [view, setView] = useState<View>("edit");

  return (
    <div className="flex flex-col gap-4">
      <div className="lg:hidden">
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: "edit", label: t("markdown.edit") },
            { value: "preview", label: t("markdown.preview") },
          ]}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Markdown" actions={<CopyButton text={input} />} className={view === "preview" ? "hidden lg:flex" : undefined}>
          <CodeArea value={input} onChange={(e) => setInput(e.target.value)} rows={24} aria-label="Markdown" />
        </Panel>
        <Panel title={t("markdown.preview")} className={view === "edit" ? "hidden lg:flex" : undefined}>
          <div className="min-h-64 overflow-auto rounded-xl border border-[#3a2f4c] bg-[#1c1824] p-4 text-[15px] text-[#d8d2e3] lg:max-h-[640px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {input}
            </ReactMarkdown>
          </div>
        </Panel>
      </div>
    </div>
  );
}
