import type maplibregl from 'maplibre-gl';

export interface CancelToken {
  cancelled: boolean;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** 在指定 geojson source 上做「路線逐漸畫出」動畫 */
export function animateDraw(
  map: maplibregl.Map,
  sourceId: string,
  coords: [number, number][],
  duration: number,
  token: CancelToken,
): Promise<void> {
  return new Promise(resolve => {
    const src = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
    if (!src || coords.length < 2) return resolve();
    const start = performance.now();
    const frame = (now: number) => {
      if (token.cancelled || !map.getSource(sourceId)) return resolve();
      const t = Math.min(1, (now - start) / duration);
      const n = Math.max(2, Math.round(easeOutCubic(t) * coords.length));
      src.setData({
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: coords.slice(0, n) },
      });
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

export function clearDraw(map: maplibregl.Map, sourceId: string) {
  const src = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
  src?.setData({ type: 'FeatureCollection', features: [] });
}
