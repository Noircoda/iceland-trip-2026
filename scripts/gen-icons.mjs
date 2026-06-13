// 產生 PWA 圖示：icons/icon.svg → pwa-192/512、apple-touch-icon
// 注意：sharp 已從 devDependencies 移除（它的跨平台原生二進位會破壞 CI 的 npm ci）。
// 圖示已產生並 commit 在 public/icons/，平時不需重跑。
// 若要重新產生圖示，先臨時安裝 sharp：  npm i --no-save sharp  然後  node scripts/gen-icons.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'icons');
mkdirSync(OUT, { recursive: true });

// 深夜藍底＋極光漸層環島路線＋紅色定位 pin
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="50%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.35" r="0.8">
      <stop offset="0%" stop-color="#16324f"/>
      <stop offset="100%" stop-color="#0b1d33"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#glow)"/>
  <path d="M150 330 C120 280 130 215 185 185 C235 158 290 150 340 175 C395 202 400 268 370 315 C340 360 285 372 235 362 C200 355 170 348 150 330 Z"
        fill="none" stroke="url(#aurora)" stroke-width="26" stroke-linecap="round" stroke-dasharray="4 0"/>
  <circle cx="150" cy="330" r="16" fill="#fbbf24"/>
  <g transform="translate(340,140)">
    <path d="M0 0 C-36 0 -60 26 -60 58 C-60 96 -16 138 0 156 C16 138 60 96 60 58 C60 26 36 0 0 0 Z" fill="#f43f5e"/>
    <circle cx="0" cy="56" r="24" fill="#fff"/>
  </g>
</svg>`;

writeFileSync(join(OUT, 'icon.svg'), svg, 'utf8');
const buf = Buffer.from(svg);
await sharp(buf).resize(192, 192).png().toFile(join(OUT, 'pwa-192.png'));
await sharp(buf).resize(512, 512).png().toFile(join(OUT, 'pwa-512.png'));
await sharp(buf).resize(180, 180).png().toFile(join(OUT, 'apple-touch-icon.png'));
console.log('icons → public/icons/');
