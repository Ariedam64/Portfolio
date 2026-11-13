"use client";

import { useEffect, useState } from "react";
import { crc32, md5, sha1, sha256, sha3, sha512, type IDataType } from "hash-wasm";
import { Checkbox, CodeArea, FileDrop, Panel, Segmented, StatusNote, ValueRow, formatBytes, usePersistentState, useToolT } from "../ui";

type Source = "text" | "file";

const ALGORITHMS: { name: string; run: (data: IDataType) => Promise<string> }[] = [
  { name: "MD5", run: md5 },
  { name: "SHA-1", run: sha1 },
  { name: "SHA-256", run: sha256 },
  { name: "SHA-512", run: sha512 },
  { name: "SHA3-256", run: (data) => sha3(data, 256) },
  { name: "CRC32", run: crc32 },
];

const MAX_FILE = 200 * 1024 * 1024;

export default function HashTool() {
  const { t, i18n } = useToolT();
  const [source, setSource] = usePersistentState<Source>("hash:source", "text");
  const [text, setText] = usePersistentState("hash:text", "hello world");
  const [upper, setUpper] = usePersistentState("hash:upper", false);
  const [file, setFile] = useState<{ name: string; size: number; bytes: Uint8Array } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const data: IDataType | null = source === "text" ? text : file?.bytes ?? null;
    if (data === null) {
      setHashes({});
      return;
    }
    let cancelled = false;
    setBusy(true);
    Promise.all(ALGORITHMS.map(async (algo) => [algo.name, await algo.run(data)] as const))
      .then((entries) => {
        if (!cancelled) setHashes(Object.fromEntries(entries));
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [source, text, file]);

  const onFile = async (f: File) => {
    if (f.size > MAX_FILE) {
      setFile(null);
      setFileError(t("base64.tooBig", { max: formatBytes(MAX_FILE, i18n.language) }));
      return;
    }
    setFileError(null);
    setFile({ name: f.name, size: f.size, bytes: new Uint8Array(await f.arrayBuffer()) });
  };

  return (
    <div className="flex flex-col gap-4">
      <Panel
        title={t("ui.input")}
        actions={
          <Segmented
            value={source}
            onChange={setSource}
            options={[
              { value: "text", label: t("hash.text") },
              { value: "file", label: t("hash.file") },
            ]}
          />
        }
      >
        {source === "text" ? (
          <CodeArea value={text} onChange={(e) => setText(e.target.value)} rows={6} aria-label={t("hash.text")} />
        ) : (
          <>
            <FileDrop onFile={onFile} label={t("ui.dropFile")} />
            {fileError && <StatusNote tone="error">{fileError}</StatusNote>}
            {file && (
              <p className="text-sm break-all text-[#a49fb0]">
                {file.name} · {formatBytes(file.size, i18n.language)}
              </p>
            )}
          </>
        )}
      </Panel>

      <Panel title={busy ? t("hash.computing") : t("hash.results")} actions={<Checkbox checked={upper} onChange={setUpper}>{t("hash.uppercase")}</Checkbox>}>
        {ALGORITHMS.map(({ name }) => {
          const value = hashes[name] ?? "";
          return <ValueRow key={name} label={name} value={upper ? value.toUpperCase() : value} />;
        })}
      </Panel>
    </div>
  );
}
