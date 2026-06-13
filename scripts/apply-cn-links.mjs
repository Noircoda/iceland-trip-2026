// 把 cn.guidetoiceland.is 連結套用到 src/data/enrichment.ts（found=true 者優先當資訊來源）
// 用法: node scripts/apply-cn-links.mjs <cn-output-json-path>
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
if (!src) { console.error('需要 cn 連結輸出 JSON 路徑'); process.exit(1); }

const raw = JSON.parse(readFileSync(src, 'utf8'));
const days = raw.result ?? raw;
const cn = {};
for (const d of days) for (const s of d.stops ?? []) if (s.found && s.cnUrl) cn[s.id] = s.cnUrl;

const LABEL = 'Guide to Iceland';
const file = join(__dirname, '..', 'src', 'data', 'enrichment.ts');
const lines = readFileSync(file, 'utf8').split('\n');
let patched = 0;

const out = lines.map(line => {
  const m = line.match(/^(\s*)'([a-z0-9-]+)':\s*\{(.*)\},\s*$/);
  if (!m) return line;
  const [, indent, id, body] = m;
  const url = cn[id];
  if (!url) return line;
  let b = body;
  if (/infoUrl:\s*"/.test(b)) b = b.replace(/infoUrl:\s*"[^"]*"/, `infoUrl: "${url}"`);
  else b = b.replace(/(desc:\s*"(?:[^"\\]|\\.)*",)/, `$1 infoUrl: "${url}",`);
  if (/infoLabel:\s*"/.test(b)) b = b.replace(/infoLabel:\s*"[^"]*"/, `infoLabel: "${LABEL}"`);
  else b = b.replace(/(infoUrl:\s*"[^"]*",)/, `$1 infoLabel: "${LABEL}",`);
  patched++;
  return `${indent}'${id}': {${b}},`;
});

writeFileSync(file, out.join('\n'), 'utf8');
console.log(`已套用 ${patched} 個 cn.guidetoiceland.is 連結（共 ${Object.keys(cn).length} 個可用）→ enrichment.ts`);
