"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button, Checkbox, CodeArea, CopyButton, DownloadButton, FileDrop, Panel, Segmented, StatusNote, downloadBlob, formatBytes, usePersistentState, useToolT } from "../ui";
import { base64ToBytes, bytesToBase64, bytesToUtf8 } from "../bytes";

type Mode = "encode" | "decode";
const MAX_FILE = 25 * 1024 * 1024;

export default function Base64Tool() {
  const { t, i18n } = useToolT();
  const [mode, setMode] = usePersistentState<Mode>("base64:mode", "encode");
  const [input, setInput] = usePersistentState("base64:input", "Salut, ça marche aussi avec les accents ✓");
  const [urlSafe, setUrlSafe] = usePersistentState("base64:url", false);

  const result = useMemo(() => {
    if (!input) return { output: "", error: null as string | null, binary: null as Uint8Array | null };
    if (mode === "encode") return { output: bytesToBase64(new TextEncoder().encode(input), urlSafe), error: null, binary: null };
    try {
      const bytes = base64ToBytes(input);
      const text = bytesToUtf8(bytes);
      return text === null ? { output: "", error: null, binary: bytes } : { output: text, error: null, binary: null };
    } catch {
      return { output: "", error: t("base64.invalid"), binary: null };
    }
  }, [input, mode, urlSafe, t]);

  const [file, setFile] = useState<{ name: string; size: number; base64: string; type: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState(false);

  const onFile = async (f: File) => {
    if (f.size > MAX_FILE) {
      setFile(null);
      setFileError(t("base64.tooBig", { max: formatBytes(MAX_FILE, i18n.language) }));
      return;
    }
    setFileError(null);
    const bytes = new Uint8Array(await f.arrayBuffer());
    setFile({ name: f.name, size: f.size, type: f.type || "application/octet-stream", base64: bytesToBase64(bytes) });
  };

  const fileOutput = file ? (dataUrl ? `data:${file.type};base64,${file.base64}` : file.base64) : "";

  const swap = () => {
    if (result.output) setInput(result.output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          ariaLabel={t("base64.mode")}
          options={[
            { value: "encode", label: t("base64.encode") },
            { value: "decode", label: t("base64.decode") },
          ]}
        />
        <Button onClick={swap}>
          <ArrowLeftRight className="size-4" />
          {t("yaml.swap")}
        </Button>
        {mode === "encode" && (
          <Checkbox checked={urlSafe} onChange={setUrlSafe}>
            {t("base64.urlSafe")}
          </Checkbox>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={mode === "encode" ? t("base64.text") : "Base64"}>
          <CodeArea value={input} onChange={(e) => setInput(e.target.value)} rows={12} aria-label={t("ui.input")} />
          {result.error && <StatusNote tone="error">{result.error}</StatusNote>}
        </Panel>
        <Panel title={mode === "encode" ? "Base64" : t("base64.text")} actions={<CopyButton text={result.output} />}>
          {result.binary ? (
            <>
              <StatusNote tone="info">{t("base64.binary", { size: formatBytes(result.binary.length, i18n.language) })}</StatusNote>
              <DownloadButton
                label={t("base64.downloadFile")}
                onClick={() => downloadBlob(new Blob([result.binary as Uint8Array<ArrayBuffer>]), "decoded.bin")}
              />
            </>
          ) : (
            <CodeArea value={result.output} readOnly rows={12} aria-label={t("ui.output")} />
          )}
        </Panel>
      </div>

      <Panel title={t("base64.file")} actions={file && <CopyButton text={fileOutput} />}>
        <FileDrop onFile={onFile} label={t("ui.dropFile")} />
        {fileError && <StatusNote tone="error">{fileError}</StatusNote>}
        {file && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#a49fb0]">
              <span className="break-all">
                {file.name} · {formatBytes(file.size, i18n.language)} → {formatBytes(fileOutput.length, i18n.language)}
              </span>
              <Checkbox checked={dataUrl} onChange={setDataUrl}>
                {t("base64.dataUrl")}
              </Checkbox>
            </div>
            <CodeArea value={fileOutput.length > 200_000 ? `${fileOutput.slice(0, 200_000)}…` : fileOutput} readOnly rows={6} aria-label="Base64" />
            {fileOutput.length > 200_000 && <StatusNote tone="info">{t("base64.truncatedPreview")}</StatusNote>}
          </>
        )}
      </Panel>
    </div>
  );
}
