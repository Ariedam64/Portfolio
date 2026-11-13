"use client";

import { useMemo } from "react";
import cronstrue from "cronstrue";
import "cronstrue/locales/fr";
import { Cron } from "croner";
import { cn } from "@/app/lib/utils";
import { Label, Panel, StatusNote, TextInput, usePersistentState, useToolT } from "../ui";
import { formatDateTime, relativeTime } from "../time";

const PRESETS = [
  { key: "every5min", expr: "*/5 * * * *" },
  { key: "hourly", expr: "0 * * * *" },
  { key: "daily", expr: "0 0 * * *" },
  { key: "weekdays9", expr: "0 9 * * 1-5" },
  { key: "monday", expr: "0 9 * * 1" },
  { key: "monthly", expr: "0 0 1 * *" },
] as const;

const FIELDS_5 = ["minute", "hour", "dom", "month", "dow"] as const;
const FIELDS_6 = ["second", ...FIELDS_5] as const;

export default function CronTool() {
  const { t, i18n } = useToolT();
  const locale = i18n.language;
  const [expr, setExpr] = usePersistentState("cron:expr", "*/15 9-18 * * 1-5");

  const parts = expr.trim().split(/\s+/).filter(Boolean);
  const fieldNames = parts.length === 6 ? FIELDS_6 : FIELDS_5;

  const result = useMemo(() => {
    if (!expr.trim()) return null;
    let description: string;
    try {
      description = cronstrue.toString(expr, { locale, use24HourTimeFormat: true, throwExceptionOnParseError: true });
    } catch (e) {
      const message = typeof e === "string" ? e : e instanceof Error ? e.message : String(e);
      return { error: message.replace(/^Error:\s*/, "") };
    }
    try {
      const job = new Cron(expr.trim(), { paused: true });
      const runs = job.nextRuns(6);
      job.stop();
      return { description, runs, error: null };
    } catch (e) {
      return { description, runs: [] as Date[], error: e instanceof Error ? e.message : String(e) };
    }
  }, [expr, locale]);

  const now = Date.now();

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <Label htmlFor="cron-expr">{t("cron.expression")}</Label>
        <TextInput id="cron-expr" mono value={expr} onChange={(e) => setExpr(e.target.value)} className="text-lg" />
        {parts.length >= 5 && parts.length <= 6 && (
          <div className="flex flex-wrap gap-2">
            {parts.map((part, i) => (
              <div key={i} className="flex min-w-16 flex-col items-center rounded-lg border border-[#3a2f4c] bg-[#1c1824] px-2.5 py-1.5">
                <span className="font-mono text-sm text-white">{part}</span>
                <span className="text-[11px] text-[#a49fb0]">{t(`cron.fields.${fieldNames[i]}`)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(({ key, expr: preset }) => (
            <button
              key={key}
              type="button"
              onClick={() => setExpr(preset)}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#8b5cf6]",
                expr.trim() === preset ? "border-[#8b5cf6] bg-[#8b5cf6]/20 text-white" : "border-[#3a2f4c] text-[#a49fb0] hover:text-white",
              )}
            >
              {t(`cron.presets.${key}`)}
            </button>
          ))}
        </div>
      </Panel>

      {result?.description && (
        <Panel title={t("cron.meaning")}>
          <p className="text-xl font-semibold text-white first-letter:uppercase">{result.description}</p>
        </Panel>
      )}
      {result?.error && <StatusNote tone="error">{result.error}</StatusNote>}

      {result && "runs" in result && result.runs && result.runs.length > 0 && (
        <Panel title={t("cron.nextRuns")}>
          <ol className="grid gap-2">
            {result.runs.map((run) => (
              <li key={run.getTime()} className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-[#3a2f4c] bg-[#1c1824] px-3 py-2 text-sm">
                <span className="text-[#ece9f1] first-letter:uppercase">{formatDateTime(run, locale, { dateStyle: "full", timeStyle: "short" })}</span>
                <span className="text-[#a49fb0]">{relativeTime(run, locale, now)}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-[#6f687c]">{t("cron.timezone", { zone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</p>
        </Panel>
      )}
    </div>
  );
}
