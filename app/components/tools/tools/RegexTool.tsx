"use client";

import { Fragment, useMemo } from "react";
import { cn } from "@/app/lib/utils";
import { CodeArea, CopyButton, Label, Panel, StatusNote, TextInput, usePersistentState, useToolT } from "../ui";

const FLAGS = ["g", "i", "m", "s", "u"] as const;
const MAX_MATCHES = 1000;

const SAMPLE_TEXT = `2026-11-13 04:12:09 [ERROR] api: timeout after 3000ms (req=8f3a)
2026-11-13 04:12:11 [INFO] ws: 152 clients connected
2026-11-13 04:13:45 [WARN] api: slow query 812ms (req=91c2)
2026-11-13 04:15:02 [ERROR] ws: client 77 dropped`;

type Match = { index: number; text: string; groups: (string | undefined)[]; named?: Record<string, string | undefined> };

export default function RegexTool() {
  const { t } = useToolT();
  const [pattern, setPattern] = usePersistentState("regex:pattern", "\\[(?<level>ERROR|WARN)\\] (\\w+): (.+)");
  const [flags, setFlags] = usePersistentState("regex:flags", "gm");
  const [text, setText] = usePersistentState("regex:text", SAMPLE_TEXT);
  const [replacement, setReplacement] = usePersistentState("regex:replace", "");

  const result = useMemo(() => {
    if (!pattern) return { regex: null, error: null as string | null, matches: [] as Match[], truncated: false };
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags);
    } catch (e) {
      return { regex: null, error: e instanceof Error ? e.message : String(e), matches: [], truncated: false };
    }
    const matches: Match[] = [];
    let truncated = false;
    if (regex.global) {
      for (const m of text.matchAll(regex)) {
        if (matches.length >= MAX_MATCHES) {
          truncated = true;
          break;
        }
        matches.push({ index: m.index ?? 0, text: m[0], groups: m.slice(1), named: m.groups });
      }
    } else {
      const m = regex.exec(text);
      if (m) matches.push({ index: m.index, text: m[0], groups: m.slice(1), named: m.groups });
    }
    return { regex, error: null, matches, truncated };
  }, [pattern, flags, text]);

  // Texte découpé en morceaux surlignés ou non.
  const highlighted = useMemo(() => {
    const parts: { text: string; match: boolean }[] = [];
    let cursor = 0;
    for (const m of result.matches) {
      if (m.text.length === 0) continue;
      if (m.index > cursor) parts.push({ text: text.slice(cursor, m.index), match: false });
      parts.push({ text: m.text, match: true });
      cursor = m.index + m.text.length;
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
    return parts;
  }, [result.matches, text]);

  const replaced = useMemo(() => {
    if (!result.regex || !replacement) return "";
    try {
      return text.replace(result.regex, replacement);
    } catch {
      return "";
    }
  }, [result.regex, replacement, text]);

  const toggleFlag = (flag: string) => setFlags(flags.includes(flag) ? flags.replace(flag, "") : flags + flag);
  const groupCount = Math.max(0, ...result.matches.map((m) => m.groups.length));
  const groupNames = Object.keys(result.matches[0]?.named ?? {});

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <Label htmlFor="regex-pattern">{t("regex.pattern")}</Label>
        <div className="flex items-center gap-1 rounded-xl border border-[#3a2f4c] bg-[#1c1824] px-3 font-mono text-[15px] focus-within:border-[#8b5cf6]">
          <span className="text-[#6f687c]">/</span>
          <input
            id="regex-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2 text-[#ece9f1] focus:outline-none"
          />
          <span className="text-[#6f687c]">/{flags}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map((flag) => (
            <button
              key={flag}
              type="button"
              aria-pressed={flags.includes(flag)}
              onClick={() => toggleFlag(flag)}
              className={cn(
                "cursor-pointer rounded-lg border px-2.5 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#8b5cf6]",
                flags.includes(flag) ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white" : "border-[#3a2f4c] text-[#a49fb0] hover:text-white",
              )}
            >
              <span className="font-mono">{flag}</span> <span className="text-xs">{t(`regex.flags.${flag}`)}</span>
            </button>
          ))}
        </div>
        {result.error && <StatusNote tone="error">{result.error}</StatusNote>}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={t("regex.text")}>
          <CodeArea value={text} onChange={(e) => setText(e.target.value)} rows={12} aria-label={t("regex.text")} />
        </Panel>
        <Panel title={t("regex.matchCount", { count: result.matches.length })}>
          <pre className="min-h-[15rem] overflow-auto rounded-xl border border-[#3a2f4c] bg-[#17141d] p-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words text-[#a49fb0]">
            {highlighted.map((part, i) =>
              part.match ? (
                <mark key={i} className="rounded-sm bg-[#8b5cf6]/35 text-white">
                  {part.text}
                </mark>
              ) : (
                <Fragment key={i}>{part.text}</Fragment>
              ),
            )}
          </pre>
          {result.truncated && <StatusNote tone="info">{t("regex.truncated", { max: MAX_MATCHES })}</StatusNote>}
        </Panel>
      </div>

      {result.matches.length > 0 && groupCount > 0 && (
        <Panel title={t("regex.groups")}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[13px]">
              <thead>
                <tr className="text-left text-[#a49fb0]">
                  <th className="border-b border-[#3a2f4c] px-2 py-1.5 font-medium">#</th>
                  <th className="border-b border-[#3a2f4c] px-2 py-1.5 font-medium">{t("regex.match")}</th>
                  {Array.from({ length: groupCount }, (_, g) => (
                    <th key={g} className="border-b border-[#3a2f4c] px-2 py-1.5 font-medium">
                      ${g + 1}
                    </th>
                  ))}
                  {groupNames.map((name) => (
                    <th key={name} className="border-b border-[#3a2f4c] px-2 py-1.5 font-medium text-[#c4b5fd]">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.matches.slice(0, 200).map((m, i) => (
                  <tr key={i} className="text-[#d8d2e3]">
                    <td className="border-b border-[#3a2f4c]/50 px-2 py-1.5 text-[#6f687c]">{i + 1}</td>
                    <td className="border-b border-[#3a2f4c]/50 px-2 py-1.5 break-all">{m.text}</td>
                    {Array.from({ length: groupCount }, (_, g) => (
                      <td key={g} className="border-b border-[#3a2f4c]/50 px-2 py-1.5 break-all">
                        {m.groups[g] ?? <span className="text-[#6f687c]">—</span>}
                      </td>
                    ))}
                    {groupNames.map((name) => (
                      <td key={name} className="border-b border-[#3a2f4c]/50 px-2 py-1.5 break-all">
                        {m.named?.[name] ?? <span className="text-[#6f687c]">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel title={t("regex.replace")}>
        <TextInput mono value={replacement} onChange={(e) => setReplacement(e.target.value)} placeholder={t("regex.replacePlaceholder")} aria-label={t("regex.replace")} />
        {replacement && (
          <>
            <CodeArea value={replaced} readOnly rows={6} aria-label={t("ui.output")} />
            <div className="flex justify-end">
              <CopyButton text={replaced} />
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
