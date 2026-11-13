"use client";

import { useEffect, useState } from "react";
import QRCode, { type QRCodeErrorCorrectionLevel } from "qrcode";
import { CodeArea, DownloadButton, Label, Panel, Segmented, StatusNote, downloadBlob, usePersistentState, useToolT } from "../ui";

const LEVELS: QRCodeErrorCorrectionLevel[] = ["L", "M", "Q", "H"];

export default function QrCodeTool() {
  const { t } = useToolT();
  const [text, setText] = usePersistentState("qr:text", "https://github.com/Ariedam64");
  const [level, setLevel] = usePersistentState<QRCodeErrorCorrectionLevel>("qr:level", "M");
  const [size, setSize] = usePersistentState("qr:size", 512);
  const [margin, setMargin] = usePersistentState("qr:margin", 2);
  const [dark, setDark] = usePersistentState("qr:dark", "#000000");
  const [light, setLight] = usePersistentState("qr:light", "#ffffff");
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text) {
      setPng("");
      setSvg("");
      setError(null);
      return;
    }
    let cancelled = false;
    const options = { errorCorrectionLevel: level, margin, color: { dark, light } };
    Promise.all([QRCode.toDataURL(text, { ...options, width: size }), QRCode.toString(text, { ...options, type: "svg" })])
      .then(([dataUrl, svgString]) => {
        if (cancelled) return;
        setPng(dataUrl);
        setSvg(svgString);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [text, level, size, margin, dark, light]);

  const downloadPng = async () => downloadBlob(await (await fetch(png)).blob(), "qrcode.png");
  const downloadSvg = () => downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qrcode.svg");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title={t("qr.content")}>
        <CodeArea value={text} onChange={(e) => setText(e.target.value)} rows={5} aria-label={t("qr.content")} placeholder="https://…" />
        {error && <StatusNote tone="error">{t("qr.tooLong")}</StatusNote>}
        <div className="flex flex-col gap-1">
          <Label>{t("qr.level")}</Label>
          <Segmented value={level} onChange={setLevel} ariaLabel={t("qr.level")} options={LEVELS.map((l) => ({ value: l, label: `${l} · ${t(`qr.levels.${l}`)}` }))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="qr-size">{t("qr.size", { size })}</Label>
            <input id="qr-size" type="range" min={128} max={2048} step={64} value={size} onChange={(e) => setSize(Number(e.target.value))} className="cursor-pointer accent-[#8b5cf6]" />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="qr-margin">{t("qr.margin", { margin })}</Label>
            <input id="qr-margin" type="range" min={0} max={10} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="cursor-pointer accent-[#8b5cf6]" />
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#d8d2e3]">
            <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-[#3a2f4c] bg-transparent" />
            {t("qr.foreground")}
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#d8d2e3]">
            <input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-[#3a2f4c] bg-transparent" />
            {t("qr.background")}
          </label>
        </div>
      </Panel>

      <Panel title={t("qr.preview")} actions={<><DownloadButton label="PNG" onClick={downloadPng} disabled={!png} /><DownloadButton label="SVG" onClick={downloadSvg} disabled={!svg} /></>}>
        <div className="grid min-h-72 place-items-center rounded-xl border border-[#3a2f4c] bg-[#1c1824] p-4">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={png} alt={t("qr.alt")} className="h-auto w-full max-w-80 [image-rendering:pixelated]" />
          ) : (
            <span className="text-sm text-[#6f687c]">{t("qr.empty")}</span>
          )}
        </div>
      </Panel>
    </div>
  );
}
