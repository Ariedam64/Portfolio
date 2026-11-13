"use client";

import { useEffect, useState } from "react";
import { Button, CopyButton, Label, Panel, StatusNote, TextInput, ValueRow, useToolT } from "../ui";
import { formatDateTime, isValidDate, relativeTime, toDateTimeLocal } from "../time";

/** Devine l'unité d'après le nombre de chiffres : secondes, millisecondes ou microsecondes. */
function parseTimestamp(raw: string): { date: Date; unit: "s" | "ms" | "us" } | null {
  const s = raw.trim();
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  const digits = s.replace(/^-/, "").split(".")[0].length;
  const unit = digits >= 15 ? "us" : digits >= 12 ? "ms" : "s";
  const ms = unit === "s" ? n * 1000 : unit === "ms" ? n : n / 1000;
  const date = new Date(ms);
  return isValidDate(date) ? { date, unit } : null;
}

export default function UnixTimeTool() {
  const { t, i18n } = useToolT();
  const locale = i18n.language;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const [input, setInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const parsed = input.trim() ? parseTimestamp(input) : null;

  const [local, setLocal] = useState(() => toDateTimeLocal(new Date(), true));
  const localDate = new Date(local);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="flex flex-col gap-4">
      <Panel title={t("unix.now")}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-3xl font-bold text-white tabular-nums">{Math.floor(now / 1000)}</span>
          <CopyButton text={String(Math.floor(now / 1000))} label={t("unix.seconds")} />
          <CopyButton text={String(now)} label={t("unix.milliseconds")} />
        </div>
        <p className="text-sm text-[#a49fb0]">
          {formatDateTime(new Date(now), locale)} · {timeZone}
        </p>
      </Panel>

      <Panel title={t("unix.toDate")}>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Label htmlFor="ts-input">{t("unix.timestamp")}</Label>
            <TextInput id="ts-input" mono inputMode="numeric" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <Button onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}>{t("unix.useNow")}</Button>
        </div>
        {input.trim() && !parsed && <StatusNote tone="error">{t("unix.invalid")}</StatusNote>}
        {parsed && (
          <div className="grid gap-2">
            <StatusNote tone="info">{t("unix.detected", { unit: t(`unix.units.${parsed.unit}`) })}</StatusNote>
            <ValueRow label={t("unix.local")} value={formatDateTime(parsed.date, locale)} mono={false} />
            <ValueRow label="UTC (ISO 8601)" value={parsed.date.toISOString()} />
            <ValueRow label="RFC 2822" value={parsed.date.toUTCString()} />
            <ValueRow label={t("unix.relative")} value={relativeTime(parsed.date, locale, now)} mono={false} />
          </div>
        )}
      </Panel>

      <Panel title={t("unix.toTimestamp")}>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="date-input">{t("unix.dateLocal", { zone: timeZone })}</Label>
            <TextInput id="date-input" type="datetime-local" step={1} value={local} onChange={(e) => setLocal(e.target.value)} className="[color-scheme:dark]" />
          </div>
          <Button onClick={() => setLocal(toDateTimeLocal(new Date(), true))}>{t("unix.useNow")}</Button>
        </div>
        {isValidDate(localDate) && (
          <div className="grid gap-2">
            <ValueRow label={t("unix.seconds")} value={String(Math.floor(localDate.getTime() / 1000))} />
            <ValueRow label={t("unix.milliseconds")} value={String(localDate.getTime())} />
            <ValueRow label="UTC (ISO 8601)" value={localDate.toISOString()} />
          </div>
        )}
      </Panel>
    </div>
  );
}
