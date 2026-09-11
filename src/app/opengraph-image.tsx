import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ulo — structure for Rust services";

const INK = "#0b0e0e";
const BRAND = "#4fc8bd";
const FG = "#f2f4f4";
const MUTED = "#8d9b99";
// Read from the favicon source so the two marks cannot drift apart. This
// route is prerendered at build time, so the file is always on disk here.
const MARK =
  "data:image/svg+xml;base64," +
  readFileSync(join(process.cwd(), "src/app/icon.svg")).toString("base64");

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img width="44" height="44" src={MARK} alt="" />
          <div style={{ display: "flex", fontSize: 34, color: FG, fontWeight: 600 }}>
            ulo
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              lineHeight: 1.05,
              color: FG,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Structure for Rust services.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: MUTED,
              maxWidth: 900,
            }}
          >
            Modules, dependency injection, and one guard/interceptor/pipe chain
            across HTTP, WebSocket, RPC, and gRPC.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", height: 3, width: 64, background: BRAND }} />
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>
            axum · actix · salvo · poem · rocket — or bring your own
          </div>
        </div>
      </div>
    ),
    size,
  );
}
