import { motion, type PanInfo } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import { useTrip } from '../../store/useTrip';

export default function BottomSheet({ children }: { children: ReactNode }) {
  const snap = useTrip(s => s.sheetSnap);
  const setSnap = useTrip(s => s.setSheetSnap);
  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 用「高度」而非位移定位 → 抽屜永遠貼齊螢幕底、內容不會被推到畫面外（最後一張卡才不會被 TabBar 擋住）
  const SNAPS = [Math.round(vh * 0.3), Math.round(vh * 0.74), Math.round(vh * 0.95)];
  const height = SNAPS[snap];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dy = info.offset.y + info.velocity.y * 0.15;
    if (dy < -40) setSnap(Math.min(2, snap + 1) as 0 | 1 | 2);
    else if (dy > 40) setSnap(Math.max(0, snap - 1) as 0 | 1 | 2);
  };

  return (
    <motion.div
      className="pointer-events-auto fixed inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.18)]"
      initial={{ height: 0 }}
      animate={{ height }}
      exit={{ height: 0 }}
      transition={{ type: 'spring', damping: 32, stiffness: 340 }}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.18}
        onDragEnd={onDragEnd}
        onTap={() => snap === 0 && setSnap(1)}
        className="flex shrink-0 cursor-grab touch-none items-center justify-center rounded-t-2xl pb-1 pt-2.5 active:cursor-grabbing"
        style={{ background: 'var(--paper)' }}
      >
        <div className="h-1.5 w-10 rounded-full" style={{ background: 'var(--hairline)' }} />
      </motion.div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </motion.div>
  );
}
