/**
 * Erzeugt aus dem Firmenlogo ein Multi-Size `favicon.ico`
 * (16/32/48 px PNG eingebettet) sowie ein statisches `icon.png`
 * als Fallback. Ausgabe: `app/favicon.ico` + `app/icon.png`.
 *
 * Ausfuehren mit: `node scripts/generate-favicon.mjs`
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const LOGO_SRC = path.join(ROOT, "public/logo-es-gebaeudeservice.png");
const FAVICON_OUT = path.join(ROOT, "app/favicon.ico");
const ICON_PNG_OUT = path.join(ROOT, "app/icon.png");
const APPLE_ICON_PNG_OUT = path.join(ROOT, "app/apple-icon.png");

// Die Grafik (Haus + Turm + Wappen) liegt im oberen Teil des Logos.
// Der "Gebaeudeservice"-Schriftzug unten waere in 16/32 px unleserlich
// und wird deshalb abgeschnitten. Wir bestimmen Inhalt ueber den
// Alpha-Channel (Trim) und zentrieren das Symbol auf einem Quadrat.
const BG = { r: 255, g: 255, b: 255, alpha: 1 };
const SIZES = [16, 32, 48];
const ICON_PNG_SIZE = 512;
const APPLE_ICON_PNG_SIZE = 180;

async function buildSymbolBuffer() {
  const meta = await sharp(LOGO_SRC).metadata();
  if (!meta.width || !meta.height) {
    throw new Error("Logo ohne Dimensionen");
  }

  // Unteren ~14% wegschneiden (dort steht nur "Gebaeudeservice").
  const cropHeight = Math.round(meta.height * 0.86);
  const extracted = await sharp(LOGO_SRC)
    .extract({ left: 0, top: 0, width: meta.width, height: cropHeight })
    .png()
    .toBuffer();

  const cropped = await sharp(extracted).trim({ threshold: 1 }).png().toBuffer();

  const trimmedMeta = await sharp(cropped).metadata();
  const w = trimmedMeta.width ?? meta.width;
  const h = trimmedMeta.height ?? cropHeight;
  const side = Math.max(w, h);
  const pad = Math.round(side * 0.08); // etwas Luft zum Rand
  const canvas = side + pad * 2;

  return sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: cropped,
        left: Math.round((canvas - w) / 2),
        top: Math.round((canvas - h) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function renderPng(symbolBuffer, size, { background = BG } = {}) {
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([
      {
        input: await sharp(symbolBuffer)
          .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer(),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(pngs.length, 4); // count

  const entries = Buffer.alloc(16 * pngs.length);
  const offsetStart = header.length + entries.length;
  let offset = offsetStart;

  pngs.forEach((png, i) => {
    const base = i * 16;
    entries.writeUInt8(png.size >= 256 ? 0 : png.size, base + 0);
    entries.writeUInt8(png.size >= 256 ? 0 : png.size, base + 1);
    entries.writeUInt8(0, base + 2); // palette
    entries.writeUInt8(0, base + 3); // reserved
    entries.writeUInt16LE(1, base + 4); // planes
    entries.writeUInt16LE(32, base + 6); // bit count
    entries.writeUInt32LE(png.buffer.length, base + 8); // bytes in res
    entries.writeUInt32LE(offset, base + 12); // image offset
    offset += png.buffer.length;
  });

  return Buffer.concat([header, entries, ...pngs.map((p) => p.buffer)]);
}

async function main() {
  const symbol = await buildSymbolBuffer();

  const icoPngs = await Promise.all(
    SIZES.map(async (size) => ({
      size,
      buffer: await renderPng(symbol, size),
    })),
  );

  const ico = buildIco(icoPngs);
  await fs.writeFile(FAVICON_OUT, ico);

  const iconPng = await renderPng(symbol, ICON_PNG_SIZE);
  await fs.writeFile(ICON_PNG_OUT, iconPng);

  const appleIconPng = await renderPng(symbol, APPLE_ICON_PNG_SIZE);
  await fs.writeFile(APPLE_ICON_PNG_OUT, appleIconPng);

  console.log("favicon.ico:", FAVICON_OUT, `(${ico.length} bytes)`);
  console.log("icon.png:   ", ICON_PNG_OUT, `(${iconPng.length} bytes)`);
  console.log("apple-icon.png:", APPLE_ICON_PNG_OUT, `(${appleIconPng.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
