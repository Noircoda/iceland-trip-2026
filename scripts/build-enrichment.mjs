// 從內容擴充工作流的輸出 JSON 產生 src/data/enrichment.ts
// 用法: node scripts/build-enrichment.mjs <output-json-path>
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
if (!src) {
  console.error('需要傳入工作流輸出 JSON 路徑');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(src, 'utf8'));
const days = raw.result ?? raw; // 容錯：可能是 {result:[...]} 或直接陣列
const map = {};
for (const d of days) {
  for (const s of d.stops ?? []) {
    map[s.id] = {
      desc: s.desc,
      ...(s.infoUrl ? { infoUrl: s.infoUrl } : {}),
      ...(s.infoLabel ? { infoLabel: s.infoLabel } : {}),
    };
  }
}

const body = Object.entries(map)
  .map(([id, v]) => {
    const parts = [`desc: ${JSON.stringify(v.desc)}`];
    if (v.infoUrl) parts.push(`infoUrl: ${JSON.stringify(v.infoUrl)}`);
    if (v.infoLabel) parts.push(`infoLabel: ${JSON.stringify(v.infoLabel)}`);
    return `  '${id}': { ${parts.join(', ')} },`;
  })
  .join('\n');

const out = `// 由 scripts/build-enrichment.mjs 從研究工作流輸出自動產生 —— 請勿手改
// 內容：每個停靠點查證後的詳細說明 + 權威「相關資訊」連結
export interface Enrichment {
  desc: string;
  infoUrl?: string;
  infoLabel?: string;
}

export const ENRICHMENT: Record<string, Enrichment> = {
${body}
};
`;

writeFileSync(join(__dirname, '..', 'src', 'data', 'enrichment.ts'), out, 'utf8');
console.log(`已寫入 src/data/enrichment.ts（${Object.keys(map).length} 個停靠點）`);
