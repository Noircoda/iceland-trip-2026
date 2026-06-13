import { useEffect, useRef } from 'react';
import { DAYS } from '../../data/itinerary';
import { useTrip } from '../../store/useTrip';

export default function DayChips() {
  const activeDay = useTrip(s => s.activeDay);
  const enterDay = useTrip(s => s.enterDay);
  const backToOverview = useTrip(s => s.backToOverview);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${activeDay}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeDay]);

  return (
    <div className="pointer-events-auto flex items-center gap-1.5">
      <button
        onClick={backToOverview}
        className="glass-dark shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800"
      >
        ← 總覽
      </button>
      <div ref={ref} className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {DAYS.map(day => {
          const active = day.day === activeDay;
          return (
            <button
              key={day.day}
              data-day={day.day}
              onClick={() => enterDay(day.day)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold shadow backdrop-blur transition-all"
              style={
                active
                  ? {
                      background: `linear-gradient(135deg, ${day.color}, color-mix(in srgb, ${day.color} 75%, #0f172a))`,
                      color: '#fff',
                      boxShadow: `0 4px 14px color-mix(in srgb, ${day.color} 45%, transparent)`,
                    }
                  : { background: 'rgba(255,255,255,0.88)', color: '#334155' }
              }
            >
              D{day.day}
              <span className={`ml-1 font-semibold ${active ? 'text-white/85' : 'text-slate-400'}`}>
                {day.date.slice(5).replace('-', '/')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
