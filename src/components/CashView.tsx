import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Share2,
  Copy,
  Plus,
  Calendar,
  Search,
  Check,
  RotateCcw,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, UserRole, CashTransaction } from '../types';
import { CLASS_METADATA, INITIAL_TRANSACTIONS, getTodayDateString } from '../data/classData';
import { exportCashToExcel } from '../utils/exportUtils';

interface CashViewProps {
  students: Student[];
  currentRole: UserRole;
  onSelectStudent: (student: Student) => void;
  onLockKas?: () => void;
  nominalKas?: number;
  transactions?: CashTransaction[];
  onUpdateTransactions?: (txs: CashTransaction[]) => void;
}

export const CashView: React.FC<CashViewProps> = ({
  students,
  currentRole,
  onSelectStudent,
  onLockKas,
  nominalKas = 1000,
  transactions: propTransactions,
  onUpdateTransactions,
}) => {
  const [subTab, setSubTab] = useState<'harian' | 'buku'>('harian');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [transactions, setTransactions] = useState<CashTransaction[]>(() => {
    if (propTransactions && propTransactions.length > 0) return propTransactions;
    try {
      const saved = localStorage.getItem('ixh_transactions_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    if (propTransactions) {
      setTransactions(propTransactions);
    }
  }, [propTransactions]);

  useEffect(() => {
    try {
      localStorage.setItem('ixh_transactions_data', JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions]);

  // Cash payment records mapped by date: date -> { studentId: boolean }
  const [cashHistoryByDate, setCashHistoryByDate] = useState<Record<string, Record<number, boolean>>>(() => {
    try {
      const saved = localStorage.getItem('ixh_cash_records_by_date');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default initial for today: first 22 students paid
    const today = getTodayDateString();
    const initialToday: Record<number, boolean> = {};
    students.forEach((s) => {
      initialToday[s.id] = s.id <= 22;
    });
    return { [today]: initialToday };
  });

  // Sync cashHistoryByDate to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ixh_cash_records_by_date', JSON.stringify(cashHistoryByDate));
    } catch {
      // ignore
    }
  }, [cashHistoryByDate]);

  // Current paidMap for the selectedDate
  const paidMap = useMemo(() => {
    return cashHistoryByDate[selectedDate] || {};
  }, [cashHistoryByDate, selectedDate]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaid, setFilterPaid] = useState<'ALL' | 'PAID' | 'UNPAID'>('ALL');
  const [copiedMessage, setCopiedMessage] = useState(false);

  // New Transaction Form State
  const [showAddTx, setShowAddTx] = useState(false);
  const [txType, setTxType] = useState<'PEMASUKAN' | 'PENGELUARAN'>('PENGELUARAN');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('');
  const [txDesc, setTxDesc] = useState('');

  const nominal = nominalKas || 1000; // Rp 1.000 / hari

  // Formatted Indonesian date for selectedDate
  const formattedDate = useMemo(() => {
    const parsed = new Date(selectedDate);
    if (isNaN(parsed.getTime())) return selectedDate;
    return parsed.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [selectedDate]);

  // Calculations
  const paidCount = students.filter((s) => paidMap[s.id]).length;
  const unpaidCount = students.length - paidCount;
  const totalCollectedToday = paidCount * nominal;
  const targetTotal = students.length * nominal;
  const progressPercent = Math.round((paidCount / students.length) * 100);

  const totalIncome = transactions
    .filter((t) => t.type === 'PEMASUKAN')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'PENGELUARAN')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  const toggleStudentPaid = (studentId: number) => {
    if (currentRole === 'SISWA') return;
    const current = cashHistoryByDate[selectedDate] || {};
    const nextState = !current[studentId];
    setCashHistoryByDate((prev) => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        [studentId]: nextState,
      },
    }));
    if (nextState) {
      // Small celebratory burst
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
      });
    }
  };

  const handleMarkAll = (status: boolean) => {
    if (currentRole === 'SISWA') return;
    const updated: Record<number, boolean> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setCashHistoryByDate((prev) => ({
      ...prev,
      [selectedDate]: updated,
    }));
    if (status) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // WhatsApp Summary Generator
  const generateWhatsAppRecap = () => {
    const paidList = students.filter((s) => paidMap[s.id]);
    const unpaidList = students.filter((s) => !paidMap[s.id]);

    let text = `*REKAP KAS HARIAN KELAS IX-H*\n`;
    text += `Hari/Tanggal: ${formattedDate}\n`;
    text += `Tarif Kas: ${formatRupiah(nominal)} / siswa\n`;
    text += `Terkumpul: ${formatRupiah(totalCollectedToday)} / ${formatRupiah(targetTotal)} (${paidCount}/32 Siswa)\n`;
    text += `--------------------------------------\n\n`;

    text += `*SUDAH BAYAR (${paidList.length} Siswa):*\n`;
    paidList.forEach((s, idx) => {
      text += `${idx + 1}. #${s.id} ${s.name} (${s.nickname})\n`;
    });

    text += `\n*BELUM BAYAR (${unpaidList.length} Siswa):*\n`;
    if (unpaidList.length === 0) {
      text += `Alhamdulillah seluruh 32 siswa sudah lunas!\n`;
    } else {
      unpaidList.forEach((s, idx) => {
        text += `${idx + 1}. #${s.id} ${s.name} (${s.nickname})\n`;
      });
      text += `\n_Catatan: Mohon disetorkan kepada Bendahara Sabrina atau Afiqa sebelum istirahat pertama. Terima kasih!_\n`;
    }

    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const handleDepositToLedger = () => {
    if (currentRole === 'SISWA') return;
    if (totalCollectedToday === 0) return;

    const newTx: CashTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'PEMASUKAN',
      amount: totalCollectedToday,
      category: 'Setoran Kas Harian',
      description: `Setoran kas harian tanggal ${new Date().toLocaleDateString('id-ID')} (${paidCount} siswa)`,
      recordedBy: 'Sabrina (Bendahara 1)',
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    if (onUpdateTransactions) {
      onUpdateTransactions(updated);
    }
    setSubTab('buku');
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(txAmount.replace(/\D/g, ''), 10);
    if (!amountNum || !txCategory || !txDesc) return;

    const newTx: CashTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      type: txType,
      amount: amountNum,
      category: txCategory,
      description: txDesc,
      recordedBy: currentRole === 'ADMIN' ? 'Admin Kelas' : 'Bendahara',
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    if (onUpdateTransactions) {
      onUpdateTransactions(updated);
    }
    setShowAddTx(false);
    setTxAmount('');
    setTxCategory('');
    setTxDesc('');
  };

  const filteredStudents = students.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toString() === searchQuery.trim();

    if (!matchesQuery) return false;
    if (filterPaid === 'PAID') return paidMap[s.id];
    if (filterPaid === 'UNPAID') return !paidMap[s.id];
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 pt-2 space-y-5">
      {/* Sub-Tab Navigation & Lock Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="neu-inset rounded-2xl p-1 flex items-center gap-1 border border-white/60 bg-[#E7EBF5]">
          <button
            onClick={() => setSubTab('harian')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-2 ${
              subTab === 'harian'
                ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-md'
                : 'text-[#5C6F84] hover:text-[#1F3A5F]'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Setoran Kas Harian ({paidCount}/32)</span>
          </button>
          <button
            onClick={() => setSubTab('buku')}
            className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center gap-2 ${
              subTab === 'buku'
                ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-md'
                : 'text-[#5C6F84] hover:text-[#1F3A5F]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Buku Kas &amp; Arus Kas</span>
          </button>
        </div>

        {onLockKas && (
          <button
            onClick={onLockKas}
            className="neu-btn px-3.5 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-heading font-bold text-rose-600 hover:text-rose-700 active:scale-95 transition-all shadow-sm self-end sm:self-auto"
            title="Kunci kembali menu Uang Kas dengan PIN"
          >
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            <span>Kunci Kas</span>
          </button>
        )}
      </div>

      {/* VIEW 1: SETORAN KAS HARIAN SISWA */}
      {subTab === 'harian' && (
        <div className="space-y-4">
          {/* Date Selector Header for Kas */}
          <div className="neu-flat rounded-2xl p-3 sm:p-4 bg-[#E7EBF5] border border-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl neu-flat-sm flex items-center justify-center text-[#1C5FE0] bg-white flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#5C6F84] block">
                    Hari &amp; Tanggal Kas
                  </span>
                  <span className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] truncate block">
                    {formattedDate}
                  </span>
                </div>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="neu-inset px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#1C5FE0] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  if (!isNaN(d.getTime())) {
                    d.setDate(d.getDate() - 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }
                }}
                className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-[#5C6F84] hover:text-[#1F3A5F]"
                title="Hari Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedDate(getTodayDateString())}
                className="px-3 py-1.5 rounded-xl neu-btn text-xs font-heading font-bold text-[#1C5FE0]"
              >
                Hari Ini
              </button>

              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  if (!isNaN(d.getTime())) {
                    d.setDate(d.getDate() + 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }
                }}
                className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-[#5C6F84] hover:text-[#1F3A5F]"
                title="Hari Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Kas Card */}
          <div className="neu-flat rounded-3xl p-6 bg-[#E7EBF5] border border-white/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#1C5FE0] block mb-1">
                  Uang Kas Harian Kelas IX-H
                </span>
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1F3A5F]">
                  {formatRupiah(totalCollectedToday)}
                </h3>
                <p className="text-xs text-[#5C6F84] mt-1">
                  Tarif: <strong className="text-[#1F3A5F]">{formatRupiah(nominal)}</strong> per hari &bull; Target harian: {formatRupiah(targetTotal)}
                </p>
              </div>

              {/* Progress Ring / Percentage */}
              <div className="flex items-center gap-3">
                <div className="neu-inset rounded-2xl p-3 text-center min-w-[100px]">
                  <span className="text-[10px] text-[#5C6F84] block">Terkumpul</span>
                  <span className="font-heading font-bold text-lg text-[#10B981]">
                    {progressPercent}%
                  </span>
                </div>
                <div className="neu-flat-sm rounded-2xl p-3 text-center min-w-[100px] bg-[#E7EBF5]">
                  <span className="text-[10px] text-[#5C6F84] block">Belum Kas</span>
                  <span className="font-heading font-bold text-lg text-[#EF4444]">
                    {unpaidCount} Siswa
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="h-3 rounded-full neu-inset overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#2E7BF0] to-[#10B981]"
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#5C6F84] mt-1.5 font-medium">
                <span>{paidCount} Siswa Lunas</span>
                <span>{unpaidCount} Siswa Menunggu</span>
              </div>
            </div>

            {/* Actions for Bendahara & Share */}
            <div className="mt-5 pt-4 border-t border-[#C4CAE0]/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={generateWhatsAppRecap}
                  className="neu-btn px-4 py-2 rounded-2xl text-xs font-heading font-bold text-[#1F3A5F] flex items-center gap-2 active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5 text-[#1C5FE0]" />
                  <span>{copiedMessage ? 'Tersalin ke WA!' : 'Salin Rekap WA'}</span>
                </button>

                {/* Ekspor Excel Button */}
                <button
                  onClick={() =>
                    exportCashToExcel(
                      students,
                      transactions,
                      paidMap,
                      currentBalance,
                      nominal,
                      selectedDate
                    )
                  }
                  className="neu-btn px-4 py-2 rounded-2xl text-xs font-heading font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-1.5 active:scale-95"
                  title="Unduh laporan uang kas dalam format Microsoft Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Ekspor Excel (.xlsx)</span>
                </button>

                {currentRole !== 'SISWA' && (
                  <button
                    onClick={() => handleMarkAll(true)}
                    className="neu-btn px-4 py-2 rounded-2xl text-xs font-heading font-bold text-[#10B981] flex items-center gap-1.5 active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Semua Lunas</span>
                  </button>
                )}
              </div>

              {currentRole !== 'SISWA' && totalCollectedToday > 0 && (
                <button
                  onClick={handleDepositToLedger}
                  className="neu-accent-btn px-4 py-2 rounded-2xl text-xs font-heading font-bold flex items-center gap-1.5 active:scale-95 shadow-md"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Setor ke Buku Kas</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 neu-inset rounded-2xl p-2.5 flex items-center gap-2 border border-white/50">
              <Search className="w-4 h-4 text-[#5C6F84] ml-1.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari siswa untuk ceklis uang kas..."
                className="w-full bg-transparent text-xs sm:text-sm text-[#1F3A5F] focus:outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterPaid('ALL')}
                className={`px-3 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                  filterPaid === 'ALL' ? 'neu-btn-active bg-[#1C5FE0] text-white' : 'neu-btn text-[#1F3A5F]'
                }`}
              >
                Semua ({students.length})
              </button>
              <button
                onClick={() => setFilterPaid('PAID')}
                className={`px-3 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                  filterPaid === 'PAID' ? 'neu-btn-active bg-[#10B981] text-white' : 'neu-btn text-[#10B981]'
                }`}
              >
                Lunas ({paidCount})
              </button>
              <button
                onClick={() => setFilterPaid('UNPAID')}
                className={`px-3 py-2 rounded-xl text-xs font-heading font-bold transition-all ${
                  filterPaid === 'UNPAID' ? 'neu-btn-active bg-[#EF4444] text-white' : 'neu-btn text-[#EF4444]'
                }`}
              >
                Belum ({unpaidCount})
              </button>
            </div>
          </div>

          {/* Student Cash Checklist (32 Siswa) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredStudents.map((student) => {
              const isPaid = !!paidMap[student.id];
              return (
                <motion.div
                  key={student.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className={`neu-flat rounded-2xl p-3.5 flex items-center justify-between gap-3 bg-[#E7EBF5] border border-white/60 transition-colors ${
                    isPaid ? 'border-emerald-200' : ''
                  }`}
                >
                  <div
                    onClick={() => onSelectStudent(student)}
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                  >
                    <div className="w-10 h-10 rounded-2xl neu-flat-sm flex items-center justify-center font-heading font-bold text-xs text-[#1C5FE0] bg-white flex-shrink-0">
                      #{student.id}
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] truncate">
                        {student.name}
                      </div>
                      <div className="text-[10px] text-[#5C6F84]">
                        "{student.nickname}" &bull; {isPaid ? 'Sudah Lunas' : 'Belum Bayar'}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div>
                    {currentRole === 'SISWA' ? (
                      <span
                        className={`text-xs font-heading font-bold px-3 py-1.5 rounded-xl ${
                          isPaid ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                        }`}
                      >
                        {isPaid ? 'Lunas' : 'Belum'}
                      </span>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => toggleStudentPaid(student.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all ${
                          isPaid
                            ? 'bg-[#10B981] text-white shadow-sm'
                            : 'neu-btn text-[#EF4444] hover:bg-[#FEE2E2]'
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Lunas</span>
                          </>
                        ) : (
                          <>
                            <Coins className="w-3.5 h-3.5" />
                            <span>Bayar</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: BUKU KAS KELAS (Ledger) */}
      {subTab === 'buku' && (
        <div className="space-y-4">
          {/* Balance Overview Card */}
          <div className="neu-hero rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 block mb-1">
                  Buku Kas Utama IX-H
                </span>
                <h3 className="font-heading font-extrabold text-3xl">
                  {formatRupiah(currentBalance)}
                </h3>
                <p className="text-xs text-white/85 mt-0.5">
                  Saldo aktif kas yang dikelola Bendahara Sabrina &amp; Afiqa
                </p>
              </div>

              {currentRole !== 'SISWA' && (
                <button
                  onClick={() => setShowAddTx(true)}
                  className="px-4 py-2.5 rounded-2xl bg-white text-[#1C5FE0] font-heading font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 hover:bg-white/95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Catat Kas</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
              <div className="bg-black/15 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-white/75 block">Total Masuk</span>
                  <span className="font-heading font-bold text-sm text-emerald-200">
                    {formatRupiah(totalIncome)}
                  </span>
                </div>
              </div>

              <div className="bg-black/15 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/30 flex items-center justify-center text-rose-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-white/75 block">Total Keluar</span>
                  <span className="font-heading font-bold text-sm text-rose-200">
                    {formatRupiah(totalExpense)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-heading font-bold text-[#1F3A5F]">
                Riwayat Transaksi Terakhir ({transactions.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportCashToExcel(
                      students,
                      transactions,
                      paidMap,
                      currentBalance,
                      nominal,
                      selectedDate
                    )
                  }
                  className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-1.5 active:scale-95"
                  title="Unduh buku kas ke file Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Ekspor Excel</span>
                </button>
                <span className="text-[11px] text-[#5C6F84] hidden sm:inline">
                  Tahun Ajaran 2026/2027
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {transactions.map((tx) => {
                const isIncome = tx.type === 'PEMASUKAN';
                return (
                  <div
                    key={tx.id}
                    className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] flex items-center justify-between gap-3 border border-white/60"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isIncome
                            ? 'bg-emerald-500/15 text-emerald-600'
                            : 'bg-rose-500/15 text-rose-600'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F]">
                          {tx.category}
                        </div>
                        <p className="text-xs text-[#5C6F84] mt-0.5 line-clamp-1">
                          {tx.description}
                        </p>
                        <div className="text-[10px] text-[#8B9BB0] mt-0.5 flex items-center gap-1.5">
                          <span>{tx.date}</span>
                          <span>&bull;</span>
                          <span>{tx.recordedBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`font-heading font-extrabold text-xs sm:text-sm ${
                          isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}
                        {formatRupiah(tx.amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Dialog */}
      {showAddTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A5F]/40 backdrop-blur-sm animate-fadeIn">
          <div className="neu-flat-lg rounded-3xl p-6 bg-[#E7EBF5] max-w-md w-full border border-white/80">
            <h3 className="font-heading font-bold text-base text-[#1F3A5F] mb-4">
              Catat Arus Kas Kelas IX-H
            </h3>

            <form onSubmit={handleCreateTx} className="space-y-4">
              {/* Type Switcher */}
              <div className="neu-inset rounded-2xl p-1 flex items-center">
                <button
                  type="button"
                  onClick={() => setTxType('PENGELUARAN')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-heading font-bold ${
                    txType === 'PENGELUARAN'
                      ? 'bg-[#EF4444] text-white shadow-sm'
                      : 'text-[#5C6F84]'
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('PEMASUKAN')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-heading font-bold ${
                    txType === 'PEMASUKAN'
                      ? 'bg-[#10B981] text-white shadow-sm'
                      : 'text-[#5C6F84]'
                  }`}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[#5C6F84] block mb-1">
                  Nominal (Rp)
                </label>
                <div className="neu-inset rounded-2xl p-2.5">
                  <input
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="Contoh: 45000"
                    required
                    className="w-full bg-transparent text-sm text-[#1F3A5F] focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[#5C6F84] block mb-1">
                  Kategori
                </label>
                <div className="neu-inset rounded-2xl p-2.5">
                  <input
                    type="text"
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    placeholder="Spidol / Alat Kebersihan / Kasus Sosial"
                    required
                    className="w-full bg-transparent text-xs text-[#1F3A5F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-[#5C6F84] block mb-1">
                  Keterangan &amp; Rincian
                </label>
                <div className="neu-inset rounded-2xl p-2.5">
                  <textarea
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder="Catatan keperluan pembelian barang..."
                    rows={2}
                    required
                    className="w-full bg-transparent text-xs text-[#1F3A5F] focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTx(false)}
                  className="neu-btn px-4 py-2 rounded-2xl text-xs font-heading font-bold text-[#5C6F84]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="neu-accent-btn px-6 py-2 rounded-2xl text-xs font-heading font-bold"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
