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
        className="shrink-0 rounded-full bg-slate-900/85 px-3 py-1.5 text-xs font-bold text-white shadow backdrop-blur transition hover:bg-slate-900"
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
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold shadow backdrop-blur transition"
              style={
                active
                  ? { background: day.color, color: '#fff' }
                  : { background: 'rgba(255,255,255,0.92)', color: '#334155' }
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
