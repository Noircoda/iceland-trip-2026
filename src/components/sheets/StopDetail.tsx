import { motion } from 'framer-motion';
import { X, Navigation, BookOpen, Ticket, Clock, Star, Wallet, Car } from 'lucide-react';
import { gmapsNavUrl } from '../../data/itinerary';
import { stopById, useTrip } from '../../store/useTrip';

export default function StopDetail({ stopId }: { stopId: string }) {
  const closeDetail = useTrip(s => s.closeDetail);
  const hit = stopById(stopId);
  if (!hit) return null;
  const { day, stop } = hit;
  const bookingUrl = stop.links?.booking ?? stop.links?.official;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(16,24,33,0.32)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeDetail}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 max-h-[84vh] overflow-y-auto thin-scroll rounded-t-3xl lg:inset-x-auto lg:bottom-6 lg:right-4 lg:top-20 lg:max-h-none lg:w-[396px] lg:rounded-3xl"
        style={{ background: 'var(--paper-raised)', boxShadow: 'var(--shadow-lg)' }}
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 70, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      >
        {/* 標頭：平塗日色、小型圖示晶片 */}
        <div className="relative px-5 pb-4 pt-5" style={{ background: day.color }}>
          <button
            onClick={closeDetail}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            aria-label="關閉"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/18 text-[22px]">{stop.icon}</span>
            <div className="min-w-0 pr-6">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-white/85">
                <span className="rounded-full bg-white/20 px-2 py-0.5">Day {day.day}・{day.date.slice(5).replace('-', '/')}</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5">{stop.type}</span>
              </div>
              <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">{stop.name}</h2>
            </div>
          </div>
          {stop.nameLocal && <p className="mt-1.5 text-xs font-medium text-white/80">{stop.nameLocal}</p>}
        </div>

        <div className="space-y-3.5 px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-4">
          {/* 時間 / 車程 */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium" style={{ color: 'var(--ink-soft)' }}>
            <span className="flex items-center gap-1"><Clock size={12} strokeWidth={1.8} /> {stop.timeStart}{stop.timeEnd ? `–${stop.timeEnd}` : ''}</span>
            {stop.driveFromPrev && <span className="flex items-center gap-1"><Car size={12} strokeWidth={1.8} /> 從上一站 {stop.driveFromPrev.km} km · {stop.driveFromPrev.min} 分</span>}
          </div>

          {/* 詳細說明 */}
          <p className="text-[13.5px] leading-[1.75]" style={{ color: 'var(--ink)' }}>{stop.desc}</p>

          {/* tips */}
          {stop.tips && stop.tips.length > 0 && (
            <div className="space-y-1.5 rounded-xl p-3" style={{ background: 'var(--paper)', border: '1px solid var(--hairline)' }}>
              {stop.tips.map(t => {
                const warn = t.startsWith('⚠️');
                return (
                  <p key={t} className="text-xs leading-5" style={{ color: warn ? '#9a5448' : 'var(--ink-soft)', fontWeight: warn ? 600 : 400 }}>
                    {warn ? t : `· ${t}`}
                  </p>
                );
              })}
            </div>
          )}

          {/* 營業/價格/評分 */}
          {(stop.hours || stop.price || stop.rating) && (
            <div className="flex flex-col gap-1.5 text-xs" style={{ color: 'var(--ink-soft)' }}>
              {stop.hours && <span className="flex items-center gap-1.5"><Clock size={13} strokeWidth={1.8} /> 營業：{stop.hours}</span>}
              {stop.price && <span className="flex items-center gap-1.5"><Wallet size={13} strokeWidth={1.8} /> {stop.price}</span>}
              {stop.rating && <span className="flex items-center gap-1.5"><Star size={13} strokeWidth={1.8} fill="#caa85a" stroke="#caa85a" /> Google 評分 {stop.rating}</span>}
            </div>
          )}

          {/* 動作列 */}
          <div className="space-y-2 pt-0.5">
            <a
              href={gmapsNavUrl(stop)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
              style={{ background: day.color, boxShadow: 'var(--shadow-md)' }}
            >
              <Navigation size={16} strokeWidth={2} fill="#fff" /> Google Maps 導航
            </a>
            {(stop.infoUrl || bookingUrl) && (
              <div className="flex gap-2">
                {stop.infoUrl && (
                  <a href={stop.infoUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition" style={{ background: 'var(--wash)', color: 'var(--ink)' }}>
                    <BookOpen size={14} strokeWidth={2} /> {stop.infoLabel ?? '相關資訊'}
                  </a>
                )}
                {bookingUrl && (
                  <a href={bookingUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition" style={{ background: 'var(--wash)', color: 'var(--ink)' }}>
                    <Ticket size={14} strokeWidth={2} /> {stop.links?.booking ? '預約 / 訂位' : '官方網站'}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
