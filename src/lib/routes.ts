import type { FeatureCollection, LineString } from 'geojson';
import type { Day } from '../data/itinerary';

export interface SegProps {
  day: number;
  from: string;
  to: string;
  evening: boolean;
  distanceKm: number | null;
  durationMin: number | null;
}
export type RouteFC = FeatureCollection<LineString, SegProps>;

const cache = new Map<number, Promise<RouteFC>>();

export function loadDayRoute(day: number): Promise<RouteFC> {
  if (!cache.has(day)) {
    cache.set(
      day,
      fetch(`${import.meta.env.BASE_URL}routes/day${day}.geojson`).then(r => {
        if (!r.ok) throw new Error(`route day${day} HTTP ${r.status}`);
        return r.json() as Promise<RouteFC>;
      }),
    );
  }
  return cache.get(day)!;
}

export function loadAllRoutes(days: Day[]): Promise<RouteFC[]> {
  return Promise.all(days.map(d => loadDayRoute(d.day)));
}

/** 白天段（非 evening）的座標串接，供繪線動畫用 */
export function dayDrawCoords(fc: RouteFC): [number, number][] {
  const out: [number, number][] = [];
  for (const f of fc.features) {
    if (f.properties.evening) continue;
    out.push(...(f.geometry.coordinates as [number, number][]));
  }
  return out;
}

/** 一日的 bounding box（路線＋停靠點） */
export function dayBounds(day: Day, fc?: RouteFC): [[number, number], [number, number]] {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  const eat = (c: [number, number]) => {
    if (c[0] < minLng) minLng = c[0];
    if (c[0] > maxLng) maxLng = c[0];
    if (c[1] < minLat) minLat = c[1];
    if (c[1] > maxLat) maxLat = c[1];
  };
  day.stops.forEach(s => eat(s.coord));
  fc?.features.forEach(f => (f.geometry.coordinates as [number, number][]).forEach(eat));
  return [[minLng, minLat], [maxLng, maxLat]];
}

export const ICELAND_BOUNDS: [[number, number], [number, number]] = [[-24.7, 63.2], [-13.3, 66.4]];
