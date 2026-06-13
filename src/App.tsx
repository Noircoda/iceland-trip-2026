import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import MapCanvas from './components/map/MapCanvas';
import Overview from './components/pages/Overview';
import DayView from './components/pages/DayView';
import Checklists from './components/pages/Checklists';
import Info from './components/pages/Info';
import StopDetail from './components/sheets/StopDetail';
import TabBar from './components/nav/TabBar';
import { useTrip } from './store/useTrip';

function Splash() {
  const mapReady = useTrip(s => s.mapReady);
  return (
    <AnimatePresence>
      {!mapReady && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#0e1620]"
          initial={false}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="splash-icon h-24 w-24 rounded-3xl" />
          <p className="mt-5 text-lg font-semibold tracking-widest text-white">
            冰島環島手冊 <span className="brand-accent font-bold">2026</span>
          </p>
          <div className="mt-4 flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full"
                style={{ background: '#7fa8c9' }}
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.18 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  if (online) return null;
  return (
    <div className="glass-dark pointer-events-none fixed left-1/2 top-2 z-[60] -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-medium text-white">
      離線模式：行程資料可用，地圖僅顯示看過的區域
    </div>
  );
}

export default function App() {
  const view = useTrip(s => s.view);
  const tab = useTrip(s => s.tab);
  const detailStopId = useTrip(s => s.detailStopId);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-200">
      <MapCanvas />
      <AnimatePresence>
        {tab === 'map' && view === 'overview' && <Overview key="overview" />}
        {tab === 'map' && view === 'day' && <DayView key="day" />}
        {tab === 'list' && <Checklists key="list" />}
        {tab === 'info' && <Info key="info" />}
      </AnimatePresence>
      <TabBar />
      <AnimatePresence>{detailStopId && <StopDetail key={detailStopId} stopId={detailStopId} />}</AnimatePresence>
      <OfflineBanner />
      <Splash />
    </div>
  );
}
