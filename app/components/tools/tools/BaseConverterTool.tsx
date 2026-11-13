"use client";

import { useState } from "react";
import { CodeArea, CopyButton, Label, Panel, StatusNote, TextInput, ValueRow, usePersistentState, useToolT } from "../ui";
import { bytesToHex, bytesToUtf8, hexToBytes } from "../bytes";

type Base = "dec" | "hex" | "bin" | "oct";

const BASES: { id: Base; radix: number; prefix: string; pattern: RegExp }[] = [
  { id: "dec", radix: 10, prefix: "", pattern: /^-?\d+$/ },
  { id: "hex", radix: 16, prefix: "0x", pattern: /^-?[0-9a-f]+$/i },
  { id: "bin", radix: 2, prefix: "0b", pattern: /^-?[01]+$/ },
  { id: "oct", radix: 8, prefix: "0o", pattern: /^-?[0-7]+$/ },
];

/** Lit un nombre en acceptant espaces, « _ » et préfixes 0x/0b/0o. BigInt : pas de limite de taille. */
function parse(raw: string, base: (typeof BASES)[number]): bigint | null {
  let s = raw.replace(/[\s_]/g, "");
  const negative = s.startsWith("-");
  if (negative) s = s.slice(1);
  if (base.prefix && s.toLowerCase().startsWith(base.prefix)) s = s.slice(2);
  if (!s || !base.pattern.test(s)) return null;
  const value = base.radix === 10 ? BigInt(s) : BigInt(`${base.prefix}${s}`);
  return negative ? -value : value;
}

/** Groupe les chiffres pour la lecture : 4 par 4 en binaire, 2 par 2 en hexa. */
function format(value: bigint, base: (typeof BASES)[number], grouped: boolean) {
  const negative = value < BigInt(0);
  let digits = (negative ? -value : value).toString(base.radix);
  if (grouped && (base.id === "bin" || base.id === "hex")) {
    const size = base.id === "bin" ? 4 : 2;
    digits = digits.padStart(Math.ceil(digits.length / size) * size, "0");
    digits = digits.match(new RegExp(`.{${size}}`, "g"))!.join(" ");
  }
  if (base.id === "hex") digits = digits.toUpperCase();
  return `${negative ? "-" : ""}${digits}`;
}

export default function BaseConverterTool() {
  const { t } = useToolT();
  const [raw, setRaw] = usePersistentState<{ base: Base; text: string }>("base:raw", { base: "dec", text: "3735928559" });

  const source = BASES.find((b) => b.id === raw.base)!;
  const value = raw.text.trim() ? parse(raw.text, source) : null;
  const invalid = raw.text.trim() !== "" && value === null;

  const fieldValue = (base: (typeof BASES)[number]) => (base.id === raw.base ? raw.text : value === null ? "" : format(value, base, true));

  const fits64 = value !== null && value >= -(BigInt(1) << BigInt(63)) && value < BigInt(1) << BigInt(64);
  const bytesBE =
    value !== null && value >= BigInt(0)
      ? (() => {
          const hex = value.toString(16);
          return hex.padStart(hex.length + (hex.length % 2), "0").match(/../g)!;
        })()
      : null;

  const [text, setText] = useState("Hello");
  const [hex, setHex] = useState(() => bytesToHex(new TextEncoder().encode("Hello")));
  const [hexError, setHexError] = useState<string | null>(null);

  const onText = (v: string) => {
    setText(v);
    setHex(bytesToHex(new TextEncoder().encode(v)));
    setHexError(null);
  };
  const onHex = (v: string) => {
    setHex(v);
    try {
      const decoded = bytesToUtf8(hexToBytes(v));
      if (decoded === null) {
        setHexError(t("converter.notUtf8"));
      } else {
        setText(decoded);
        setHexError(null);
      }
    } catch {
      setHexError(t("converter.invalidHex"));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Panel title={t("converter.numbers")}>
        <div className="grid gap-3 sm:grid-cols-2">
          {BASES.map((base) => (
            <div key={base.id} className="flex flex-col gap-1">
              <Label htmlFor={`base-${base.id}`}>{t(`converter.bases.${base.id}`)}</Label>
              <div className="flex gap-2">
                <TextInput
                  id={`base-${base.id}`}
                  mono
                  value={fieldValue(base)}
                  onChange={(e) => setRaw({ base: base.id, text: e.target.value })}
                  aria-invalid={invalid && base.id === raw.base}
                  className={invalid && base.id === raw.base ? "border-red-500/60" : undefined}
                />
                <CopyButton text={value === null ? "" : `${base.prefix}${format(value, base, false)}`} label={base.prefix || "#"} />
              </div>
            </div>
          ))}
        </div>
        {invalid && <StatusNote tone="error">{t("converter.invalidNumber", { base: t(`converter.bases.${raw.base}`) })}</StatusNote>}
        {value !== null && (
          <div className="grid gap-2">
            <ValueRow label={t("converter.bits")} value={String(value < BigInt(0) ? (-value).toString(2).length + 1 : value.toString(2).length)} />
            {fits64 && (
              <>
                <ValueRow label="int32 / uint32" value={`${BigInt.asIntN(32, value)} / ${BigInt.asUintN(32, value)}`} />
                <ValueRow label="int64 / uint64" value={`${BigInt.asIntN(64, value)} / ${BigInt.asUintN(64, value)}`} />
              </>
            )}
            {bytesBE && (
              <>
                <ValueRow label={t("converter.bytesBE")} value={bytesBE.join(" ").toUpperCase()} />
                <ValueRow label={t("converter.bytesLE")} value={[...bytesBE].reverse().join(" ").toUpperCase()} />
              </>
            )}
          </div>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={t("converter.text")} actions={<CopyButton text={text} />}>
          <CodeArea value={text} onChange={(e) => onText(e.target.value)} rows={8} aria-label={t("converter.text")} />
        </Panel>
        <Panel title={t("converter.hexBytes")} actions={<CopyButton text={hex} />}>
          <CodeArea value={hex} onChange={(e) => onHex(e.target.value)} rows={8} aria-label={t("converter.hexBytes")} />
          {hexError && <StatusNote tone="error">{hexError}</StatusNote>}
        </Panel>
      </div>
    </div>
  );
}
