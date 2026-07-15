import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// This Next.js version bundles Geist instead of Noto Sans; use whatever
// @vercel/og ships with rather than pulling in an external font download.
const font = readFileSync("node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf");

async function main() {
  mkdirSync("public/og", { recursive: true });

  for (let p = 1; p <= 99; p++) {
    const svg = await satori(
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0f172a",
          color: "white",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>{`I earn more than ${p}%`}</div>
        <div style={{ fontSize: 48 }}>of the world</div>
        <div style={{ fontSize: 28, marginTop: 40, color: "#94a3b8" }}>
          tinytests — where do you stand?
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [{ name: "sans", data: font, weight: 700, style: "normal" }],
      },
    );
    writeFileSync(`public/og/p${p}.png`, new Resvg(svg).render().asPng());
  }
  console.log("generated 99 OG images");
}

main();
