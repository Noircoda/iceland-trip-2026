import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import MapCanvas from './components/map/MapCanvas';
import Overview from './components/pages/Overview';
import DayView from './components/pages/DayView';
import Checklists from './components/pages/Checklists';
import Info from './components/pages/Info';
import StopDetail from './components/sheets/StopDetail';
import TabBar from './components/nav/TabBar';
import { useTrip } from './store/useTrip';

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
    <div className="pointer-events-none fixed left-1/2 top-2 z-[60] -translate-x-1/2 rounded-full bg-amber-500/95 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
      📡 離線模式：行程資料可用，地圖僅顯示看過的區域
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
    </div>
  );
}
