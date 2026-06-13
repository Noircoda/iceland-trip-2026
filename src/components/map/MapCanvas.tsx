import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import { DAYS, type Stop } from '../../data/itinerary';
import { useTrip, dayOf, stopById } from '../../store/useTrip';
import { loadDayRoute, dayBounds, dayDrawCoords, ICELAND_BOUNDS } from '../../lib/routes';
import { animateDraw, clearDraw, type CancelToken } from '../../lib/animateDraw';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

function isDesktop() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

/** padding 過大時依視窗縮放，避免 maplibre「cannot fit within canvas」 */
function clampPad(p: { top: number; bottom: number; left: number; right: number }) {
  const maxV = window.innerHeight * 0.62;
  const maxH = window.innerWidth * 0.62;
  const sv = p.top + p.bottom > maxV ? maxV / (p.top + p.bottom) : 1;
  const sh = p.left + p.right > maxH ? maxH / (p.left + p.right) : 1;
  return { top: p.top * sv, bottom: p.bottom * sv, left: p.left * sh, right: p.right * sh };
}

function dayPadding() {
  return clampPad(
    isDesktop()
      ? { top: 90, bottom: 50, left: 480, right: 70 }
      : { top: 120, bottom: Math.round(window.innerHeight * 0.45), left: 40, right: 40 },
  );
}

function overviewPadding() {
  return clampPad(
    isDesktop()
      ? { top: 130, bottom: 190, left: 90, right: 90 }
      : { top: 140, bottom: 230, left: 30, right: 30 },
  );
}

export default function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const introTokenRef = useRef<CancelToken>({ cancelled: false });
  const [ready, setReady] = useState(false);

  const view = useTrip(s => s.view);
  const activeDay = useTrip(s => s.activeDay);
  const activeStopId = useTrip(s => s.activeStopId);
  const selectSource = useTrip(s => s.selectSource);
  const introDone = useTrip(s => s.introDone);
  const sheetSnap = useTrip(s => s.sheetSnap);

  /* ---------- 初始化 ---------- */
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [-18.7, 64.95],
      zoom: 5.1,
      pitch: 42,
      bearing: -12,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    if (import.meta.env.DEV) (window as unknown as { __map: maplibregl.Map }).__map = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(
      new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }),
      'bottom-right',
    );

    map.on('load', async () => {
      // 每日路線：casing + 主線 + 夜間虛線
      await Promise.all(
        DAYS.map(async day => {
          try {
            const fc = await loadDayRoute(day.day);
            if (!map.getStyle()) return;
            map.addSource(`day-${day.day}`, { type: 'geojson', data: fc });
            map.addLayer({
              id: `day-${day.day}-casing`,
              type: 'line',
              source: `day-${day.day}`,
              filter: ['!=', ['get', 'evening'], true],
              layout: { 'line-cap': 'round', 'line-join': 'round' },
              paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0 },
            });
            map.addLayer({
              id: `day-${day.day}-line`,
              type: 'line',
              source: `day-${day.day}`,
              filter: ['!=', ['get', 'evening'], true],
              layout: { 'line-cap': 'round', 'line-join': 'round' },
              paint: { 'line-color': day.color, 'line-width': 4, 'line-opacity': 0 },
            });
            map.addLayer({
              id: `day-${day.day}-evening`,
              type: 'line',
              source: `day-${day.day}`,
              filter: ['==', ['get', 'evening'], true],
              layout: { 'line-cap': 'round', 'line-join': 'round' },
              paint: { 'line-color': day.color, 'line-width': 3, 'line-opacity': 0, 'line-dasharray': [0.5, 2] },
            });
          } catch {
            /* 離線首跑等情況：略過路線，markers 仍可用 */
          }
        }),
      );
      // 開場繪線動畫用的共用 source/layer（最上層）
      map.addSource('draw', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
        id: 'draw-line',
        type: 'line',
        source: 'draw',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#fff', 'line-width': 4.5, 'line-opacity': 0.95 },
      });
      setReady(true);
      useTrip.getState().setMapReady();
    });

    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current);
    return () => {
      introTokenRef.current.cancelled = true;
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* ---------- 場景：總覽 / 單日 ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    introTokenRef.current.cancelled = true; // 取消進行中的開場動畫

    const setDayOpacity = (n: number, casing: number, line: number, evening: number) => {
      if (!map.getLayer(`day-${n}-line`)) return;
      map.setPaintProperty(`day-${n}-casing`, 'line-opacity', casing);
      map.setPaintProperty(`day-${n}-line`, 'line-opacity', line);
      map.setPaintProperty(`day-${n}-evening`, 'line-opacity', evening);
      map.setPaintProperty(`day-${n}-line`, 'line-width', 4);
    };

    if (view === 'overview' && !introDone) {
      // —— 開場動畫 ——
      DAYS.forEach(d => setDayOpacity(d.day, 0, 0, 0));
      rebuildMarkers(map, 'none');
      const token: CancelToken = { cancelled: false };
      introTokenRef.current = token;
      map.easeTo({ pitch: 0, bearing: 0, zoom: 5.4, center: [-18.7, 64.95], duration: 8500 });
      (async () => {
        await new Promise(r => setTimeout(r, 350));
        for (const day of DAYS) {
          if (token.cancelled) return;
          try {
            const fc = await loadDayRoute(day.day);
            map.setPaintProperty('draw-line', 'line-color', day.color);
            await animateDraw(map, 'draw', dayDrawCoords(fc), 680, token);
          } catch {
            /* ignore */
          }
          if (token.cancelled) return;
          setDayOpacity(day.day, 0.9, 0.88, 0.45);
        }
        clearDraw(map, 'draw');
        useTrip.getState().finishIntro();
      })();
      return;
    }

    clearDraw(map, 'draw');

    if (view === 'overview') {
      DAYS.forEach(d => setDayOpacity(d.day, 0.9, 0.88, 0.45));
      rebuildMarkers(map, 'overview');
      map.fitBounds(ICELAND_BOUNDS, { padding: overviewPadding(), pitch: 0, bearing: 0, duration: 1100 });
    } else {
      DAYS.forEach(d =>
        d.day === activeDay ? setDayOpacity(d.day, 0.95, 1, 0.65) : setDayOpacity(d.day, 0, 0.1, 0.05),
      );
      const map2 = map;
      if (map2.getLayer(`day-${activeDay}-line`)) map2.setPaintProperty(`day-${activeDay}-line`, 'line-width', 4.5);
      rebuildMarkers(map, 'day');
      loadDayRoute(activeDay)
        .then(fc => map.fitBounds(dayBounds(dayOf(activeDay), fc), { padding: dayPadding(), pitch: 0, bearing: 0, duration: 1100, maxZoom: 12.5 }))
        .catch(() => map.fitBounds(dayBounds(dayOf(activeDay)), { padding: dayPadding(), pitch: 0, bearing: 0, duration: 1100, maxZoom: 12.5 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, view, activeDay, introDone]);

  /* ---------- 停靠點選取：飛行＋脈衝 ---------- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    markersRef.current.forEach((mk, id) => mk.getElement().classList.toggle('active', id === activeStopId));
    if (!activeStopId || view !== 'day') return;
    const hit = stopById(activeStopId);
    if (!hit) return;
    const gentle = selectSource === 'scroll';
    map.flyTo({
      center: hit.stop.coord,
      zoom: Math.max(map.getZoom(), gentle ? 9.5 : 11.5),
      padding: dayPadding(),
      duration: gentle ? 850 : 1100,
      essential: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStopId, selectSource, ready]);

  /* 手機抽屜高度變化時重算視野（避免被蓋住） */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || view !== 'day' || isDesktop()) return;
    map.resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetSnap]);

  /* ---------- markers ---------- */
  function rebuildMarkers(map: maplibregl.Map, mode: 'none' | 'overview' | 'day') {
    markersRef.current.forEach(mk => mk.remove());
    markersRef.current.clear();
    if (mode === 'none') return;

    // 注意：外層 wrapper 由 MapLibre 以 inline transform 定位，縮放/動畫只能作用在內層
    const makeWrapped = (innerClass: string, color: string, delayMs: number, html: string, title: string, onClick: () => void) => {
      const wrap = document.createElement('div');
      wrap.className = 'mk-wrap';
      wrap.title = title;
      const inner = document.createElement('div');
      inner.className = innerClass;
      inner.style.setProperty('--mk-color', color);
      inner.style.animationDelay = `${delayMs}ms`;
      inner.innerHTML = html;
      wrap.appendChild(inner);
      wrap.addEventListener('click', e => {
        e.stopPropagation();
        onClick();
      });
      return wrap;
    };

    if (mode === 'overview') {
      DAYS.forEach((day, i) => {
        const lodging = [...day.stops].reverse().find(s => s.type === '住宿') ?? day.stops[day.stops.length - 1];
        const el = makeWrapped('day-marker', day.color, i * 60, `D${day.day}`, `Day ${day.day}｜${day.title}`, () =>
          useTrip.getState().enterDay(day.day),
        );
        const mk = new maplibregl.Marker({ element: el }).setLngLat(lodging.coord).addTo(map);
        markersRef.current.set(`ov-${day.day}`, mk);
      });
      return;
    }

    const day = dayOf(useTrip.getState().activeDay);
    day.stops.forEach((stop: Stop, i: number) => {
      const el = makeWrapped('stop-marker', day.color, i * 45, `${stop.icon}<span class="mk-num">${i + 1}</span>`, stop.name, () =>
        useTrip.getState().openDetail(stop.id),
      );
      const mk = new maplibregl.Marker({ element: el }).setLngLat(stop.coord).addTo(map);
      markersRef.current.set(stop.id, mk);
    });
  }

  // inline style：maplibre 的無 layer CSS（.maplibregl-map{position:relative}）會蓋過 @layer 內的 Tailwind utilities
  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />;
}
