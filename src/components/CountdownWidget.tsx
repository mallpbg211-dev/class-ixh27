import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, Sparkles, AlertCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CountdownEvent, UserRole } from '../types';

interface CountdownWidgetProps {
  events: CountdownEvent[];
  onOpenAdmin?: () => void;
  compact?: boolean;
  currentRole?: UserRole;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(targetDateStr: string): TimeRemaining {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Animated rolling/flip number block
 */
const RollNumber: React.FC<{ value: number | string; colorClass?: string }> = ({
  value,
  colorClass = 'text-[#1F3A5F]',
}) => {
  return (
    <div className="h-9 sm:h-11 flex items-center justify-center overflow-hidden relative">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={String(value)}
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 18, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl ${colorClass} inline-block leading-none`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({
  events,
  onOpenAdmin,
  compact = false,
  currentRole,
}) => {
  const activeEvents = events.filter((e) => e.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [time, setTime] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  const currentEvent = activeEvents[currentIndex] || activeEvents[0];

  useEffect(() => {
    if (!currentEvent) return;

    setTime(calculateTimeLeft(currentEvent.targetDate));
    const timer = setInterval(() => {
      setTime(calculateTimeLeft(currentEvent.targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEvent]);

  if (!currentEvent) {
    return null;
  }

  const targetDateFormatted = new Date(currentEvent.targetDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (compact) {
    return (
      <div className="neu-flat rounded-2xl p-4 bg-gradient-to-br from-[#1F3A5F] to-[#1C5FE0] text-white relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-heading font-extrabold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Hitung Mundur Target Kelas</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
            {currentEvent.category || 'Target'}
          </span>
        </div>

        <h4 className="font-heading font-bold text-sm text-white truncate mb-1">
          {currentEvent.title}
        </h4>
        <p className="text-[11px] text-blue-100 mb-3 truncate">
          {targetDateFormatted}
        </p>

        {/* 4 Block Countdown */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-black/35 rounded-xl p-1.5 border border-white/15">
            <div className="font-heading font-extrabold text-base sm:text-lg text-white">
              {time.days}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-blue-200 font-bold">
              Hari
            </div>
          </div>
          <div className="bg-black/35 rounded-xl p-1.5 border border-white/15">
            <div className="font-heading font-extrabold text-base sm:text-lg text-white">
              {String(time.hours).padStart(2, '0')}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-blue-200 font-bold">
              Jam
            </div>
          </div>
          <div className="bg-black/35 rounded-xl p-1.5 border border-white/15">
            <div className="font-heading font-extrabold text-base sm:text-lg text-white">
              {String(time.minutes).padStart(2, '0')}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-blue-200 font-bold">
              Menit
            </div>
          </div>
          <div className="bg-black/35 rounded-xl p-1.5 border border-white/15">
            <div className="font-heading font-extrabold text-base sm:text-lg text-amber-300">
              {String(time.seconds).padStart(2, '0')}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-blue-200 font-bold">
              Detik
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4">
      <div className="max-w-4xl mx-auto neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/80 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1C5FE0] to-[#1F3A5F] flex items-center justify-center text-amber-300 shadow-md flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1C5FE0]/15 text-[#1C5FE0]">
                  {currentEvent.category || 'Target Kelas'}
                </span>
                <span className="text-xs text-[#5C6F84] font-semibold">
                  SMP Negeri 1 Bojongsari
                </span>
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#1F3A5F] mt-0.5 truncate">
                {currentEvent.title}
              </h3>
            </div>
          </div>

          {/* Multiple active events pills selector */}
          {activeEvents.length > 1 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeEvents.map((evt, idx) => (
                <button
                  key={evt.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-2.5 py-1 rounded-full text-xs font-heading font-bold transition-all ${
                    idx === currentIndex
                      ? 'bg-[#1C5FE0] text-white shadow-sm'
                      : 'neu-btn text-[#5C6F84] hover:text-[#1F3A5F]'
                  }`}
                >
                  {evt.title.length > 18 ? `${evt.title.slice(0, 16)}...` : evt.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentEvent.description && (
          <p className="text-xs text-[#5C6F84] mb-4 leading-relaxed">
            {currentEvent.description}
          </p>
        )}

        {/* Big Neumorphic Timer Display with Rolling Number Animation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="neu-inset rounded-2xl p-3 sm:p-4 text-center border border-white/60">
            <span className="text-[11px] font-heading font-bold text-[#5C6F84] uppercase tracking-wider block mb-1">
              Hari Lagi
            </span>
            <RollNumber value={time.days} colorClass="text-[#1F3A5F]" />
          </div>

          <div className="neu-inset rounded-2xl p-3 sm:p-4 text-center border border-white/60">
            <span className="text-[11px] font-heading font-bold text-[#5C6F84] uppercase tracking-wider block mb-1">
              Jam
            </span>
            <RollNumber value={String(time.hours).padStart(2, '0')} colorClass="text-[#1C5FE0]" />
          </div>

          <div className="neu-inset rounded-2xl p-3 sm:p-4 text-center border border-white/60">
            <span className="text-[11px] font-heading font-bold text-[#5C6F84] uppercase tracking-wider block mb-1">
              Menit
            </span>
            <RollNumber value={String(time.minutes).padStart(2, '0')} colorClass="text-[#10B981]" />
          </div>

          <div className="neu-inset rounded-2xl p-3 sm:p-4 text-center border border-white/60">
            <span className="text-[11px] font-heading font-bold text-[#5C6F84] uppercase tracking-wider block mb-1">
              Detik
            </span>
            <RollNumber value={String(time.seconds).padStart(2, '0')} colorClass="text-[#EF4444]" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#C4CAE0]/50 flex items-center justify-between text-xs text-[#5C6F84]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#1C5FE0]" />
            <span>Target: <strong>{targetDateFormatted}</strong></span>
          </div>

          {currentRole === 'ADMIN' && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[#1C5FE0] font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <span>Atur Target di Admin</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
