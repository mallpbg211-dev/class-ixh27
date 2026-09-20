import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  appName?: string;
  subTitle?: string;
  motto?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  appName = 'IX-H Hub',
  subTitle = 'SMP NEGERI 1 BOJONGSARI',
  motto = 'Kompak • Berprestasi • Berkelas',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total splash duration: ~2.4s then trigger fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#E7EBF5] text-[#1F3A5F] overflow-hidden select-none"
        >
          {/* Ambient soft glow background */}
          <div className="absolute w-72 h-72 rounded-full bg-[#1C5FE0]/15 blur-3xl pointer-events-none -top-10 -right-10" />
          <div className="absolute w-72 h-72 rounded-full bg-[#10B981]/15 blur-3xl pointer-events-none -bottom-10 -left-10" />

          {/* Central Emblem & Logo Animation */}
          <div className="relative flex flex-col items-center z-10 px-6 max-w-sm text-center">
            {/* Animated Logo Container with Neumorphic 3D styling */}
            <motion.div
              initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="relative mb-6"
            >
              {/* Pulsing ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: 'easeOut',
                }}
                className="absolute inset-0 rounded-3xl bg-[#1C5FE0]/25 -z-10"
              />

              {/* Logo Emblem */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl neu-flat bg-[#E7EBF5] border-2 border-white/90 flex flex-col items-center justify-center p-2 shadow-2xl relative">
                <div className="flex items-center justify-center gap-0.5">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-[#1C5FE0] tracking-tighter drop-shadow-sm">
                    IX
                  </span>
                  <span className="font-heading font-black text-3xl sm:text-4xl text-[#10B981] tracking-tighter">
                    -H
                  </span>
                </div>
                <span className="text-[10px] font-heading font-bold text-[#5C6F84] tracking-widest uppercase mt-0.5">
                  CLASS HUB
                </span>
                {/* Micro accent */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#1C5FE0] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
            </motion.div>

            {/* Animated App Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1F3A5F] tracking-tight">
                  {appName}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#1C5FE0]/15 text-[#1C5FE0] text-[10px] font-heading font-extrabold uppercase tracking-wider">
                  OFFICIAL
                </span>
              </div>
              <p className="text-xs font-semibold text-[#5C6F84] tracking-widest uppercase">
                {subTitle}
              </p>
            </motion.div>

            {/* Motto */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-3 text-xs text-[#8C9BAE] font-medium"
            >
              {motto}
            </motion.p>

            {/* Bottom Loading Bar Indicator */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mt-8 w-44"
            >
              <div className="h-1.5 w-full bg-[#C4CAE0]/40 rounded-full overflow-hidden p-0.5 neu-inset">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.1,
                    ease: 'easeInOut',
                  }}
                  className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#1C5FE0] to-[#10B981]"
                />
              </div>
              <p className="text-[10px] font-medium text-[#8C9BAE] mt-2 tracking-wide">
                Memuat data kelas...
              </p>
            </motion.div>
          </div>

          {/* Subtle footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-6 flex items-center gap-1.5 text-[11px] text-[#8C9BAE] font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Tahun Ajaran 2026/2027</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
