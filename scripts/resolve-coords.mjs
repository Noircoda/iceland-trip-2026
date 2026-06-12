// 解析 Notion 匯出檔中的 maps.app.goo.gl 短連結 → 經緯度
// 用法: node scripts/resolve-coords.mjs
// 輸出: scripts/coords.json  [{ title, link, lat, lng, method }]
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NOTION_DIR = join(__dirname, '..', '..', 'Iceland & UK');

// 額外手動加入的連結（不在 Notion POI 頁面中）
const EXTRA = [
  { title: 'D3住宿 Hvolsvöllur Airbnb', link: 'https://maps.app.goo.gl/BHjWBSpXtV1p5vEf7' },
];

function collectMd(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) collectMd(p, out);
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

function extractLinks() {
  const entries = [...EXTRA];
  for (const file of collectMd(NOTION_DIR)) {
    const text = readFileSync(file, 'utf8');
    const title = (text.match(/^#\s+(.+)$/m) || [])[1]?.trim();
    const link = (text.match(/https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9]+/) || [])[0];
    if (title && link) entries.push({ title, link });
  }
  // 去重（同連結保留第一筆）
  const seen = new Set();
  return entries.filter(e => !seen.has(e.link) && seen.add(e.link));
}

function parseCoords(url) {
  // 優先: !3d<lat>!4d<lng>（地點 pin，最準）
  let m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (m) return { lat: +m[1], lng: +m[2], method: 'pin' };
  // 次選: /@lat,lng,zoom（視窗中心）
  m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return { lat: +m[1], lng: +m[2], method: 'viewport' };
  // 備選: q=lat,lng
  m = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return { lat: +m[1], lng: +m[2], method: 'query' };
  return null;
}

async function resolve(link) {
  const res = await fetch(link, {
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  });
  // res.url = 最終跳轉後的完整 Google Maps URL
  const coords = parseCoords(res.url);
  if (coords) return coords;
  // 有時座標在回應 HTML 內（consent 頁除外）
  const html = await res.text();
  const m = html.match(/\[(-?\d+\.\d{4,}),(-?\d+\.\d{4,})\]/);
  if (m) return { lat: +m[1], lng: +m[2], method: 'html' };
  return null;
}

const entries = extractLinks();
console.log(`找到 ${entries.length} 個連結，開始解析…`);
const results = [];
for (const e of entries) {
  try {
    const c = await resolve(e.link);
    results.push({ ...e, ...(c || { lat: null, lng: null, method: 'FAILED' }) });
    console.log(`${c ? '✓' : '✗'} ${e.title} ${c ? `${c.lat},${c.lng} (${c.method})` : ''}`);
  } catch (err) {
    results.push({ ...e, lat: null, lng: null, method: 'ERROR:' + err.message });
    console.log(`✗ ${e.title} ERROR ${err.message}`);
  }
  await new Promise(r => setTimeout(r, 350)); // 節流
}
writeFileSync(join(__dirname, 'coords.json'), JSON.stringify(results, null, 2), 'utf8');
const ok = results.filter(r => r.lat).length;
console.log(`完成：${ok}/${results.length} 成功 → scripts/coords.json`);
