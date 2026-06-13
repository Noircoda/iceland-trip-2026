import { Map, ListChecks, Info } from 'lucide-react';
import { useTrip, type Tab } from '../../store/useTrip';

const TABS: { key: Tab; icon: typeof Map; label: string }[] = [
  { key: 'map', icon: Map, label: '行程' },
  { key: 'list', icon: ListChecks, label: '清單' },
  { key: 'info', icon: Info, label: '資訊' },
];

export default function TabBar() {
  const tab = useTrip(s => s.tab);
  const setTab = useTrip(s => s.setTab);

  return (
    <>
      {/* 手機：底部列 */}
      <nav className="glass fixed inset-x-0 bottom-0 z-40 flex justify-around pb-[max(env(safe-area-inset-bottom),6px)] pt-2 lg:hidden">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="relative flex w-20 flex-col items-center gap-1 py-0.5 text-[10.5px] font-semibold transition-colors"
              style={{ color: active ? 'var(--ink)' : 'var(--ink-faint)' }}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {t.label}
            </button>
          );
        })}
      </nav>
      {/* 桌面：右上浮動 */}
      <nav className="glass fixed right-4 top-4 z-40 hidden gap-0.5 rounded-2xl p-1 lg:flex">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-colors"
              style={{
                background: active ? 'var(--ink)' : 'transparent',
                color: active ? '#fff' : 'var(--ink-soft)',
              }}
            >
              <Icon size={16} strokeWidth={2} /> {t.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
