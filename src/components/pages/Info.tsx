import { motion } from 'framer-motion';
import { INFO_CARDS, SUN_TABLE } from '../../data/info';

export default function Info() {
  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-y-auto bg-slate-100 pb-24 lg:pb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16, transition: { duration: 0.18 } }}
    >
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <h1 className="text-xl font-black text-slate-800">ℹ️ 實用資訊</h1>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {INFO_CARDS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <h2 className="text-sm font-black text-slate-800">{c.icon} {c.title}</h2>
              <ul className="mt-2 space-y-1.5">
                {c.lines.map(l => (
                  <li key={l} className="text-[11.5px] leading-5 text-slate-600">・{l}</li>
                ))}
              </ul>
              {c.links && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {c.links.map(l => (
                    <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="rounded-md bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-600 hover:bg-sky-100">
                      🔗 {l.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-black text-slate-800">🌗 每日日出日落（近永晝）</h2>
          <div className="mt-2 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
            {SUN_TABLE.map(s => (
              <div key={s.date} className="rounded-lg bg-slate-50 px-1 py-1.5 text-center">
                <p className="text-[10px] font-black text-slate-700">{s.date}</p>
                <p className="mt-0.5 text-[9px] font-semibold text-amber-600">↑{s.sunrise}</p>
                <p className="text-[9px] font-semibold text-indigo-500">↓{s.sunset}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] text-slate-400">
          冰島環島手冊 2026・資料整理自行程規劃 v2・地圖 © OpenFreeMap / OpenStreetMap
        </p>
      </div>
    </motion.div>
  );
}
