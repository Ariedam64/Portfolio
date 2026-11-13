"use client";

import { useMemo } from "react";
import JsonToTS from "json-to-ts";
import { Checkbox, CodeArea, CopyButton, Label, Panel, StatusNote, TextInput, usePersistentState, useToolT } from "../ui";
import { describeJsonError } from "../json";

const SAMPLE = `{
  "id": 42,
  "name": "Arie's Mod",
  "players": { "daily": 700, "total": 40000 },
  "tags": ["mod", "api"],
  "releases": [
    { "version": "2.1.0", "date": "2026-11-01", "notes": null }
  ]
}`;

export default function JsonToTsTool() {
  const { t } = useToolT();
  const [input, setInput] = usePersistentState("json-to-ts:input", SAMPLE);
  const [rootName, setRootName] = usePersistentState("json-to-ts:root", "Root");
  const [useTypeAlias, setUseTypeAlias] = usePersistentState("json-to-ts:alias", false);
  const [exported, setExported] = usePersistentState("json-to-ts:export", true);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    let value: unknown;
    try {
      value = JSON.parse(input);
    } catch (e) {
      const err = describeJsonError(e, input);
      return { output: "", error: err.line ? `${t("json.errorAt", { line: err.line, column: err.column })} ${err.message}` : err.message };
    }
    if (value === null || typeof value !== "object") return { output: "", error: t("jsonToTs.needObject") };
    try {
      const types = JsonToTS(value, { rootName: rootName.trim() || "Root", useTypeAlias });
      const code = types.join("\n\n");
      return { output: exported ? code.replace(/^(interface|type) /gm, "export $1 ") : code, error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : String(e) };
    }
  }, [input, rootName, useTypeAlias, exported, t]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="JSON">
        <CodeArea value={input} onChange={(e) => setInput(e.target.value)} rows={18} aria-label="JSON" />
        {result.error && <StatusNote tone="error">{result.error}</StatusNote>}
      </Panel>
      <Panel title="TypeScript" actions={<CopyButton text={result.output} />}>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="root-name">{t("jsonToTs.rootName")}</Label>
            <TextInput id="root-name" mono value={rootName} onChange={(e) => setRootName(e.target.value)} className="w-40 py-1.5" />
          </div>
          <Checkbox checked={useTypeAlias} onChange={setUseTypeAlias}>
            {t("jsonToTs.typeAlias")}
          </Checkbox>
          <Checkbox checked={exported} onChange={setExported}>
            {t("jsonToTs.export")}
          </Checkbox>
        </div>
        <CodeArea value={result.output} readOnly rows={15} aria-label="TypeScript" />
      </Panel>
    </div>
  );
}
