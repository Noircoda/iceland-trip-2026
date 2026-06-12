import { motion } from 'framer-motion';
import { useState } from 'react';
import { BOOKINGS, GROCERIES, PREP, type CheckItem } from '../../data/checklists';
import { DAYS } from '../../data/itinerary';
import { useChecklist } from '../../lib/useChecklist';

type Section = 'bookings' | 'groceries' | 'prep';

const URGENCY: Record<number, string> = { 1: 'bg-red-100 text-red-700', 2: 'bg-amber-100 text-amber-700', 3: 'bg-slate-100 text-slate-500' };

function CheckRow({ item, checked, onToggle }: { item: CheckItem; checked: boolean; onToggle: () => void }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm transition ${checked ? 'opacity-55' : ''}`}>
      <button
        onClick={onToggle}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-black transition ${
          checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-transparent hover:border-emerald-400'
        }`}
        aria-label="勾選"
      >
        ✓
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-[13px] font-bold leading-snug text-slate-800 ${checked ? 'line-through' : ''}`}>{item.label}</p>
        {item.detail && <p className="mt-0.5 text-[11px] leading-4.5 text-slate-500">{item.detail}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {item.due && <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${URGENCY[item.urgency ?? 3]}`}>⏳ {item.due}</span>}
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-600 hover:bg-sky-100">
              🔗 前往預約
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Checklists() {
  const [section, setSection] = useState<Section>('bookings');
  const { checks, toggle } = useChecklist();

  const doneCount = (items: { id: string }[]) => items.filter(i => checks[i.id]).length;

  return (
    <motion.div
      className="absolute inset-0 z-20 overflow-y-auto bg-slate-100 pb-24 lg:pb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16, transition: { duration: 0.18 } }}
    >
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <h1 className="text-xl font-black text-slate-800">✅ 清單</h1>
        <div className="mt-3 flex gap-1.5 rounded-2xl bg-white p-1 shadow-sm">
          {(
            [
              ['bookings', `預約 ${doneCount(BOOKINGS)}/${BOOKINGS.length}`],
              ['groceries', '採買補給'],
              ['prep', `行前 ${doneCount(PREP)}/${PREP.length}`],
            ] as [Section, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                section === key ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2.5">
          {section === 'bookings' && BOOKINGS.map(b => <CheckRow key={b.id} item={b} checked={!!checks[b.id]} onToggle={() => toggle(b.id)} />)}

          {section === 'prep' && PREP.map(p => <CheckRow key={p.id} item={p} checked={!!checks[p.id]} onToggle={() => toggle(p.id)} />)}

          {section === 'groceries' &&
            GROCERIES.map(g => {
              const day = DAYS.find(d => d.day === g.day)!;
              const checked = !!checks[g.id];
              return (
                <div key={g.id} className={`overflow-hidden rounded-xl bg-white shadow-sm transition ${checked ? 'opacity-55' : ''}`}>
                  <div className="h-1 w-full" style={{ background: day.color }} />
                  <div className="flex items-start gap-3 p-3">
                    <button
                      onClick={() => toggle(g.id)}
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-black transition ${
                        checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-400'
                      }`}
                      aria-label="勾選"
                    >
                      ✓
                    </button>
                    <div>
                      <p className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: day.color }}>
                          D{g.day}
                        </span>
                        <span className={`text-[13px] font-bold text-slate-800 ${checked ? 'line-through' : ''}`}>🛒 {g.store}</span>
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">⏰ {g.when}・{g.hours}</p>
                      <p className="mt-0.5 text-[11px] font-semibold leading-4.5 text-slate-600">{g.supplies}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}
