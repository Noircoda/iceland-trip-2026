import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Stop } from '../../data/itinerary';
import { dayOf, useTrip } from '../../store/useTrip';

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

function stayLabel(s: Stop): string | null {
  if (!s.timeEnd) return null;
  const d = toMin(s.timeEnd) - toMin(s.timeStart);
  if (d <= 0) return null;
  return d >= 60 ? `${Math.floor(d / 60)}h${d % 60 ? `${d % 60}m` : ''}` : `${d}m`;
}

const BADGE_STYLE: Record<string, string> = {
  需預約: 'bg-amber-100 text-amber-700',
  自理: 'bg-lime-100 text-lime-700',
  備選: 'bg-slate-100 text-slate-500',
  雨備: 'bg-sky-100 text-sky-700',
  安全: 'bg-red-100 text-red-700',
};

function Chips({ stop }: { stop: Stop }) {
  const stay = stayLabel(stop);
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1">
      {stay && <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">⏱ {stay}</span>}
      {stop.rating && <span className="rounded-md bg-yellow-50 px-1.5 py-0.5 text-[10px] font-bold text-yellow-700">★ {stop.rating}</span>}
      {stop.badges?.map(b => (
        <span key={b} className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${BADGE_STYLE[b]}`}>
          {b === '需預約' ? '⚠️ 需預約' : b === '自理' ? '🍱 自理' : b}
        </span>
      ))}
      {stop.cutPriority && (
        <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
          ✂️ 延誤先砍{['①', '②', '③'][stop.cutPriority - 1]}
        </span>
      )}
    </div>
  );
}

function Connector({ stop }: { stop: Stop }) {
  if (stop.walk) {
    return (
      <div className="ml-[68px] flex items-center gap-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
        <span className="inline-block h-4 w-px border-l-2 border-dotted border-slate-300" />
        🚶 步行
      </div>
    );
  }
  if (!stop.driveFromPrev) return null;
  return (
    <div className="ml-[68px] flex items-center gap-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
      <span className="inline-block h-5 w-px border-l-2 border-dotted border-slate-300" />
      🚗 {stop.driveFromPrev.km} km・約 {stop.driveFromPrev.min} 分
    </div>
  );
}

function NowChip({ time }: { time: string }) {
  return (
    <div className="relative my-1.5 ml-[52px] flex items-center gap-2">
      <span className="h-px flex-1 bg-red-400" />
      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white shadow">現在 {time}</span>
      <span className="h-px w-3 bg-red-400" />
    </div>
  );
}

export default function TimelinePanel() {
  const activeDay = useTrip(s => s.activeDay);
  const activeStopId = useTrip(s => s.activeStopId);
  const selectSource = useTrip(s => s.selectSource);
  const day = dayOf(activeDay);
  const rootRef = useRef<HTMLDivElement>(null);
  const guardRef = useRef(0);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  /* 點卡片 / 點 marker → 將卡片捲入視野 */
  useEffect(() => {
    if (!activeStopId || selectSource === 'scroll') return;
    guardRef.current = Date.now() + 900;
    rootRef.current
      ?.querySelector(`[data-stop="${activeStopId}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeStopId, selectSource]);

  /* scroll-spy：捲動面板 → 地圖跟著飛 */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      entries => {
        if (Date.now() < guardRef.current) return;
        const visible = entries.filter(e => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const id = (top.target as HTMLElement).dataset.stop!;
        const st = useTrip.getState();
        if (st.activeStopId !== id) st.selectStop(id, 'scroll');
      },
      { root, rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    );
    root.querySelectorAll('[data-stop]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [activeDay]);

  const isToday = (() => {
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return iso === day.date;
  })();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const nowLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  let nowInserted = false;

  const eveningIdx = day.stops.findIndex(s => s.evening);

  return (
    <div ref={rootRef} className="thin-scroll h-full overflow-y-auto overscroll-contain rounded-2xl bg-slate-50/95 shadow-2xl backdrop-blur">
      {/* Day header */}
      <div className="sticky top-0 z-10 px-4 pb-3 pt-4" style={{ background: `linear-gradient(160deg, ${day.color}, ${day.color}cc)` }}>
        <div className="flex items-baseline gap-2 text-white">
          <span className="rounded-lg bg-white/20 px-2 py-0.5 text-sm font-black">Day {day.day}</span>
          <span className="text-xs font-bold opacity-90">
            {day.date.slice(5).replace('-', '/')}（{day.weekday}）
          </span>
        </div>
        <h2 className="mt-1.5 text-lg font-black leading-tight text-white">{day.title}</h2>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-white">🚗 {day.driveKm} km・{day.driveTime}</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-white">☀️ {day.sunrise}–{day.sunset}</span>
        </div>
      </div>

      <div className="px-3 pb-28 pt-3 lg:pb-6">
        {/* 硬時限與彈性 */}
        {day.hardDeadlines.length > 0 && (
          <div className="mb-2 rounded-xl border border-red-100 bg-red-50/80 px-3 py-2">
            {day.hardDeadlines.map(h => (
              <p key={h} className="text-[11px] font-bold leading-5 text-red-600">⏰ {h}</p>
            ))}
          </div>
        )}
        <details className="group mb-3 rounded-xl bg-white px-3 py-2 shadow-sm">
          <summary className="cursor-pointer list-none text-[11px] font-bold text-slate-500">
            🧩 彈性調整建議 <span className="float-right transition group-open:rotate-180">▾</span>
          </summary>
          <ul className="mt-1.5 space-y-1">
            {day.flexNotes.map(n => (
              <li key={n} className="text-[11px] leading-4.5 text-slate-600">・{n}</li>
            ))}
          </ul>
        </details>

        {/* 停靠點 */}
        {day.stops.map((stop, i) => {
          const active = stop.id === activeStopId;
          const showNow = isToday && !nowInserted && toMin(stop.timeStart) > nowMin;
          if (showNow) nowInserted = true;
          return (
            <div key={stop.id}>
              {i === eveningIdx && eveningIdx > 0 && (
                <div className="my-2 flex items-center gap-2 text-[10px] font-bold text-indigo-400">
                  <span className="h-px flex-1 bg-indigo-200" />🌙 入住後・永晝加碼<span className="h-px flex-1 bg-indigo-200" />
                </div>
              )}
              {showNow && <NowChip time={nowLabel} />}
              {i > 0 && <Connector stop={stop} />}
              <motion.div
                data-stop={stop.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.04, 0.5) } }}
                onClick={() => useTrip.getState().selectStop(stop.id, 'card')}
                className={`flex cursor-pointer gap-2 rounded-xl border-l-4 bg-white p-2.5 shadow-sm transition-all ${
                  active ? 'shadow-md ring-1 ring-black/5' : 'hover:shadow'
                }`}
                style={{ borderLeftColor: active ? day.color : 'transparent', background: active ? `${day.color}14` : undefined }}
              >
                <div className="w-[46px] shrink-0 pt-0.5 text-right">
                  <p className="text-[11px] font-black text-slate-700">{stop.timeStart}</p>
                  {stop.timeEnd && <p className="text-[10px] font-semibold text-slate-400">{stop.timeEnd}</p>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[13px] font-bold leading-snug text-slate-800">
                    <span>{stop.icon}</span>
                    <span className="min-w-0 flex-1">{stop.name}</span>
                  </p>
                  {stop.nameLocal && <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">{stop.nameLocal}</p>}
                  <Chips stop={stop} />
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    useTrip.getState().openDetail(stop.id);
                  }}
                  className="self-center rounded-full px-1.5 py-2 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
                  aria-label="詳情"
                >
                  ›
                </button>
              </motion.div>
            </div>
          );
        })}
        {isToday && !nowInserted && <NowChip time={nowLabel} />}
      </div>
    </div>
  );
}
