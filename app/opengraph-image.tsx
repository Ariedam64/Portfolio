import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// Image d'aperçu des liens partagés (LinkedIn, Discord, Slack...), pour tout le site.
export const alt = "Romann Madeira, développeur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const avatar = await readFile(path.join(process.cwd(), "public/img/avatar.png"));
  const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "linear-gradient(135deg, #0b000c 0%, #1c1028 55%, #3b1d5e 100%)",
          color: "#ece9f1",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendu par ImageResponse, pas par le navigateur */}
        <img
          src={avatarSrc}
          width={280}
          height={280}
          alt=""
          style={{ borderRadius: 140, border: "6px solid #8b5cf6" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#ffffff" }}>Romann Madeira</div>
          <div style={{ fontSize: 38, color: "#c4b5fd" }}>Développeur web et logiciel</div>
          <div style={{ fontSize: 28, color: "#a49fb0", maxWidth: 640, lineHeight: 1.4 }}>
            Un écosystème en production autour de Magic Garden : mod, API, back-end, Android et agents IA.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
