import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { X, Bell, Wallet, Sparkles, BookOpen, Clock } from 'lucide-react';
import { CountdownEvent, PicketGroup, LessonItem, Student, CashTransaction } from '../types';
import { CountdownWidget } from './CountdownWidget';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'jadwal' | 'kas' | 'materi') => void;
  countdownEvents?: CountdownEvent[];
  onOpenAdmin?: () => void;
  picketDuties?: PicketGroup[];
  lessons?: LessonItem[];
  students?: Student[];
  nominalKas?: number;
  transactions?: CashTransaction[];
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  countdownEvents = [],
  onOpenAdmin,
  picketDuties = [],
  lessons = [],
  students = [],
  nominalKas = 1000,
  transactions = [],
}) => {
  if (!isOpen) return null;

  const dynamicNotifications = useMemo(() => {
    const list = [];
    const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const now = new Date();
    const currentDayName = DAYS_ID[now.getDay()];
    const tomorrowDayName = DAYS_ID[(now.getDay() + 1) % 7];
    const nextSchoolDay = tomorrowDayName === 'Minggu' ? 'Senin' : tomorrowDayName;

    // 1. Piket Besok / Hari Ini
    const tomorrowPicket = picketDuties.find(
      (p) => p.day.toLowerCase() === nextSchoolDay.toLowerCase()
    );
    const todayPicket = picketDuties.find(
      (p) => p.day.toLowerCase() === currentDayName.toLowerCase()
    );

    const getStudentNames = (ids: number[]) => {
      return ids
        .map((id) => {
          const s = students.find((st) => st.id === id);
          return s ? s.nickname || s.name.split(' ')[0] : `#${id}`;
        })
        .slice(0, 5)
        .join(', ');
    };

    if (tomorrowPicket && nextSchoolDay !== 'Minggu') {
      const names = getStudentNames(tomorrowPicket.studentIds);
      list.push({
        id: 'picket-tomorrow',
        title: `Pengingat Piket Besok (${nextSchoolDay})`,
        category: 'Piket',
        date: 'Besok',
        desc: `Petugas piket besok: ${names}. Mohon hadir lebih awal sebelum bel masuk untuk merapikan kelas dan papan tulis.`,
        icon: Sparkles,
        color: 'text-amber-500',
        actionTab: 'jadwal' as const,
        actionText: 'Lihat Jadwal Piket',
      });
    } else if (todayPicket) {
      const names = getStudentNames(todayPicket.studentIds);
      list.push({
        id: 'picket-today',
        title: `Tugas Piket Hari Ini (${currentDayName})`,
        category: 'Piket',
        date: 'Hari Ini',
        desc: `Petugas piket hari ini: ${names}. Pastikan kebersihan ruang kelas tetap terjaga.`,
        icon: Sparkles,
        color: 'text-amber-500',
        actionTab: 'jadwal' as const,
        actionText: 'Cek Regu Piket',
      });
    }

    // 2. Kas Status & Reminder
    const totalIn = transactions
      .filter((t) => t.type === 'IN')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalOut = transactions
      .filter((t) => t.type === 'OUT')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const currentBalance = totalIn - totalOut;

    list.push({
      id: 'kas-status',
      title: `Iuran Kas Kelas: Rp ${nominalKas.toLocaleString('id-ID')}/hari`,
      category: 'Keuangan',
      date: 'Pekan Ini',
      desc: `Bendahara Sabrina & Afiqa mengingatkan setoran kas kelas. Saldo kas saat ini: Rp ${currentBalance.toLocaleString('id-ID')}. Pastikan catatan pembayaranmu sudah terdata!`,
      icon: Wallet,
      color: 'text-[#10B981]',
      actionTab: 'kas' as const,
      actionText: 'Buka Catatan Kas',
    });

    // 3. Pelajaran Hari Ini / Besok
    const todayLessons = lessons.filter(
      (l) => l.day.toLowerCase() === currentDayName.toLowerCase()
    );
    if (todayLessons.length > 0) {
      const subjectList = todayLessons.map((l) => l.subject).join(', ');
      list.push({
        id: 'lessons-today',
        title: `Mata Pelajaran Hari Ini (${currentDayName})`,
        category: 'Akademik',
        date: 'Hari Ini',
        desc: `Agenda belajar: ${subjectList}. Siapkan buku catatan dan tugas yang harus dikumpulkan.`,
        icon: BookOpen,
        color: 'text-[#1C5FE0]',
        actionTab: 'jadwal' as const,
        actionText: 'Lihat Jadwal Pelajaran',
      });
    } else {
      const nextLessons = lessons.filter(
        (l) => l.day.toLowerCase() === nextSchoolDay.toLowerCase()
      );
      if (nextLessons.length > 0) {
        const subjectList = nextLessons.map((l) => l.subject).join(', ');
        list.push({
          id: 'lessons-next',
          title: `Mata Pelajaran ${nextSchoolDay}`,
          category: 'Akademik',
          date: 'Mendatang',
          desc: `Jadwal esok hari: ${subjectList}. Persiapkan modul dan materi pelajaran.`,
          icon: BookOpen,
          color: 'text-[#1C5FE0]',
          actionTab: 'jadwal' as const,
          actionText: 'Lihat Jadwal',
        });
      }
    }

    // 4. Countdown Terdekat (jika ada)
    if (countdownEvents && countdownEvents.length > 0) {
      const upcoming = countdownEvents
        .map((ev) => {
          const target = new Date(ev.targetDate).getTime();
          const diffDays = Math.ceil((target - now.getTime()) / (1000 * 60 * 60 * 24));
          return { ...ev, diffDays };
        })
        .filter((ev) => ev.diffDays >= 0)
        .sort((a, b) => a.diffDays - b.diffDays)[0];

      if (upcoming) {
        list.push({
          id: 'countdown-alert',
          title: `${upcoming.title} (${upcoming.diffDays === 0 ? 'Hari Ini!' : `${upcoming.diffDays} Hari Lagi`})`,
          category: 'Agenda',
          date: new Date(upcoming.targetDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          desc: `Target besar kelas: ${upcoming.title}. Tetap semangat dan persiapkan diri semaksimal mungkin!`,
          icon: Clock,
          color: 'text-purple-600',
          actionTab: 'jadwal' as const,
          actionText: 'Lihat Detail',
        });
      }
    }

    return list;
  }, [picketDuties, lessons, students, nominalKas, transactions, countdownEvents]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md neu-flat-lg rounded-3xl p-6 bg-[#E7EBF5] border border-white/80 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center text-[#1C5FE0]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#1F3A5F]">
              Pusat Pemberitahuan
            </h3>
            <p className="text-xs text-[#5C6F84]">
              Pengumuman resmi &amp; target agenda kelas IX-H
            </p>
          </div>
        </div>

        {/* Countdown Timer Widget in Notification Modal */}
        {countdownEvents.length > 0 && (
          <div className="mb-4">
            <CountdownWidget events={countdownEvents} onOpenAdmin={onOpenAdmin} compact={true} />
          </div>
        )}

        {/* List of Notifications */}
        <div className="space-y-3">
          {dynamicNotifications.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.id}
                className="neu-flat-sm rounded-2xl p-4 bg-[#E7EBF5] border border-white/40"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-xl bg-white/60 ${item.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-bold text-xs text-[#1F3A5F]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#5C6F84] whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-[#334D6E] leading-relaxed mb-3 pl-8">
                  {item.desc}
                </p>
                {onNavigateToTab && (
                  <div className="flex justify-end pl-8">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToTab(item.actionTab);
                      }}
                      className="neu-btn px-3 py-1 rounded-xl text-[11px] font-heading font-bold text-[#1C5FE0] active:scale-95"
                    >
                      {item.actionText} &rarr;
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="neu-btn px-6 py-2 rounded-2xl font-heading font-semibold text-xs text-[#1F3A5F] active:scale-95"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
