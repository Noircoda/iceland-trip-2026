import { create } from 'zustand';
import { DAYS, TRIP_START, TRIP_END } from '../data/itinerary';

export type View = 'overview' | 'day';
export type Tab = 'map' | 'list' | 'info';
export type SelectSource = 'marker' | 'card' | 'scroll' | 'auto';

interface TripState {
  view: View;
  tab: Tab;
  activeDay: number;
  activeStopId: string | null;
  selectSource: SelectSource;
  detailStopId: string | null;
  introDone: boolean;
  sheetSnap: 0 | 1 | 2; // 手機抽屜：0 窺視 / 1 半開 / 2 全開
  setTab: (tab: Tab) => void;
  enterDay: (day: number) => void;
  backToOverview: () => void;
  selectStop: (id: string | null, source?: SelectSource) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  finishIntro: () => void;
  setSheetSnap: (s: 0 | 1 | 2) => void;
}

/** 旅行期間自動跳到當天 */
function initialDayView(): { view: View; activeDay: number } {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  if (iso >= TRIP_START && iso <= TRIP_END) {
    const d = DAYS.find(d => d.date === iso);
    if (d) return { view: 'day', activeDay: d.day };
  }
  return { view: 'overview', activeDay: 1 };
}

const init = initialDayView();

export const useTrip = create<TripState>(set => ({
  view: init.view,
  tab: 'map',
  activeDay: init.activeDay,
  activeStopId: null,
  selectSource: 'auto',
  detailStopId: null,
  introDone: init.view === 'day', // 旅行中開 app 直接進當天，跳過開場
  sheetSnap: 1,
  setTab: tab => set({ tab }),
  enterDay: day => set({ view: 'day', activeDay: day, activeStopId: null, detailStopId: null, introDone: true, sheetSnap: 1 }),
  backToOverview: () => set({ view: 'overview', activeStopId: null, detailStopId: null }),
  selectStop: (id, source = 'card') => set({ activeStopId: id, selectSource: source }),
  openDetail: id => set({ detailStopId: id, activeStopId: id }),
  closeDetail: () => set({ detailStopId: null }),
  finishIntro: () => set({ introDone: true }),
  setSheetSnap: s => set({ sheetSnap: s }),
}));

export function dayOf(dayNum: number) {
  return DAYS.find(d => d.day === dayNum)!;
}

export function stopById(id: string) {
  for (const d of DAYS) {
    const s = d.stops.find(s => s.id === id);
    if (s) return { day: d, stop: s };
  }
  return null;
}
