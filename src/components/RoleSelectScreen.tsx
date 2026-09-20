import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  ShieldCheck,
  Coins,
  ChevronRight,
  Sparkles,
  Lock,
  UserCheck,
} from 'lucide-react';
import { UserRole } from '../types';

interface RoleSelectScreenProps {
  onSelectRole: (role: UserRole) => void;
  onRequestPinAuth: (role: 'ADMIN' | 'BENDAHARA') => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  onSelectRole,
  onRequestPinAuth,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#E7EBF5] text-[#1F3A5F] p-4 select-none overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute w-72 h-72 rounded-full bg-[#1C5FE0]/15 blur-3xl pointer-events-none -top-10 -right-10" />
      <div className="absolute w-72 h-72 rounded-full bg-[#10B981]/15 blur-3xl pointer-events-none -bottom-10 -left-10" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md space-y-6"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl neu-flat bg-[#E7EBF5] border border-white/80 text-[#1C5FE0] font-heading font-black text-2xl shadow-sm mx-auto mb-1">
            9H
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C5FE0]/10 border border-[#1C5FE0]/20 text-[#1C5FE0] text-xs font-heading font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SMP Negeri 1 Bojongsari</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1F3A5F]">
            Selamat Datang di IX-H Hub
          </h1>
          <p className="text-xs text-[#5C6F84]">
            Pilih peran Anda untuk masuk ke sistem kelas:
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="space-y-3 pt-1">
          {/* 1. SISWA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -2 }}
            onClick={() => onSelectRole('SISWA')}
            className="w-full text-left neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/85 hover:border-[#1C5FE0]/50 transition-all flex items-center justify-between gap-3.5 cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#1F3A5F]">
                    Siswa / Siswi
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Bebas Masuk
                  </span>
                </div>
                <p className="text-[11px] text-[#5C6F84] leading-tight">
                  Akses modul belajar TKA, bank rumus, jadwal piket & materi kelas.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center text-gray-400 group-hover:text-[#1C5FE0] transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>

          {/* 2. BENDAHARA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -2 }}
            onClick={() => onRequestPinAuth('BENDAHARA')}
            className="w-full text-left neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/85 hover:border-emerald-400 transition-all flex items-center justify-between gap-3.5 cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Coins className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#1F3A5F]">
                    Bendahara Kelas
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    PIN Kas
                  </span>
                </div>
                <p className="text-[11px] text-[#5C6F84] leading-tight">
                  Kelola uang kas, input pembayaran harian siswa, dan mutasi saldo.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>

          {/* 3. ADMIN KELAS */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -2 }}
            onClick={() => onRequestPinAuth('ADMIN')}
            className="w-full text-left neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/85 hover:border-amber-400 transition-all flex items-center justify-between gap-3.5 cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#1F3A5F]">
                    Admin Kelas
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    PIN Admin
                  </span>
                </div>
                <p className="text-[11px] text-[#5C6F84] leading-tight">
                  Akses penuh presensi, edit profil siswa, jadwal, dan generator TKA AI.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center text-gray-400 group-hover:text-amber-600 transition-colors shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>

        {/* Footer Info */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-[#5C6F84]">
            Peran dapat diganti kapan saja melalui tab Profil atau tombol di navigasi atas.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
