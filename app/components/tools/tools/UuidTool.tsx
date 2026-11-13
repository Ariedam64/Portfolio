"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Checkbox, CodeArea, CopyButton, Label, Panel, Segmented, TextInput, usePersistentState, useToolT } from "../ui";

type Version = "v4" | "v7";

/** UUID v7 (RFC 9562) : 48 bits d'horodatage en ms puis de l'aléatoire, donc triable par date. */
function uuidV7() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let ts = Date.now();
  for (let i = 5; i >= 0; i--) {
    bytes[i] = ts & 0xff;
    ts = Math.floor(ts / 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
} as const;
type SetName = keyof typeof SETS;
const AMBIGUOUS = /[Il1O0o]/g;

/** Index aléatoire uniforme dans [0, max) : on rejette les tirages qui biaiseraient le modulo. */
function randomIndex(max: number) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return buf[0] % max;
}

function generatePassword(length: number, sets: SetName[], noAmbiguous: boolean) {
  const pools = sets.map((name) => (noAmbiguous ? SETS[name].replace(AMBIGUOUS, "") : SETS[name]));
  const all = pools.join("");
  if (!all) return "";
  // Au moins un caractère de chaque famille choisie, puis on mélange.
  const chars = pools.map((pool) => pool[randomIndex(pool.length)]);
  while (chars.length < length) chars.push(all[randomIndex(all.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, length).join("");
}

export default function UuidTool() {
  const { t } = useToolT();

  const [version, setVersion] = usePersistentState<Version>("uuid:version", "v4");
  const [count, setCount] = usePersistentState("uuid:count", 5);
  const [upper, setUpper] = usePersistentState("uuid:upper", false);
  const [noHyphens, setNoHyphens] = usePersistentState("uuid:nohyphens", false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuids = useCallback(() => {
    const n = Math.min(Math.max(1, count || 1), 500);
    setUuids(Array.from({ length: n }, () => (version === "v4" ? crypto.randomUUID() : uuidV7())));
  }, [count, version]);
  useEffect(generateUuids, [generateUuids]);

  const shownUuids = uuids.map((id) => {
    const s = noHyphens ? id.replace(/-/g, "") : id;
    return upper ? s.toUpperCase() : s;
  });

  const [length, setLength] = usePersistentState("pwd:length", 24);
  const [sets, setSets] = usePersistentState<SetName[]>("pwd:sets", ["lower", "upper", "digits", "symbols"]);
  const [noAmbiguous, setNoAmbiguous] = usePersistentState("pwd:ambiguous", false);
  const [password, setPassword] = useState("");
  const generatePwd = useCallback(() => setPassword(generatePassword(length, sets, noAmbiguous)), [length, sets, noAmbiguous]);
  useEffect(generatePwd, [generatePwd]);

  const poolSize = sets.reduce((sum, name) => sum + (noAmbiguous ? SETS[name].replace(AMBIGUOUS, "") : SETS[name]).length, 0);
  const entropy = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;
  const strength = entropy >= 100 ? "strong" : entropy >= 70 ? "good" : entropy >= 50 ? "fair" : "weak";
  const strengthColor = { strong: "bg-emerald-400", good: "bg-lime-400", fair: "bg-amber-400", weak: "bg-red-400" }[strength];

  const toggleSet = (name: SetName, on: boolean) => {
    const next = on ? [...sets, name] : sets.filter((s) => s !== name);
    if (next.length > 0) setSets(next);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="UUID"
        actions={
          <>
            <Button onClick={generateUuids}>
              <RefreshCw className="size-4" />
              {t("uuid.regenerate")}
            </Button>
            <CopyButton text={shownUuids.join("\n")} />
          </>
        }
      >
        <div className="flex flex-wrap items-end gap-4">
          <Segmented
            value={version}
            onChange={setVersion}
            ariaLabel={t("uuid.version")}
            options={[
              { value: "v4", label: t("uuid.v4") },
              { value: "v7", label: t("uuid.v7") },
            ]}
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="uuid-count">{t("uuid.count")}</Label>
            <TextInput id="uuid-count" type="number" min={1} max={500} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-24 py-1.5" />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Checkbox checked={upper} onChange={setUpper}>
            {t("uuid.uppercase")}
          </Checkbox>
          <Checkbox checked={noHyphens} onChange={setNoHyphens}>
            {t("uuid.noHyphens")}
          </Checkbox>
        </div>
        <CodeArea value={shownUuids.join("\n")} readOnly rows={12} aria-label="UUID" />
      </Panel>

      <Panel
        title={t("uuid.password")}
        actions={
          <>
            <Button onClick={generatePwd}>
              <RefreshCw className="size-4" />
              {t("uuid.regenerate")}
            </Button>
            <CopyButton text={password} />
          </>
        }
      >
        <p className="rounded-xl border border-[#3a2f4c] bg-[#1c1824] px-3 py-3 font-mono text-lg break-all text-white">{password || "—"}</p>
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2a2335]">
            <div className={`h-full ${strengthColor} transition-all`} style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }} />
          </div>
          <span className="shrink-0 text-xs text-[#a49fb0]">
            {t(`uuid.strength.${strength}`)} · {entropy} bits
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="pwd-length">{t("uuid.length", { count: length })}</Label>
          <input
            id="pwd-length"
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full cursor-pointer accent-[#8b5cf6]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(SETS) as SetName[]).map((name) => (
            <Checkbox key={name} checked={sets.includes(name)} onChange={(on) => toggleSet(name, on)}>
              {t(`uuid.sets.${name}`)}
            </Checkbox>
          ))}
        </div>
        <Checkbox checked={noAmbiguous} onChange={setNoAmbiguous}>
          {t("uuid.noAmbiguous")}
        </Checkbox>
      </Panel>
    </div>
  );
}
