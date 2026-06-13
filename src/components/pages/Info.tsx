import { motion } from 'framer-motion';
import { ExternalLink, Sunrise, Sunset } from 'lucide-react';
import { INFO_CARDS, SUN_TABLE } from '../../data/info';

export default function Info() {
  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-y-auto pb-24 lg:pb-8"
      style={{ background: 'var(--paper)' }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14, transition: { duration: 0.18 } }}
    >
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>實用資訊</h1>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INFO_CARDS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
              className="rounded-2xl p-4"
              style={{ background: 'var(--paper-raised)', border: '1px solid var(--hairline)' }}
            >
              <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{c.icon} {c.title}</h2>
              <ul className="mt-2 space-y-1.5">
                {c.lines.map(l => (
                  <li key={l} className="text-[11.5px] leading-5" style={{ color: 'var(--ink-soft)' }}>· {l}</li>
                ))}
              </ul>
              {c.links && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {c.links.map(l => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold" style={{ background: 'rgba(95,125,153,0.12)', color: '#4f6f8c' }}>
                      <ExternalLink size={10} strokeWidth={2} /> {l.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl p-4" style={{ background: 'var(--paper-raised)', border: '1px solid var(--hairline)' }}>
          <h2 className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>每日日出日落（近永晝）</h2>
          <div className="mt-2.5 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
            {SUN_TABLE.map(s => (
              <div key={s.date} className="rounded-lg px-1 py-2 text-center" style={{ background: 'var(--paper)' }}>
                <p className="text-[10px] font-semibold" style={{ color: 'var(--ink)' }}>{s.date}</p>
                <p className="mt-1 flex items-center justify-center gap-0.5 text-[9px] font-medium" style={{ color: '#b08a52' }}><Sunrise size={9} strokeWidth={2} />{s.sunrise}</p>
                <p className="flex items-center justify-center gap-0.5 text-[9px] font-medium" style={{ color: '#6a7197' }}><Sunset size={9} strokeWidth={2} />{s.sunset}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-[10px]" style={{ color: 'var(--ink-faint)' }}>
          冰島環島手冊 2026・地圖 © OpenFreeMap / OpenStreetMap
        </p>
      </div>
    </motion.div>
  );
}
