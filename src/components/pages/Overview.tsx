import { motion } from 'framer-motion';
import { DAYS, TRIP_STATS } from '../../data/itinerary';
import { useTrip } from '../../store/useTrip';

function lodgingName(dayIdx: number): string {
  const day = DAYS[dayIdx];
  const lodging = [...day.stops].reverse().find(s => s.type === '住宿');
  if (!lodging) return '✈️ BA801 10:20 → 倫敦';
  return `🛏 ${lodging.name.replace(/^(夜宿|Check-in)[:：]/, '')}`;
}

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
      <div className="bg-gradient-to-b from-[#0b1d33]/90 via-[#0b1d33]/40 to-transparent px-4 pb-14 pt-4 sm:px-6">
        <motion.div
          className="glass-dark pointer-events-auto inline-block max-w-full rounded-3xl px-5 py-4"
          initial={{ y: -22, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.15, type: 'spring', damping: 22 } }}
        >
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="h-11 w-11 rounded-2xl shadow-lg" />
            <div>
              <h1 className="text-[22px] font-black tracking-wide text-white sm:text-[26px]">
                冰島環島手冊 <span className="aurora-text">2026</span>
              </h1>
              <p className="text-[11px] font-semibold tracking-wide text-slate-300 sm:text-xs">
                7/12 – 7/21・順時針環島
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              ['📅', `${TRIP_STATS.days} 天`],
              ['📍', `${TRIP_STATS.stops} 個停靠點`],
              ['🚗', `~${Math.round(TRIP_STATS.km / 10) * 10} km`],
              ['☀️', '永晝・日落 23:00+'],
            ].map(([ic, t]) => (
              <span key={t} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10.5px] font-bold text-slate-100">
                {ic} {t}
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
          className="glass-dark pointer-events-auto absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
        >
          跳過動畫 ⏭
        </motion.button>
      )}

      {/* 底部日卡 */}
      <div className="bg-gradient-to-t from-[#0b1d33]/90 via-[#0b1d33]/45 to-transparent pb-20 pt-12 lg:pb-6">
        <motion.p
          className="mb-2 flex items-center gap-1.5 px-4 text-[11px] font-bold tracking-[0.18em] text-slate-200/90 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4 } }}
        >
          點選任一天進入路線
          <motion.span animate={{ y: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>↓</motion.span>
        </motion.p>
        <div className="pointer-events-auto flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:px-6">
          {DAYS.map((day, i) => (
            <motion.button
              key={day.day}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.25 + i * 0.05 } }}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => enterDay(day.day)}
              className="group relative w-[248px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white/95 text-left shadow-xl backdrop-blur"
            >
              <div className="h-[5px] w-full" style={{ background: `linear-gradient(90deg, ${day.color}, ${day.color}88)` }} />
              <div className="p-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-black text-white shadow-md"
                    style={{ background: `linear-gradient(145deg, ${day.color}, color-mix(in srgb, ${day.color} 70%, #0f172a))` }}
                  >
                    D{day.day}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-bold tracking-wide text-slate-400">
                      {day.date.slice(5).replace('-', '/')}・{day.weekday}
                    </p>
                    <p className="truncate text-[13.5px] font-extrabold leading-tight text-slate-800">{day.title}</p>
                  </div>
                </div>
                <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="font-bold">🚗 {day.driveKm} km</span>
                  <span className="text-slate-300">｜</span>
                  <span>{day.driveTime}</span>
                </p>
                <p className="mt-1 truncate text-[11px] font-semibold text-slate-600">{lodgingName(i)}</p>
                <p className="mt-1.5 truncate text-[13px] tracking-wide opacity-80">
                  {day.stops.slice(0, 8).map(s => s.icon).join(' ')}
                </p>
              </div>
              <span
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 0 2px ${day.color}` }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
