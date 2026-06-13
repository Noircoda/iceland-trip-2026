import { motion } from 'framer-motion';
import { Calendar, MapPin, Car, Sun } from 'lucide-react';
import { DAYS, TRIP_STATS } from '../../data/itinerary';
import { useTrip } from '../../store/useTrip';

function lodgingName(dayIdx: number): string {
  const day = DAYS[dayIdx];
  const lodging = [...day.stops].reverse().find(s => s.type === '住宿');
  if (!lodging) return 'BA801 10:20 → 倫敦';
  return lodging.name.replace(/^(夜宿|Check-in)[:：]/, '');
}

const STATS = [
  { icon: Calendar, t: `${TRIP_STATS.days} 天` },
  { icon: MapPin, t: `${TRIP_STATS.stops} 個停靠點` },
  { icon: Car, t: `~${Math.round(TRIP_STATS.km / 10) * 10} km` },
  { icon: Sun, t: '永晝・日落 23:00+' },
];

export default function Overview() {
  const introDone = useTrip(s => s.introDone);
  const finishIntro = useTrip(s => s.finishIntro);
  const enterDay = useTrip(s => s.enterDay);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {/* 頂部 hero */}
      <div className="bg-gradient-to-b from-[#0e1620]/85 via-[#0e1620]/35 to-transparent px-4 pb-14 pt-4 sm:px-6">
        <motion.div
          className="glass-dark pointer-events-auto inline-block max-w-full rounded-3xl px-5 py-4"
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.15, type: 'spring', damping: 24 } }}
        >
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="h-10 w-10 rounded-2xl" />
            <div>
              <h1 className="text-[21px] font-semibold tracking-wide text-white sm:text-[24px]">
                冰島環島手冊 <span className="brand-accent font-bold">2026</span>
              </h1>
              <p className="text-[11px] font-medium tracking-wide text-slate-300/90">7/12 – 7/21・順時針環島</p>
            </div>
          </div>
          <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {STATS.map(({ icon: Icon, t }) => (
              <span key={t} className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-200/85">
                <Icon size={13} strokeWidth={1.8} className="text-slate-400" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 跳過開場動畫 */}
      {!introDone && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1 } }}
          onClick={finishIntro}
          className="glass-dark pointer-events-auto absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full px-4 py-2 text-xs font-semibold text-white/90 transition hover:text-white"
        >
          跳過動畫
        </motion.button>
      )}

      {/* 底部日卡 */}
      <div className="bg-gradient-to-t from-[#0e1620]/85 via-[#0e1620]/40 to-transparent pb-20 pt-12 lg:pb-6">
        <p className="mb-2.5 px-4 text-[11px] font-medium tracking-[0.16em] text-slate-300/80 sm:px-6">
          點選任一天進入路線
        </p>
        <div className="pointer-events-auto flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:px-6">
          {DAYS.map((day, i) => (
            <motion.button
              key={day.day}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 + i * 0.045 } }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => enterDay(day.day)}
              className="group relative w-[238px] shrink-0 snap-start overflow-hidden rounded-2xl text-left"
              style={{ background: 'var(--paper-raised)', boxShadow: 'var(--shadow-md)' }}
            >
              <div className="h-[3px] w-full" style={{ background: day.color }} />
              <div className="p-3.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold text-white"
                    style={{ background: day.color }}
                  >
                    D{day.day}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-medium tracking-wide" style={{ color: 'var(--ink-faint)' }}>
                      {day.date.slice(5).replace('-', '/')}・{day.weekday}
                    </p>
                    <p className="truncate text-[13.5px] font-semibold" style={{ color: 'var(--ink)' }}>
                      {day.title}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                  <Car size={12} strokeWidth={1.8} />
                  <span className="font-medium">{day.driveKm} km</span>
                  <span style={{ color: 'var(--hairline)' }}>·</span>
                  <span>{day.driveTime}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                  <MapPin size={12} strokeWidth={1.8} />
                  <span className="truncate">{lodgingName(i)}</span>
                </div>
                <p className="mt-2 truncate text-[12px] opacity-60 grayscale-[0.25]">
                  {day.stops.filter(s => !['交通', '加油'].includes(s.type)).slice(0, 8).map(s => s.icon).join(' ')}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
