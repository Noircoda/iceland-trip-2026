import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Clock, ExternalLink, ShoppingCart } from 'lucide-react';
import { BOOKINGS, GROCERIES, PREP, type CheckItem } from '../../data/checklists';
import { DAYS } from '../../data/itinerary';
import { useChecklist } from '../../lib/useChecklist';

type Section = 'bookings' | 'groceries' | 'prep';

function Box({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition"
      style={{
        borderColor: checked ? '#6f8f74' : 'var(--hairline)',
        background: checked ? '#6f8f74' : 'transparent',
        color: checked ? '#fff' : 'transparent',
      }}
      aria-label="勾選"
    >
      <Check size={14} strokeWidth={3} />
    </button>
  );
}

function CheckRow({ item, checked, onToggle }: { item: CheckItem; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-xl p-3 transition" style={{ background: 'var(--paper-raised)', border: '1px solid var(--hairline)', opacity: checked ? 0.55 : 1 }}>
      <Box checked={checked} onToggle={onToggle} />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--ink)', textDecoration: checked ? 'line-through' : undefined }}>{item.label}</p>
        {item.detail && <p className="mt-0.5 text-[11px] leading-5" style={{ color: 'var(--ink-soft)' }}>{item.detail}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {item.due && (
            <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: item.urgency === 1 ? 'rgba(176,118,106,0.14)' : 'var(--wash)', color: item.urgency === 1 ? '#a05c52' : 'var(--ink-soft)' }}>
              <Clock size={10} strokeWidth={2} /> {item.due}
            </span>
          )}
          {item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: 'rgba(95,125,153,0.12)', color: '#4f6f8c' }}>
              <ExternalLink size={10} strokeWidth={2} /> 前往
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
      className="absolute inset-0 z-20 overflow-y-auto pb-24 lg:pb-8"
      style={{ background: 'var(--paper)' }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14, transition: { duration: 0.18 } }}
    >
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--ink)' }}>清單</h1>
        <div className="mt-3 flex gap-1 rounded-2xl p-1" style={{ background: 'var(--paper-raised)', border: '1px solid var(--hairline)' }}>
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
              className="flex-1 rounded-xl py-2 text-xs font-semibold transition"
              style={section === key ? { background: 'var(--ink)', color: '#fff' } : { color: 'var(--ink-soft)' }}
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
                <div key={g.id} className="overflow-hidden rounded-xl transition" style={{ background: 'var(--paper-raised)', border: '1px solid var(--hairline)', opacity: checked ? 0.55 : 1 }}>
                  <div className="h-[3px] w-full" style={{ background: day.color }} />
                  <div className="flex items-start gap-3 p-3">
                    <Box checked={checked} onToggle={() => toggle(g.id)} />
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: day.color }}>D{g.day}</span>
                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: 'var(--ink)', textDecoration: checked ? 'line-through' : undefined }}>
                          <ShoppingCart size={13} strokeWidth={2} /> {g.store}
                        </span>
                      </p>
                      <p className="mt-1 text-[11px]" style={{ color: 'var(--ink-faint)' }}>{g.when}・{g.hours}</p>
                      <p className="mt-0.5 text-[11px] font-medium leading-5" style={{ color: 'var(--ink-soft)' }}>{g.supplies}</p>
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
