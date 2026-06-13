import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Car, Footprints, Clock, Star, AlertTriangle, UtensilsCrossed, Scissors, ChevronRight, Moon, Sun, ChevronDown } from 'lucide-react';
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

function Badges({ stop }: { stop: Stop }) {
  const stay = stayLabel(stop);
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1">
      {stay && (
        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'var(--wash)', color: 'var(--ink-soft)' }}>
          <Clock size={10} strokeWidth={2} /> {stay}
        </span>
      )}
      {stop.rating && (
        <span className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'rgba(180,150,70,0.12)', color: '#8a6f3b' }}>
          <Star size={10} strokeWidth={2} fill="#caa85a" stroke="#caa85a" /> {stop.rating}
        </span>
      )}
      {stop.badges?.includes('需預約') && (
        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'rgba(176,118,106,0.14)', color: '#a05c52' }}>
          <AlertTriangle size={10} strokeWidth={2} /> 需預約
        </span>
      )}
      {stop.badges?.includes('自理') && (
        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'rgba(111,143,116,0.16)', color: '#577a5d' }}>
          <UtensilsCrossed size={10} strokeWidth={2} /> 自理
        </span>
      )}
      {stop.badges?.includes('安全') && (
        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'rgba(176,118,106,0.14)', color: '#a05c52' }}>
          <AlertTriangle size={10} strokeWidth={2} /> 留意安全
        </span>
      )}
      {stop.badges?.includes('備選') && (
        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'var(--wash)', color: 'var(--ink-faint)' }}>
          備選
        </span>
      )}
      {stop.cutPriority && (
        <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: 'var(--wash)', color: 'var(--ink-soft)' }}>
          <Scissors size={10} strokeWidth={2} /> 延誤先砍{['①', '②', '③'][stop.cutPriority - 1]}
        </span>
      )}
    </div>
  );
}

const ROW = 'grid grid-cols-[42px_18px_1fr] gap-x-1.5';

function Connector({ stop }: { stop: Stop }) {
  const drive = !stop.walk && stop.driveFromPrev;
  return (
    <div className={`${ROW} items-center`}>
      <span />
      <span />
      <span className="flex items-center gap-1 py-1 pl-1 text-[10px] font-medium" style={{ color: 'var(--ink-faint)' }}>
        {stop.walk ? (
          <><Footprints size={11} strokeWidth={1.8} /> 步行</>
        ) : drive ? (
          <><Car size={11} strokeWidth={1.8} /> {stop.driveFromPrev!.km} km · 約 {stop.driveFromPrev!.min} 分</>
        ) : null}
      </span>
    </div>
  );
}

function NowChip({ time }: { time: string }) {
  return (
    <div className={`${ROW} items-center py-1`}>
      <span className="pr-1 text-right text-[10px] font-bold" style={{ color: '#a05c52' }}>{time}</span>
      <span className="flex justify-center">
        <span className="h-2 w-2 rounded-full" style={{ background: '#a05c52', boxShadow: '0 0 0 3px rgba(160,92,82,0.18)' }} />
      </span>
      <span className="flex items-center gap-2">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: '#a05c52' }}>現在</span>
        <span className="h-px flex-1" style={{ background: 'rgba(160,92,82,0.3)' }} />
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

  useEffect(() => {
    if (!activeStopId || selectSource === 'scroll') return;
    guardRef.current = Date.now() + 900;
    rootRef.current?.querySelector(`[data-stop="${activeStopId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeStopId, selectSource]);

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
    <div ref={rootRef} className="thin-scroll h-full overflow-y-auto overscroll-contain rounded-2xl" style={{ background: 'var(--paper)', boxShadow: 'var(--shadow-lg)' }}>
      {/* Day header（平塗日色，緊湊單區塊） */}
      <div className="sticky top-0 z-10 px-4 pb-2.5 pt-3" style={{ background: day.color }}>
        <div className="flex items-baseline gap-2 text-white">
          <span className="shrink-0 rounded-md bg-white/20 px-1.5 py-0.5 text-[12px] font-bold tracking-wide">Day {day.day}</span>
          <h2 className="truncate text-[15px] font-semibold leading-tight">{day.title}</h2>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] font-medium text-white/85">
          <span>{day.date.slice(5).replace('-', '/')}（{day.weekday}）</span>
          <span className="flex items-center gap-1"><Car size={11} strokeWidth={1.8} /> {day.driveKm} km · {day.driveTime}</span>
          <span className="flex items-center gap-1"><Sun size={11} strokeWidth={1.8} /> {day.sunrise}–{day.sunset}</span>
        </div>
      </div>

      <div className="px-3 pb-[calc(88px+env(safe-area-inset-bottom))] pt-2.5 lg:pb-6">
        {/* 今日餐食 */}
        {day.meals && (
          <div className="mb-2 flex gap-2 rounded-xl px-3 py-1.5" style={{ background: 'var(--paper-raised)', border: '1px solid var(--hairline)' }}>
            <UtensilsCrossed size={12} strokeWidth={2} className="mt-0.5 shrink-0" style={{ color: 'var(--ink-faint)' }} />
            <div className="min-w-0 flex-1 space-y-0.5">
              {([['早', day.meals.breakfast], ['午', day.meals.lunch], ['晚', day.meals.dinner]] as const).map(
                ([k, v]) =>
                  v && (
                    <p key={k} className="flex gap-2 text-[11px] leading-snug">
                      <span className="w-3.5 shrink-0 text-center font-bold" style={{ color: day.color }}>{k}</span>
                      <span style={{ color: v.includes('自理') ? 'var(--ink-faint)' : 'var(--ink)' }}>{v}</span>
                    </p>
                  ),
              )}
            </div>
          </div>
        )}

        {/* 時限與彈性（合併、預設收合，節省空間） */}
        <details className="group mb-2 rounded-xl px-3 py-1.5" style={{ background: 'var(--paper-raised)', border: '1px solid var(--hairline)' }}>
          <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
            <span className="flex items-center gap-2">
              {day.hardDeadlines.length > 0 && (
                <span className="flex items-center gap-1" style={{ color: '#9a5448' }}>
                  <Clock size={11} strokeWidth={2} /> {day.hardDeadlines.length} 個硬時限
                </span>
              )}
              <span>彈性建議</span>
            </span>
            <ChevronDown size={14} strokeWidth={2} className="transition group-open:rotate-180" />
          </summary>
          {day.hardDeadlines.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {day.hardDeadlines.map(h => (
                <li key={h} className="flex items-center gap-1.5 text-[11px] leading-snug" style={{ color: '#9a5448' }}>
                  <Clock size={11} strokeWidth={2} className="shrink-0" /> {h}
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-1.5 space-y-1">
            {day.flexNotes.map(n => (
              <li key={n} className="text-[11px] leading-snug" style={{ color: 'var(--ink-soft)' }}>· {n}</li>
            ))}
          </ul>
        </details>

        {/* 停靠點 rail */}
        <div className="relative">
          <span className="absolute bottom-4 top-3 w-px" style={{ left: '50px', background: 'var(--hairline)' }} />
          {day.stops.map((stop, i) => {
            const active = stop.id === activeStopId;
            const showNow = isToday && !nowInserted && toMin(stop.timeStart) > nowMin;
            if (showNow) nowInserted = true;
            return (
              <div key={stop.id} className="relative">
                {i === eveningIdx && eveningIdx > 0 && (
                  <div className={`${ROW} items-center py-1.5`}>
                    <span />
                    <span className="flex justify-center"><Moon size={11} strokeWidth={1.8} style={{ color: 'var(--ink-faint)' }} /></span>
                    <span className="flex items-center gap-2 text-[10px] font-medium" style={{ color: 'var(--ink-faint)' }}>
                      入住後・永晝加碼<span className="h-px flex-1" style={{ background: 'var(--hairline)' }} />
                    </span>
                  </div>
                )}
                {showNow && <NowChip time={nowLabel} />}
                {i > 0 && <Connector stop={stop} />}
                <div className={`${ROW} items-stretch py-0.5`}>
                  <div className="pt-2.5 text-right">
                    <p className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--ink)' }}>{stop.timeStart}</p>
                    {stop.timeEnd && <p className="text-[10px]" style={{ color: 'var(--ink-faint)' }}>{stop.timeEnd}</p>}
                  </div>
                  <div className="relative flex justify-center pt-3">
                    <span
                      className="z-[1] h-2.5 w-2.5 rounded-full border-2 border-white transition-all"
                      style={{
                        background: stop.badges?.includes('備選') ? '#c3c8cf' : day.color,
                        transform: active ? 'scale(1.5)' : undefined,
                        boxShadow: active ? `0 0 0 3px color-mix(in srgb, ${day.color} 22%, transparent)` : 'var(--shadow-sm)',
                      }}
                    />
                  </div>
                  <motion.div
                    data-stop={stop.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i * 0.035, 0.45) } }}
                    onClick={() => useTrip.getState().selectStop(stop.id, 'card')}
                    className="flex cursor-pointer gap-2 rounded-xl p-2.5 transition-all"
                    style={{
                      background: active ? `color-mix(in srgb, ${day.color} 8%, var(--paper-raised))` : 'var(--paper-raised)',
                      border: `1px solid ${active ? `color-mix(in srgb, ${day.color} 28%, var(--hairline))` : 'var(--hairline)'}`,
                      boxShadow: active ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[13px] font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
                        <span className="text-[14px] opacity-90">{stop.icon}</span>
                        <span className="min-w-0 flex-1">{stop.name}</span>
                      </p>
                      {stop.nameLocal && <p className="mt-0.5 truncate text-[10px] font-medium tracking-wide" style={{ color: 'var(--ink-faint)' }}>{stop.nameLocal}</p>}
                      <Badges stop={stop} />
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        useTrip.getState().openDetail(stop.id);
                      }}
                      className="flex items-center self-center rounded-full p-1 transition hover:bg-[var(--wash)]"
                      style={{ color: 'var(--ink-faint)' }}
                      aria-label="詳情"
                    >
                      <ChevronRight size={16} strokeWidth={2} />
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
