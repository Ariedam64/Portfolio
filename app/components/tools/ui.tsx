"use client";

import { useEffect, useRef, useState, type ReactNode, type TextareaHTMLAttributes, type InputHTMLAttributes } from "react";
import { Check, Copy, Download, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/app/lib/utils";

/** Traductions des outils (espace de noms « tools »). */
export function useToolT() {
  return useTranslation("tools");
}

/**
 * État mémorisé dans le navigateur, pour retrouver sa saisie en revenant sur un
 * outil. Les composants d'outils ne sont rendus que côté client, donc la lecture
 * initiale ne crée pas d'écart d'hydratation.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const storageKey = `outils:${key}`;
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // stockage plein ou bloqué : tant pis, l'outil marche quand même
    }
  }, [storageKey, value]);
  return [value, setValue] as const;
}

export function Panel({ title, actions, children, className }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("flex min-w-0 flex-col gap-3 rounded-2xl border border-[#3a2f4c] bg-[#121016]/85 p-4 backdrop-blur-md sm:p-5", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-sm font-semibold uppercase tracking-wide text-[#a49fb0]">{title}</h2>}
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

const fieldBase =
  "w-full rounded-xl border border-[#3a2f4c] bg-[#1c1824] px-3 py-2 text-[#ece9f1] placeholder:text-[#6f687c] transition-colors focus:border-[#8b5cf6] focus:outline-none";

export function CodeArea({ className, rows = 10, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      className={cn(fieldBase, "resize-y font-mono text-[13px] leading-relaxed", props.readOnly && "bg-[#17141d]", className)}
      {...props}
    />
  );
}

export function TextInput({ className, mono, ...props }: InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }) {
  return <input spellCheck={false} autoComplete="off" className={cn(fieldBase, mono && "font-mono text-[13px]", className)} {...props} />;
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium text-[#a49fb0]">
      {children}
    </label>
  );
}

export function Button({
  children,
  onClick,
  variant = "ghost",
  disabled,
  type = "button",
  className,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] disabled:cursor-default disabled:opacity-40",
        variant === "primary"
          ? "bg-[#8b5cf6] text-white hover:bg-[#7c4ef0]"
          : "border border-[#3a2f4c] text-[#d8d2e3] hover:border-[#8b5cf6] hover:text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const { t } = useToolT();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // presse-papiers refusé : rien à faire de plus
    }
  };

  return (
    <Button onClick={copy} disabled={!text} ariaLabel={label ?? t("ui.copy")}>
      {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
      <span>{copied ? t("ui.copied") : label ?? t("ui.copy")}</span>
    </Button>
  );
}

/** Télécharge un contenu sous forme de fichier. */
export function downloadBlob(data: Blob, filename: string) {
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DownloadButton({ onClick, label, disabled }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      <Download className="size-4" />
      <span>{label}</span>
    </Button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  ariaLabel?: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex flex-wrap rounded-lg border border-[#3a2f4c] bg-[#1c1824] p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "cursor-pointer rounded-md px-2.5 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#8b5cf6]",
            value === option.value ? "bg-[#8b5cf6] text-white" : "text-[#a49fb0] hover:text-white",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#d8d2e3] select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 cursor-pointer accent-[#8b5cf6]" />
      {children}
    </label>
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  ariaLabel?: string;
}) {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as T)}
      className="cursor-pointer rounded-lg border border-[#3a2f4c] bg-[#1c1824] px-2.5 py-1.5 text-sm text-[#ece9f1] focus:border-[#8b5cf6] focus:outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** Ligne de statut discrète sous un champ, à la manière de la barre d'état d'un éditeur. */
export function StatusNote({ tone, children }: { tone: "ok" | "error" | "info"; children: ReactNode }) {
  const Icon = tone === "ok" ? Check : tone === "error" ? X : Info;
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "flex items-start gap-1.5 text-[13px] leading-snug break-words",
        tone === "ok" && "text-[#8fbf9f]",
        tone === "error" && "text-[#e08a8a]",
        tone === "info" && "text-[#a49fb0]",
      )}
    >
      <Icon className="mt-px size-3.5 shrink-0" strokeWidth={2.5} />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

/** Ligne « libellé : valeur » avec bouton copier, pour les résultats courts. */
export function ValueRow({ label, value, mono = true }: { label: ReactNode; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-[#3a2f4c] bg-[#1c1824] px-3 py-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="shrink-0 text-xs font-medium text-[#a49fb0] sm:w-40">{label}</span>
      <span className={cn("min-w-0 flex-1 break-all text-[#ece9f1]", mono && "font-mono text-[13px]")}>{value || "—"}</span>
      <div className="shrink-0">
        <CopyButton text={value} />
      </div>
    </div>
  );
}

/** Choix d'un fichier par clic ou glisser-déposer. */
export function FileDrop({ onFile, label }: { onFile: (file: File) => void; label: string }) {
  const [over, setOver] = useState(false);
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-6 text-center text-sm transition-colors",
        over ? "border-[#8b5cf6] bg-[#8b5cf6]/10 text-white" : "border-[#3a2f4c] text-[#a49fb0] hover:border-[#8b5cf6]",
      )}
    >
      <input
        type="file"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      {label}
    </label>
  );
}

/** Taille lisible dans la langue courante : « 1,5 ko » ou « 1.5 kB ». */
export function formatBytes(bytes: number, locale: string) {
  const [value, unit] =
    bytes < 1024 ? [bytes, "byte"] : bytes < 1024 * 1024 ? [bytes / 1024, "kilobyte"] : [bytes / 1024 / 1024, "megabyte"];
  return new Intl.NumberFormat(locale, { style: "unit", unit: unit as string, maximumFractionDigits: 1 }).format(value as number);
}
