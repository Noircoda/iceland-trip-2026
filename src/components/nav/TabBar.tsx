import { useTrip, type Tab } from '../../store/useTrip';

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'map', icon: '🗺️', label: '行程' },
  { key: 'list', icon: '✅', label: '清單' },
  { key: 'info', icon: 'ℹ️', label: '資訊' },
];

export default function TabBar() {
  const tab = useTrip(s => s.tab);
  const setTab = useTrip(s => s.setTab);

  return (
    <>
      {/* 手機：底部列 */}
      <nav className="glass fixed inset-x-0 bottom-0 z-40 flex justify-around pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5 lg:hidden">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex w-20 flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-bold transition ${
              tab === t.key ? 'text-sky-600' : 'text-slate-400'
            }`}
          >
            <span className={`text-lg transition-transform duration-200 ${tab === t.key ? 'scale-115' : ''}`}>{t.icon}</span>
            {t.label}
            {tab === t.key && <span className="absolute -top-1.5 h-1 w-7 rounded-full bg-sky-500" />}
          </button>
        ))}
      </nav>
      {/* 桌面：右上浮動 */}
      <nav className="glass fixed right-4 top-4 z-40 hidden gap-1 rounded-2xl p-1 lg:flex">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${
              tab === t.key ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-white/70'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>
    </>
  );
}
