import { motion } from 'framer-motion';
import DayChips from '../nav/DayChips';
import TimelinePanel from '../timeline/TimelinePanel';
import BottomSheet from '../sheets/BottomSheet';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { dayOf, useTrip } from '../../store/useTrip';
import { useEffect } from 'react';

export default function DayView() {
  const activeDay = useTrip(s => s.activeDay);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const day = dayOf(activeDay);

  /* 日色主題變數（含漸變） */
  useEffect(() => {
    document.documentElement.style.setProperty('--day-color', day.color);
  }, [day.color]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      {/* 頂部日別切換 */}
      <div className="absolute left-3 right-3 top-3 z-20 lg:right-auto lg:w-[450px]">
        <DayChips />
      </div>

      {desktop ? (
        <motion.div
          className="pointer-events-auto absolute bottom-4 left-4 top-16 w-[450px]"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.1 } }}
        >
          <TimelinePanel key={activeDay} />
        </motion.div>
      ) : (
        <BottomSheet>
          <TimelinePanel key={activeDay} />
        </BottomSheet>
      )}
    </motion.div>
  );
}
