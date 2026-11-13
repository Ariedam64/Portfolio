"use client";

import { useMemo, useState } from "react";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { CodeArea, CopyButton, Panel, StatusNote, useToolT } from "../ui";
import { formatDateTime, relativeTime } from "../time";

// Jeton d'exemple avec une signature factice : l'outil ne vérifie pas les signatures.
const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlJvbWFubiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MzAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.bWxF0vY2uZ4jGm5xC2Gm2uR8c3n1kqgB2pQ0YVfLx9M";

const TIME_CLAIMS = ["exp", "iat", "nbf"] as const;

export default function JwtTool() {
  const { t, i18n } = useToolT();
  // Pas de mémorisation ici : un jeton est souvent un secret.
  const [token, setToken] = useState(SAMPLE);
  const trimmed = token.trim().replace(/^Bearer\s+/i, "");

  const decoded = useMemo(() => {
    if (!trimmed) return null;
    try {
      return { header: decodeProtectedHeader(trimmed), payload: decodeJwt(trimmed), error: null };
    } catch (e) {
      return { header: null, payload: null, error: e instanceof Error ? e.message : String(e) };
    }
  }, [trimmed]);

  const parts = trimmed.split(".");
  const now = Date.now();
  const exp = typeof decoded?.payload?.exp === "number" ? decoded.payload.exp * 1000 : null;
  const nbf = typeof decoded?.payload?.nbf === "number" ? decoded.payload.nbf * 1000 : null;
  const headerJson = decoded?.header ? JSON.stringify(decoded.header, null, 2) : "";
  const payloadJson = decoded?.payload ? JSON.stringify(decoded.payload, null, 2) : "";

  return (
    <div className="flex flex-col gap-4">
      <Panel title={t("jwt.token")}>
        <CodeArea value={token} onChange={(e) => setToken(e.target.value)} rows={5} aria-label={t("jwt.token")} className="break-all" />
        {trimmed && parts.length === 3 && (
          <p className="rounded-xl border border-[#3a2f4c] bg-[#17141d] p-3 font-mono text-[13px] leading-relaxed break-all">
            <span className="text-rose-300">{parts[0]}</span>
            <span className="text-[#6f687c]">.</span>
            <span className="text-violet-300">{parts[1]}</span>
            <span className="text-[#6f687c]">.</span>
            <span className="text-sky-300">{parts[2]}</span>
          </p>
        )}
        {decoded?.error && <StatusNote tone="error">{t("jwt.invalid")} {decoded.error}</StatusNote>}
        {decoded?.payload &&
          (exp !== null && exp < now ? (
            <StatusNote tone="error">{t("jwt.expired", { when: relativeTime(new Date(exp), i18n.language, now) })}</StatusNote>
          ) : nbf !== null && nbf > now ? (
            <StatusNote tone="info">{t("jwt.notYet", { when: relativeTime(new Date(nbf), i18n.language, now) })}</StatusNote>
          ) : exp !== null ? (
            <StatusNote tone="ok">{t("jwt.valid", { when: relativeTime(new Date(exp), i18n.language, now) })}</StatusNote>
          ) : (
            <StatusNote tone="info">{t("jwt.noExp")}</StatusNote>
          ))}
        <p className="text-xs text-[#6f687c]">{t("jwt.noVerify")}</p>
      </Panel>

      {decoded?.payload && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title={<span className="text-rose-300">{t("jwt.header")}</span>} actions={<CopyButton text={headerJson} />}>
              <CodeArea value={headerJson} readOnly rows={8} aria-label={t("jwt.header")} />
            </Panel>
            <Panel title={<span className="text-violet-300">{t("jwt.payload")}</span>} actions={<CopyButton text={payloadJson} />}>
              <CodeArea value={payloadJson} readOnly rows={8} aria-label={t("jwt.payload")} />
            </Panel>
          </div>

          {TIME_CLAIMS.some((claim) => typeof decoded.payload?.[claim] === "number") && (
            <Panel title={t("jwt.dates")}>
              <dl className="grid gap-2">
                {TIME_CLAIMS.map((claim) => {
                  const value = decoded.payload?.[claim];
                  if (typeof value !== "number") return null;
                  const date = new Date(value * 1000);
                  return (
                    <div key={claim} className="flex flex-col gap-0.5 rounded-xl border border-[#3a2f4c] bg-[#1c1824] px-3 py-2 sm:flex-row sm:items-center sm:gap-3">
                      <dt className="shrink-0 text-sm text-[#a49fb0] sm:w-56">
                        <span className="font-mono text-[#c4b5fd]">{claim}</span> · {t(`jwt.claims.${claim}`)}
                      </dt>
                      <dd className="text-sm text-[#ece9f1]">
                        {formatDateTime(date, i18n.language)} <span className="text-[#a49fb0]">({relativeTime(date, i18n.language, now)})</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
