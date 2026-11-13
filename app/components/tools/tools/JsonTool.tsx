"use client";

import { useMemo } from "react";
import { Checkbox, CodeArea, CopyButton, Panel, Segmented, StatusNote, usePersistentState, useToolT } from "../ui";
import { describeJsonError, sortKeysDeep } from "../json";

type Mode = "format" | "minify";
type Indent = "2" | "4" | "tab";

export default function JsonTool() {
  const { t } = useToolT();
  const [input, setInput] = usePersistentState("json:input", '{"name":"Romann","tools":["json","yaml"],"local":true}');
  const [mode, setMode] = usePersistentState<Mode>("json:mode", "format");
  const [indent, setIndent] = usePersistentState<Indent>("json:indent", "2");
  const [sortKeys, setSortKeys] = usePersistentState("json:sort", false);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };
    try {
      let value = JSON.parse(input);
      if (sortKeys) value = sortKeysDeep(value);
      const space = mode === "minify" ? undefined : indent === "tab" ? "\t" : Number(indent);
      return { output: JSON.stringify(value, null, space), error: null };
    } catch (e) {
      return { output: "", error: describeJsonError(e, input) };
    }
  }, [input, mode, indent, sortKeys]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title={t("ui.input")}>
        <CodeArea value={input} onChange={(e) => setInput(e.target.value)} rows={18} aria-label={t("ui.input")} placeholder='{"key": "value"}' />
        {input.trim() &&
          (result.error ? (
            <StatusNote tone="error">
              {result.error.line ? t("json.errorAt", { line: result.error.line, column: result.error.column }) : t("json.invalid")} {result.error.message}
            </StatusNote>
          ) : (
            <StatusNote tone="ok">{t("json.valid")}</StatusNote>
          ))}
      </Panel>
      <Panel
        title={t("ui.output")}
        actions={
          <>
            <Segmented
              value={mode}
              onChange={setMode}
              ariaLabel={t("json.mode")}
              options={[
                { value: "format", label: t("json.format") },
                { value: "minify", label: t("json.minify") },
              ]}
            />
            {mode === "format" && (
              <Segmented
                value={indent}
                onChange={setIndent}
                ariaLabel={t("json.indent")}
                options={[
                  { value: "2", label: "2" },
                  { value: "4", label: "4" },
                  { value: "tab", label: "Tab" },
                ]}
              />
            )}
          </>
        }
      >
        <CodeArea value={result.output} readOnly rows={18} aria-label={t("ui.output")} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Checkbox checked={sortKeys} onChange={setSortKeys}>
            {t("json.sortKeys")}
          </Checkbox>
          <CopyButton text={result.output} />
        </div>
      </Panel>
    </div>
  );
}
