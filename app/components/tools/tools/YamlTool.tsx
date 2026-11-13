"use client";

import { useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
import YAML, { YAMLParseError } from "yaml";
import { Button, CodeArea, CopyButton, Panel, Segmented, StatusNote, usePersistentState, useToolT } from "../ui";
import { describeJsonError } from "../json";

type Direction = "yaml-to-json" | "json-to-yaml";

const SAMPLE = `services:
  api:
    image: node:22-alpine
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
`;

export default function YamlTool() {
  const { t } = useToolT();
  const [direction, setDirection] = usePersistentState<Direction>("yaml:direction", "yaml-to-json");
  const [input, setInput] = usePersistentState("yaml:input", SAMPLE);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    if (direction === "yaml-to-json") {
      try {
        // Plusieurs documents séparés par « --- » donnent un tableau JSON.
        const docs = YAML.parseAllDocuments(input);
        const failed = docs.flatMap((doc) => doc.errors);
        if (failed.length) throw failed[0];
        const values = docs.map((doc) => doc.toJS());
        return { output: JSON.stringify(values.length === 1 ? values[0] : values, null, 2), error: null };
      } catch (e) {
        if (e instanceof YAMLParseError && e.linePos) {
          return { output: "", error: `${t("json.errorAt", { line: e.linePos[0].line, column: e.linePos[0].col })} ${e.message.split("\n")[0].replace(/ at line \d+, column \d+:?$/, "")}` };
        }
        return { output: "", error: e instanceof Error ? e.message : String(e) };
      }
    }
    try {
      return { output: YAML.stringify(JSON.parse(input)), error: null };
    } catch (e) {
      const err = describeJsonError(e, input);
      return { output: "", error: err.line ? `${t("json.errorAt", { line: err.line, column: err.column })} ${err.message}` : err.message };
    }
  }, [input, direction, t]);

  const swap = () => {
    if (result.output) setInput(result.output);
    setDirection(direction === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json");
  };

  const inputLabel = direction === "yaml-to-json" ? "YAML" : "JSON";
  const outputLabel = direction === "yaml-to-json" ? "JSON" : "YAML";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented
          value={direction}
          onChange={setDirection}
          ariaLabel={t("yaml.direction")}
          options={[
            { value: "yaml-to-json", label: "YAML → JSON" },
            { value: "json-to-yaml", label: "JSON → YAML" },
          ]}
        />
        <Button onClick={swap} ariaLabel={t("yaml.swap")}>
          <ArrowLeftRight className="size-4" />
          {t("yaml.swap")}
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={inputLabel}>
          <CodeArea value={input} onChange={(e) => setInput(e.target.value)} rows={18} aria-label={inputLabel} />
          {result.error && <StatusNote tone="error">{result.error}</StatusNote>}
        </Panel>
        <Panel title={outputLabel} actions={<CopyButton text={result.output} />}>
          <CodeArea value={result.output} readOnly rows={18} aria-label={outputLabel} />
        </Panel>
      </div>
    </div>
  );
}
