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

/** 行格線版面：時間欄 44px｜軌道 20px｜卡片 */
const ROW = 'grid grid-cols-[44px_20px_1fr] gap-x-1.5';

function Connector({ stop }: { stop: Stop }) {
  const label = stop.walk
    ? '🚶 步行'
    : stop.driveFromPrev
      ? `🚗 ${stop.driveFromPrev.km} km・約 ${stop.driveFromPrev.min} 分`
      : null;
  if (!label) return null;
  return (
    <div className={`${ROW} items-center`}>
      <span />
      <span />
      <span className="py-1 pl-1 text-[10px] font-bold tracking-wide text-slate-400">{label}</span>
    </div>
  );
}

function NowChip({ time }: { time: string }) {
  return (
    <div className={`${ROW} items-center py-1`}>
      <span className="pr-1 text-right text-[10px] font-black text-red-500">{time}</span>
      <span className="flex justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_0_4px_rgb(239,68,68,0.2)]" />
      </span>
      <span className="flex items-center gap-2">
        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white shadow">現在</span>
        <span className="h-px flex-1 bg-red-300" />
      </span>
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
      <div
        className="sticky top-0 z-10 overflow-hidden px-4 pb-3.5 pt-4"
        style={{ background: `linear-gradient(150deg, ${day.color}, color-mix(in srgb, ${day.color} 72%, #0f172a))` }}
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{ background: 'repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 14px)' }}
        />
        <div className="relative">
          <div className="flex items-baseline gap-2 text-white">
            <span className="rounded-lg bg-white/22 px-2 py-0.5 text-sm font-black tracking-wide">Day {day.day}</span>
            <span className="text-xs font-bold opacity-90">
              {day.date.slice(5).replace('-', '/')}（{day.weekday}）
            </span>
          </div>
          <h2 className="mt-1.5 text-lg font-black leading-tight text-white drop-shadow-sm">{day.title}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
            <span className="rounded-full border border-white/25 bg-white/15 px-2 py-0.5 text-white">🚗 {day.driveKm} km・{day.driveTime}</span>
            <span className="rounded-full border border-white/25 bg-white/15 px-2 py-0.5 text-white">☀️ {day.sunrise}–{day.sunset}</span>
          </div>
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
              <li key={n} className="text-[11px] leading-5 text-slate-600">・{n}</li>
            ))}
          </ul>
        </details>

        {/* 停靠點：時間欄＋軌道＋卡片 */}
        <div className="relative">
          <span className="absolute bottom-4 left-[53px] top-3 w-[2px] rounded bg-slate-200" />
          {day.stops.map((stop, i) => {
            const active = stop.id === activeStopId;
            const showNow = isToday && !nowInserted && toMin(stop.timeStart) > nowMin;
            if (showNow) nowInserted = true;
            return (
              <div key={stop.id} className="relative">
                {i === eveningIdx && eveningIdx > 0 && (
                  <div className={`${ROW} items-center py-1.5`}>
                    <span />
                    <span className="flex justify-center">
                      <span className="text-[11px]">🌙</span>
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-indigo-400">
                      入住後・永晝加碼<span className="h-px flex-1 bg-indigo-200" />
                    </span>
                  </div>
                )}
                {showNow && <NowChip time={nowLabel} />}
                {i > 0 && <Connector stop={stop} />}
                <div className={`${ROW} items-stretch py-0.5`}>
                  <div className="pt-2.5 text-right">
                    <p className="text-[11px] font-black leading-tight text-slate-700">{stop.timeStart}</p>
                    {stop.timeEnd && <p className="text-[10px] font-semibold text-slate-400">{stop.timeEnd}</p>}
                  </div>
                  <div className="relative flex justify-center pt-3">
                    <span
                      className="z-[1] h-3 w-3 rounded-full border-2 border-white shadow transition-all"
                      style={{
                        background: stop.badges?.includes('備選') ? '#cbd5e1' : day.color,
                        transform: active ? 'scale(1.45)' : undefined,
                        boxShadow: active ? `0 0 0 4px color-mix(in srgb, ${day.color} 25%, transparent)` : undefined,
                      }}
                    />
                  </div>
                  <motion.div
                    data-stop={stop.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.04, 0.5) } }}
                    onClick={() => useTrip.getState().selectStop(stop.id, 'card')}
                    className={`flex cursor-pointer gap-2 rounded-xl bg-white p-2.5 shadow-sm transition-all ${
                      active ? 'ring-1 ring-black/5' : 'hover:shadow-md'
                    }`}
                    style={
                      active
                        ? { background: `linear-gradient(135deg, ${day.color}1c, #ffffff 65%)`, boxShadow: `0 4px 16px color-mix(in srgb, ${day.color} 22%, transparent)` }
                        : undefined
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[13px] font-bold leading-snug text-slate-800">
                        <span className="text-[15px]">{stop.icon}</span>
                        <span className="min-w-0 flex-1">{stop.name}</span>
                      </p>
                      {stop.nameLocal && <p className="mt-0.5 truncate text-[10px] font-medium tracking-wide text-slate-400">{stop.nameLocal}</p>}
                      <Chips stop={stop} />
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        useTrip.getState().openDetail(stop.id);
                      }}
                      className="self-center rounded-full px-1.5 py-2 text-base text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
                      aria-label="詳情"
                    >
                      ›
                    </button>
                  </motion.div>
                </div>
              </div>
            );
          })}
          {isToday && !nowInserted && <NowChip time={nowLabel} />}
        </div>
      </div>
    </div>
  );
}
