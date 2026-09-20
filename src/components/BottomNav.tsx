import React from 'react';
import {
  Home,
  CalendarCheck,
  Calendar,
  Wallet,
  BookOpen,
  PenTool,
  Gamepad2,
  Image as ImageIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  // Navigation Tabs including Presensi, Jadwal, Kas, Belajar TKA, Materi, Game, Galeri
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'absensi' as NavTab, label: 'Presensi', icon: CalendarCheck, isLive: true },
    { id: 'jadwal' as NavTab, label: 'Jadwal', icon: Calendar },
    { id: 'kas' as NavTab, label: 'Kas', icon: Wallet },
    { id: 'tka' as NavTab, label: 'TKA', icon: PenTool },
    { id: 'materi' as NavTab, label: 'Materi', icon: BookOpen },
    { id: 'game' as NavTab, label: 'Game', icon: Gamepad2 },
    { id: 'galeri' as NavTab, label: 'Galeri', icon: ImageIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-1 sm:px-4 py-1.5 sm:py-2.5 bg-[#E7EBF5] border-t border-white/70 shadow-md">
      <div className="max-w-xl mx-auto neu-flat rounded-3xl p-1 sm:p-1.5 flex items-center justify-between border border-white/80 bg-[#E7EBF5] relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              whileTap={{ scale: 0.92 }}
              className="flex-1 py-1 sm:py-1.5 px-0.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 relative z-10 transition-colors"
              title={tab.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-2xl neu-inset-sm bg-[#E7EBF5] border border-white/70 -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div
                className={`p-1 rounded-xl transition-all relative ${
                  isActive ? 'text-[#1C5FE0] scale-105' : 'text-[#8C9BAE]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-transform" />
                {tab.isLive && !isActive && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                )}
              </div>
              <span
                className={`text-[8.5px] sm:text-[10px] font-heading leading-none truncate max-w-full transition-colors ${
                  isActive ? 'font-bold text-[#1F3A5F]' : 'font-semibold text-[#8C9BAE]'
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

