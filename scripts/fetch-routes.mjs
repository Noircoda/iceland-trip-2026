// 以 OSRM 公開伺服器預先抓取每日行車路線 → public/routes/day{N}.geojson
// 用法: node --experimental-strip-types scripts/fetch-routes.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DAYS } from '../src/data/itinerary.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'routes');
mkdirSync(OUT_DIR, { recursive: true });

const OSRM = 'https://router.project-osrm.org/route/v1/driving';

async function fetchSegment(a, b, via = [], retries = 3) {
  const pts = [a, ...via, b].map(c => `${c[0]},${c[1]}`).join(';');
  const url = `${OSRM}/${pts}?overview=full&geometries=geojson`;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'iceland-trip-planner' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.code !== 'Ok' || !json.routes?.[0]) throw new Error(json.code || 'no route');
      const r = json.routes[0];
      return { geometry: r.geometry, distanceKm: +(r.distance / 1000).toFixed(1), durationMin: Math.round(r.duration / 60), fallback: false };
    } catch (err) {
      if (i === retries - 1) {
        console.warn(`  ⚠ OSRM 失敗（${err.message}），改用直線 fallback`);
        return { geometry: { type: 'LineString', coordinates: [a, b] }, distanceKm: null, durationMin: null, fallback: true };
      }
      await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    }
  }
}

for (const [di, day] of DAYS.entries()) {
  const waypoints = day.stops.filter(s => !s.walk).map(s => ({
    id: s.id, name: s.name, coord: s.routeCoord ?? s.coord, evening: !!s.evening, via: s.via ?? [],
  }));
  // 接上前一晚住宿作為當日路線起點（Day 2+）
  if (di > 0) {
    const prev = DAYS[di - 1].stops.filter(s => !s.walk && !s.evening).at(-1);
    if (prev) waypoints.unshift({ id: prev.id, name: prev.name, coord: prev.routeCoord ?? prev.coord, evening: false, via: [] });
  }
  const features = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i], b = waypoints[i + 1];
    const seg = await fetchSegment(a.coord, b.coord, b.via);
    features.push({
      type: 'Feature',
      properties: { day: day.day, from: a.id, to: b.id, evening: b.evening, distanceKm: seg.distanceKm, durationMin: seg.durationMin, fallback: seg.fallback },
      geometry: seg.geometry,
    });
    await new Promise(r => setTimeout(r, 600)); // 節流，對公共伺服器友善
  }
  const fc = { type: 'FeatureCollection', features };
  writeFileSync(join(OUT_DIR, `day${day.day}.geojson`), JSON.stringify(fc), 'utf8');
  const km = features.reduce((n, f) => n + (f.properties.distanceKm || 0), 0);
  console.log(`Day ${day.day}: ${features.length} 段, ~${km.toFixed(0)} km${features.some(f => f.properties.fallback) ? '（含 fallback 直線）' : ''}`);
}
console.log('完成 → public/routes/');
