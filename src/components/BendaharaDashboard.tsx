import React, { useState, useMemo } from 'react';
import {
  Coins,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Lock,
  Unlock,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { Student, UserRole, CashTransaction } from '../types';
import { CashView } from './CashView';

interface BendaharaDashboardProps {
  students: Student[];
  nominalKas: number;
  transactions: CashTransaction[];
  onUpdateTransactions: (txs: CashTransaction[]) => void;
  onSelectStudent: (student: Student) => void;
  kasPin?: string;
  onSwitchRole?: (role: UserRole) => void;
  isKasUnlocked: boolean;
  onRequestUnlockKas: (onSuccess: () => void) => void;
}

export const BendaharaDashboard: React.FC<BendaharaDashboardProps> = ({
  students,
  nominalKas,
  transactions,
  onUpdateTransactions,
  onSelectStudent,
  kasPin = '5678',
  onSwitchRole,
  isKasUnlocked,
  onRequestUnlockKas,
}) => {
  // Navigation inside Bendahara Dashboard: 'SUMMARY' or 'FULL_CASH'
  const [viewMode, setViewMode] = useState<'SUMMARY' | 'FULL_CASH'>('SUMMARY');

  // Formatted today date in Indonesian
  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const monthName = useMemo(() => {
    return new Date().toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
  }, []);

  // Summary calculations
  const { currentBalance, incomeThisMonth, expenseThisMonth, recentTransactions } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalInc = 0;
    let totalExp = 0;
    let monthInc = 0;
    let monthExp = 0;

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'PEMASUKAN') {
        totalInc += amt;
      } else {
        totalExp += amt;
      }

      // Check month
      const txDate = new Date(tx.date);
      if (!isNaN(txDate.getTime())) {
        if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
          if (tx.type === 'PEMASUKAN') {
            monthInc += amt;
          } else {
            monthExp += amt;
          }
        }
      } else {
        // Fallback
        if (tx.type === 'PEMASUKAN') monthInc += amt;
        else monthExp += amt;
      }
    });

    const sortedTxs = [...transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return {
      currentBalance: totalInc - totalExp,
      incomeThisMonth: monthInc,
      expenseThisMonth: monthExp,
      recentTransactions: sortedTxs.slice(0, 8),
    };
  }, [transactions]);

  const handleOpenFullCash = () => {
    if (isKasUnlocked) {
      setViewMode('FULL_CASH');
    } else {
      onRequestUnlockKas(() => {
        setViewMode('FULL_CASH');
      });
    }
  };

  // If in FULL_CASH mode, render top breadcrumb and CashView
  if (viewMode === 'FULL_CASH') {
    return (
      <div className="space-y-4 pb-12">
        {/* Top Back Nav Bar */}
        <div className="px-4 py-3 bg-[#E7EBF5] border-b border-white/80 neu-flat-sm rounded-2xl flex items-center justify-between gap-3">
          <button
            onClick={() => setViewMode('SUMMARY')}
            className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#1F3A5F] flex items-center gap-1.5 hover:text-[#1C5FE0] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Ringkasan</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#1C5FE0]">
            <Wallet className="w-4 h-4" />
            <span>Kelola Kas Lengkap</span>
          </div>
        </div>

        {/* Existing CashView Component */}
        <CashView
          students={students}
          currentRole="BENDAHARA"
          nominalKas={nominalKas}
          transactions={transactions}
          onUpdateTransactions={onUpdateTransactions}
          onSelectStudent={onSelectStudent}
          onLockKas={() => {
            setViewMode('SUMMARY');
          }}
        />
      </div>
    );
  }

  // Summary Dashboard View
  return (
    <div className="px-3.5 sm:px-6 py-4 space-y-5 max-w-3xl mx-auto pb-16">
      {/* 1. Header Sapaan Bendahara + Tanggal */}
      <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#1C5FE0] px-2 py-0.5 rounded-full bg-[#1C5FE0]/10">
              Role: Bendahara Kelas
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#1F3A5F] tracking-tight">
            Halo, Bendahara! 👋
          </h2>
          <p className="text-xs text-[#5C6F84] font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#1C5FE0]" />
            <span>{formattedToday}</span>
          </p>
        </div>

        {/* Quick Role Switcher shortcut */}
        {onSwitchRole && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onSwitchRole('SISWA')}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#5C6F84] hover:text-[#1C5FE0] flex items-center gap-1.5 active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mode Siswa</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Grid Kartu Ringkasan Keuangan (Saldo, Pemasukan, Pengeluaran) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Saldo Kas Saat Ini */}
        <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-heading font-bold text-[#5C6F84]">
              Saldo Kas Saat Ini
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-heading font-extrabold text-[#1F3A5F] tracking-tight">
            Rp {currentBalance.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-[#5C6F84] mt-1 font-medium">
            Akumulasi bersih kas kelas IX-H
          </p>
        </div>

        {/* Pemasukan Bulan Ini */}
        <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-heading font-bold text-[#5C6F84]">
              Pemasukan ({monthName.split(' ')[0]})
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-heading font-extrabold text-emerald-600 tracking-tight">
            +Rp {incomeThisMonth.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-[#5C6F84] mt-1 font-medium">
            Total kas harian & donasi masuk
          </p>
        </div>

        {/* Pengeluaran Bulan Ini */}
        <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-heading font-bold text-[#5C6F84]">
              Pengeluaran ({monthName.split(' ')[0]})
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-heading font-extrabold text-rose-600 tracking-tight">
            -Rp {expenseThisMonth.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-[#5C6F84] mt-1 font-medium">
            Alat kebersihan, fotokopi, & kegiatan
          </p>
        </div>
      </div>

      {/* 3. Tombol Utama: Kelola Kas Lengkap */}
      <button
        onClick={handleOpenFullCash}
        className="w-full neu-flat-lg rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#2E7BF0] to-[#1C5FE0] text-white flex items-center justify-between gap-4 shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="text-left space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-heading font-extrabold text-white">
                Kelola Kas Lengkap
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                {isKasUnlocked ? (
                  <>
                    <Unlock className="w-3 h-3 text-emerald-300" />
                    <span>Terbuka</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-amber-300" />
                    <span>PIN Kas</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium">
              Catat iuran harian siswa ({students.length} anak), input mutasi, & ekspor ke Excel
            </p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
          <ChevronRight className="w-5 h-5" />
        </div>
      </button>

      {/* 4. Daftar Riwayat Transaksi Terakhir */}
      <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1C5FE0]" />
            <h3 className="font-heading font-bold text-sm text-[#1F3A5F]">
              Riwayat Transaksi Terbaru
            </h3>
          </div>
          <button
            onClick={handleOpenFullCash}
            className="text-xs font-heading font-bold text-[#1C5FE0] hover:underline"
          >
            Lihat Semua ({transactions.length})
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#5C6F84]">
            Belum ada transaksi yang tercatat.
          </div>
        ) : (
          <div className="divide-y divide-[#C4CAE0]/40">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'PEMASUKAN';
              return (
                <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : 'bg-rose-500/15 text-rose-500'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-xs text-[#1F3A5F] truncate">
                        {tx.description || (isIncome ? 'Pemasukan Kas' : 'Pengeluaran Kas')}
                      </p>
                      <p className="text-[10px] text-[#5C6F84] font-medium">
                        {tx.date} &bull; {tx.category || (isIncome ? 'Iuran Siswa' : 'Operasional')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-heading font-extrabold ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}Rp {(Number(tx.amount) || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
