"use client";

import { useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
import { diffChars, diffLines, diffWords, type ChangeObject } from "diff";
import { cn } from "@/app/lib/utils";
import { Button, Checkbox, CodeArea, Panel, Segmented, StatusNote, usePersistentState, useToolT } from "../ui";

type Mode = "lines" | "words" | "chars";

const BEFORE = `PORT=3000
DATABASE_URL=postgres://localhost/app
LOG_LEVEL=info
CACHE_TTL=60`;
const AFTER = `PORT=3000
DATABASE_URL=postgres://db.internal/app
LOG_LEVEL=debug
CACHE_TTL=60
RATE_LIMIT=10`;

/** Découpe un bloc de lignes en lignes, sans la ligne vide finale due au dernier « \n ». */
function splitLines(value: string) {
  const lines = value.split("\n");
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

export default function DiffTool() {
  const { t } = useToolT();
  const [before, setBefore] = usePersistentState("diff:before", BEFORE);
  const [after, setAfter] = usePersistentState("diff:after", AFTER);
  const [mode, setMode] = usePersistentState<Mode>("diff:mode", "lines");
  const [ignoreWhitespace, setIgnoreWhitespace] = usePersistentState("diff:ws", false);
  const [ignoreCase, setIgnoreCase] = usePersistentState("diff:case", false);

  const changes: ChangeObject<string>[] = useMemo(() => {
    if (mode === "lines") return diffLines(before, after, { ignoreWhitespace });
    if (mode === "words") return diffWords(before, after, { ignoreCase });
    return diffChars(before, after, { ignoreCase });
  }, [before, after, mode, ignoreWhitespace, ignoreCase]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const change of changes) {
      const n = mode === "lines" ? change.count ?? splitLines(change.value).length : change.value.length;
      if (change.added) added += n;
      else if (change.removed) removed += n;
    }
    return { added, removed };
  }, [changes, mode]);

  const identical = stats.added === 0 && stats.removed === 0;
  const unit = t(`diff.unit.${mode}`);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={t("diff.before")}>
          <CodeArea value={before} onChange={(e) => setBefore(e.target.value)} rows={12} aria-label={t("diff.before")} />
        </Panel>
        <Panel title={t("diff.after")}>
          <CodeArea value={after} onChange={(e) => setAfter(e.target.value)} rows={12} aria-label={t("diff.after")} />
        </Panel>
      </div>

      <Panel
        title={t("diff.result")}
        actions={
          <>
            <Segmented
              value={mode}
              onChange={setMode}
              ariaLabel={t("diff.mode")}
              options={[
                { value: "lines", label: t("diff.modes.lines") },
                { value: "words", label: t("diff.modes.words") },
                { value: "chars", label: t("diff.modes.chars") },
              ]}
            />
            <Button
              onClick={() => {
                setBefore(after);
                setAfter(before);
              }}
            >
              <ArrowLeftRight className="size-4" />
              {t("yaml.swap")}
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-4">
          {mode === "lines" && (
            <Checkbox checked={ignoreWhitespace} onChange={setIgnoreWhitespace}>
              {t("diff.ignoreWhitespace")}
            </Checkbox>
          )}
          {mode !== "lines" && (
            <Checkbox checked={ignoreCase} onChange={setIgnoreCase}>
              {t("diff.ignoreCase")}
            </Checkbox>
          )}
          {!identical && (
            <span className="text-sm">
              <span className="text-emerald-400">+{stats.added}</span> <span className="text-red-400">−{stats.removed}</span>{" "}
              <span className="text-[#a49fb0]">{unit}</span>
            </span>
          )}
        </div>

        {identical ? (
          <StatusNote tone="ok">{t("diff.identical")}</StatusNote>
        ) : mode === "lines" ? (
          <div className="overflow-x-auto rounded-xl border border-[#3a2f4c] bg-[#17141d] py-2 font-mono text-[13px] leading-relaxed">
            {changes.flatMap((change, i) =>
              splitLines(change.value).map((line, j) => (
                <div
                  key={`${i}-${j}`}
                  className={cn(
                    "flex min-w-fit px-3",
                    change.added && "bg-emerald-500/15 text-emerald-200",
                    change.removed && "bg-red-500/15 text-red-200",
                    !change.added && !change.removed && "text-[#a49fb0]",
                  )}
                >
                  <span className="w-5 shrink-0 select-none">{change.added ? "+" : change.removed ? "−" : " "}</span>
                  <span className="whitespace-pre">{line || " "}</span>
                </div>
              )),
            )}
          </div>
        ) : (
          <pre className="overflow-x-auto rounded-xl border border-[#3a2f4c] bg-[#17141d] p-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words text-[#d8d2e3]">
            {changes.map((change, i) => (
              <span
                key={i}
                className={cn(
                  change.added && "rounded-sm bg-emerald-500/25 text-emerald-200",
                  change.removed && "rounded-sm bg-red-500/25 text-red-200 line-through decoration-red-400/60",
                )}
              >
                {change.value}
              </span>
            ))}
          </pre>
        )}
      </Panel>
    </div>
  );
}
