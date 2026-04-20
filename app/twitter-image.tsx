import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
} from "@/app/contact";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "ES-Gebäudeservice – Gebäudereinigung in Esslingen und Stuttgart";

export default async function TwitterImage() {
  const logoBuffer = await fs.readFile(
    path.join(process.cwd(), "public/logo-es-gebaeudeservice.png"),
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "72px 80px",
          background: "#FFFFFF",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            background: "#7596AE",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={120} height={120} alt="" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1,
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              ES-Gebäudeservice
            </span>
            <span
              style={{
                marginTop: 10,
                fontSize: 22,
                fontWeight: 500,
                color: "#64748B",
              }}
            >
              Gebäudereinigung · Esslingen am Neckar
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#0F172A",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Professionelle Reinigung
          </span>
          <span
            style={{
              marginTop: 12,
              fontSize: 72,
              fontWeight: 800,
              color: "#7596AE",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            im Großraum Stuttgart.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 40,
            paddingTop: 24,
            borderTop: "1px solid #E2E8F0",
            fontSize: 24,
            color: "#334155",
            fontWeight: 500,
          }}
        >
          <span>{CONTACT_PHONE_DISPLAY}</span>
          <span>{CONTACT_EMAIL}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
