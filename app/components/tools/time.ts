/** Formatage de dates partagé par les outils de temps et le JWT. */

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

/** « dans 3 heures », « il y a 2 jours », à la manière de Discord. */
export function relativeTime(date: Date, locale: string, now = Date.now()) {
  const diff = (date.getTime() - now) / 1000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, seconds] of UNITS) {
    if (abs >= seconds || unit === "second") return rtf.format(Math.round(diff / seconds), unit);
  }
  return "";
}

export function formatDateTime(date: Date, locale: string, options: Intl.DateTimeFormatOptions = { dateStyle: "full", timeStyle: "medium" }) {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/** Valeur pour un <input type="datetime-local">, à l'heure locale. */
export function toDateTimeLocal(date: Date, withSeconds = false) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const base = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return withSeconds ? `${base}:${pad(date.getSeconds())}` : base;
}

export const isValidDate = (date: Date) => !Number.isNaN(date.getTime());
