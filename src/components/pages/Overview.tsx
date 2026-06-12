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
      {/* 頂部標題列 */}
      <div className="bg-gradient-to-b from-slate-900/85 via-slate-900/45 to-transparent px-4 pb-12 pt-4 sm:px-6">
        <motion.div initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.15 } }}>
          <h1 className="text-2xl font-black tracking-wide text-white drop-shadow sm:text-3xl">
            🇮🇸 冰島環島手冊 <span className="text-sky-300">2026</span>
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-200/90 sm:text-sm">
            7/12 – 7/21・順時針環島・每日結尾都是住宿
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {[`${TRIP_STATS.days} 天`, `${TRIP_STATS.stops} 個停靠點`, `~${Math.round(TRIP_STATS.km / 10) * 10} km 駕駛`, '永晝 ☀️ 日落 23:00+'].map(t => (
              <span key={t} className="pointer-events-auto rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 跳過開場動畫 */}
      {!introDone && (
        <button
          onClick={finishIntro}
          className="pointer-events-auto absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-900/70 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-slate-900"
        >
          跳過動畫 ⏭
        </button>
      )}

      {/* 底部日卡 */}
      <div className="bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent pb-20 pt-10 lg:pb-6">
        <p className="mb-2 px-4 text-[11px] font-bold tracking-widest text-slate-200/80 sm:px-6">
          點選任一天進入路線 ↓
        </p>
        <div className="pointer-events-auto flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:px-6">
          {DAYS.map((day, i) => (
            <motion.button
              key={day.day}
              initial={{ y: 26, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.25 + i * 0.05 } }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => enterDay(day.day)}
              className="group w-60 shrink-0 snap-start overflow-hidden rounded-2xl bg-white/95 text-left shadow-xl backdrop-blur transition"
            >
              <div className="h-1.5 w-full" style={{ background: day.color }} />
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white"
                    style={{ background: day.color }}
                  >
                    D{day.day}
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500">
                      {day.date.slice(5).replace('-', '/')}（{day.weekday.replace('週', '')}）
                    </p>
                    <p className="text-sm font-bold leading-tight text-slate-800">{day.title}</p>
                  </div>
                </div>
                <p className="mt-2 line-clamp-1 text-[11px] text-slate-500">
                  🚗 {day.driveKm} km・{day.driveTime}
                </p>
                <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-slate-600">{lodgingName(i)}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
