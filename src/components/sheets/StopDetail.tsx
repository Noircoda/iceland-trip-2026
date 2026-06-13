import { motion } from 'framer-motion';
import { gmapsNavUrl, gmapsPlaceUrl } from '../../data/itinerary';
import { stopById, useTrip } from '../../store/useTrip';

export default function StopDetail({ stopId }: { stopId: string }) {
  const closeDetail = useTrip(s => s.closeDetail);
  const hit = stopById(stopId);
  if (!hit) return null;
  const { day, stop } = hit;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-slate-900/35"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeDetail}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl lg:inset-x-auto lg:bottom-6 lg:right-4 lg:top-20 lg:max-h-none lg:w-[400px] lg:rounded-3xl"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        {/* 色帶標頭 */}
        <div
          className="relative overflow-hidden px-5 pb-4 pt-5"
          style={{ background: `linear-gradient(150deg, ${day.color}, color-mix(in srgb, ${day.color} 70%, #0f172a))` }}
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-[0.1]"
            style={{ background: 'repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 14px)' }}
          />
          <span className="pointer-events-none absolute -right-3 -top-5 select-none text-[88px] opacity-25 drop-shadow">{stop.icon}</span>
          <button
            onClick={closeDetail}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-sm font-black text-white backdrop-blur transition hover:bg-white/40"
            aria-label="關閉"
          >
            ✕
          </button>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-white">Day {day.day}・{day.date.slice(5).replace('-', '/')}</span>
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-white">{stop.type}</span>
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-white">
              🕐 {stop.timeStart}{stop.timeEnd ? `–${stop.timeEnd}` : ''}
            </span>
          </div>
          <h2 className="mt-2 pr-8 text-xl font-black leading-tight text-white">{stop.icon} {stop.name}</h2>
          {stop.nameLocal && <p className="mt-0.5 text-xs font-semibold text-white/80">{stop.nameLocal}</p>}
        </div>

        <div className="space-y-3 px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-4">
          {stop.driveFromPrev && (
            <p className="text-[11px] font-bold text-slate-400">🚗 從上一站 {stop.driveFromPrev.km} km・約 {stop.driveFromPrev.min} 分</p>
          )}
          <p className="text-[13.5px] leading-6 text-slate-700">{stop.desc}</p>

          {stop.tips && stop.tips.length > 0 && (
            <div className="space-y-1.5 rounded-xl bg-slate-50 p-3">
              {stop.tips.map(t => (
                <p key={t} className={`text-xs leading-5 ${t.startsWith('⚠️') ? 'font-bold text-red-600' : 'text-slate-600'}`}>
                  {t.startsWith('⚠️') ? t : `💡 ${t}`}
                </p>
              ))}
            </div>
          )}

          {(stop.hours || stop.price || stop.rating) && (
            <div className="grid grid-cols-1 gap-1.5 text-xs font-semibold text-slate-600">
              {stop.hours && <p>🕘 營業：{stop.hours}</p>}
              {stop.price && <p>💰 {stop.price}</p>}
              {stop.rating && <p>⭐ Google 評分 {stop.rating}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={gmapsNavUrl(stop)}
              target="_blank"
              rel="noreferrer"
              className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-black text-white transition active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${day.color}, color-mix(in srgb, ${day.color} 72%, #0f172a))`,
                boxShadow: `0 6px 18px color-mix(in srgb, ${day.color} 40%, transparent)`,
              }}
            >
              🧭 導航到這裡
            </a>
            <a
              href={gmapsPlaceUrl(stop)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
            >
              📍 Google Maps
            </a>
            {stop.links?.booking || stop.links?.official ? (
              <a
                href={stop.links.booking ?? stop.links.official}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
              >
                {stop.links.booking ? '🎟️ 預約／官網' : '🔗 官網'}
              </a>
            ) : (
              <span className="flex items-center justify-center rounded-xl bg-slate-50 py-2.5 text-xs font-semibold text-slate-300">—</span>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
