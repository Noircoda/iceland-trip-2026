import { useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
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
        className="glass-dark flex shrink-0 items-center gap-0.5 rounded-full py-1.5 pl-2 pr-3 text-xs font-semibold text-white/90 transition hover:text-white"
      >
        <ChevronLeft size={14} strokeWidth={2.2} /> 總覽
      </button>
      <div ref={ref} className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {DAYS.map(day => {
          const active = day.day === activeDay;
          return (
            <button
              key={day.day}
              data-day={day.day}
              onClick={() => enterDay(day.day)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
              style={
                active
                  ? { background: day.color, color: '#fff', boxShadow: 'var(--shadow-sm)' }
                  : { background: 'rgba(255,255,255,0.86)', color: 'var(--ink-soft)', boxShadow: 'var(--shadow-sm)' }
              }
            >
              D{day.day}
              <span className={active ? 'ml-1 text-white/75' : 'ml-1 text-[var(--ink-faint)]'}>
                {day.date.slice(5).replace('-', '/')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
