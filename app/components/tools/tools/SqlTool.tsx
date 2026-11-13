"use client";

import { useMemo } from "react";
import { format, type SqlLanguage, type KeywordCase } from "sql-formatter";
import { CodeArea, CopyButton, Panel, Segmented, Select, StatusNote, usePersistentState, useToolT } from "../ui";

const SAMPLE =
  "select p.id, p.name, count(r.id) as reports from players p left join reports r on r.player_id = p.id where p.created_at > now() - interval '7 days' group by p.id, p.name having count(r.id) > 3 order by reports desc limit 20;";

const DIALECTS: { value: SqlLanguage; label: string }[] = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "sqlite", label: "SQLite" },
  { value: "transactsql", label: "SQL Server" },
  { value: "plsql", label: "Oracle PL/SQL" },
  { value: "sql", label: "SQL standard" },
];

type Indent = "2" | "4";

export default function SqlTool() {
  const { t } = useToolT();
  const [input, setInput] = usePersistentState("sql:input", SAMPLE);
  const [language, setLanguage] = usePersistentState<SqlLanguage>("sql:dialect", "postgresql");
  const [keywordCase, setKeywordCase] = usePersistentState<KeywordCase>("sql:case", "upper");
  const [indent, setIndent] = usePersistentState<Indent>("sql:indent", "2");

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return { output: format(input, { language, keywordCase, tabWidth: Number(indent) }), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : String(e) };
    }
  }, [input, language, keywordCase, indent]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={language} onChange={setLanguage} options={DIALECTS} ariaLabel={t("sql.dialect")} />
        <Segmented
          value={keywordCase}
          onChange={setKeywordCase}
          ariaLabel={t("sql.keywords")}
          options={[
            { value: "upper", label: "SELECT" },
            { value: "lower", label: "select" },
            { value: "preserve", label: t("sql.preserve") },
          ]}
        />
        <Segmented
          value={indent}
          onChange={setIndent}
          ariaLabel={t("json.indent")}
          options={[
            { value: "2", label: t("sql.spaces", { count: 2 }) },
            { value: "4", label: t("sql.spaces", { count: 4 }) },
          ]}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={t("ui.input")}>
          <CodeArea value={input} onChange={(e) => setInput(e.target.value)} rows={18} aria-label={t("ui.input")} />
          {result.error && <StatusNote tone="error">{result.error}</StatusNote>}
        </Panel>
        <Panel title={t("ui.output")} actions={<CopyButton text={result.output} />}>
          <CodeArea value={result.output} readOnly rows={18} aria-label={t("ui.output")} />
        </Panel>
      </div>
    </div>
  );
}
