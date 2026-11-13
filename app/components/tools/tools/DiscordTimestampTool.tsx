"use client";

import { useEffect, useState } from "react";
import { Button, CopyButton, Label, Panel, TextInput, useToolT } from "../ui";
import { formatDateTime, isValidDate, relativeTime, toDateTimeLocal } from "../time";

/** Les 7 styles de Discord, avec le rendu qu'en fait le client Discord. */
const STYLES: { code: string; options?: Intl.DateTimeFormatOptions }[] = [
  { code: "t", options: { hour: "2-digit", minute: "2-digit" } },
  { code: "T", options: { hour: "2-digit", minute: "2-digit", second: "2-digit" } },
  { code: "d", options: { day: "2-digit", month: "2-digit", year: "numeric" } },
  { code: "D", options: { day: "numeric", month: "long", year: "numeric" } },
  { code: "f", options: { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" } },
  { code: "F", options: { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" } },
  { code: "R" },
];

const SHORTCUTS: { key: string; ms: number }[] = [
  { key: "plus1h", ms: 3600_000 },
  { key: "plus1d", ms: 86_400_000 },
  { key: "plus1w", ms: 7 * 86_400_000 },
];

export default function DiscordTimestampTool() {
  const { t, i18n } = useToolT();
  const locale = i18n.language;
  const [value, setValue] = useState(() => toDateTimeLocal(new Date()));
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = new Date(value);
  const valid = isValidDate(date);
  const unix = valid ? Math.floor(date.getTime() / 1000) : 0;

  return (
    <div className="flex flex-col gap-4">
      <Panel title={t("discord.date")}>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="discord-date">{t("discord.localTime")}</Label>
            <TextInput id="discord-date" type="datetime-local" value={value} onChange={(e) => setValue(e.target.value)} className="[color-scheme:dark]" />
          </div>
          <Button onClick={() => setValue(toDateTimeLocal(new Date()))}>{t("unix.useNow")}</Button>
          {SHORTCUTS.map(({ key, ms }) => (
            <Button key={key} onClick={() => setValue(toDateTimeLocal(new Date((valid ? date.getTime() : Date.now()) + ms)))}>
              {t(`discord.${key}`)}
            </Button>
          ))}
        </div>
        <p className="text-xs text-[#6f687c]">{t("discord.hint")}</p>
      </Panel>

      {valid && (
        <Panel title={t("discord.formats")}>
          <div className="grid gap-2">
            {STYLES.map(({ code, options }) => {
              const tag = `<t:${unix}:${code}>`;
              const preview = code === "R" ? relativeTime(date, locale, now) : formatDateTime(date, locale, options);
              return (
                <div key={code} className="flex flex-col gap-2 rounded-xl border border-[#3a2f4c] bg-[#1c1824] px-3 py-2 sm:flex-row sm:items-center sm:gap-3">
                  <code className="shrink-0 font-mono text-[13px] text-[#c4b5fd] sm:w-52">{tag}</code>
                  <div className="min-w-0 flex-1">
                    <span className="rounded bg-[#3a2f4c]/70 px-1.5 py-0.5 text-sm text-[#ece9f1]">{preview}</span>
                    <span className="ml-2 text-xs text-[#6f687c]">{t(`discord.styles.${code}`)}</span>
                  </div>
                  <CopyButton text={tag} />
                </div>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}
