import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Share2,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Sparkles,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Check,
  Clock,
  HeartPulse,
  Mail,
  XCircle,
  Camera,
  FileDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, UserRole, DailyAttendance, AttendanceStatus, WaliKelasInfo } from '../types';
import { getTodayDateString } from '../data/classData';
import { exportAttendanceToPDF } from '../utils/exportUtils';

interface AttendanceViewProps {
  students: Student[];
  currentRole: UserRole;
  attendance: Record<string, DailyAttendance>;
  onUpdateAttendance: (attendance: Record<string, DailyAttendance>) => void;
  onSelectStudent: (student: Student) => void;
  onOpenAdminAttendance?: () => void;
  waliKelasInfo?: WaliKelasInfo;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  currentRole,
  attendance,
  onUpdateAttendance,
  onSelectStudent,
  onOpenAdminAttendance,
  waliKelasInfo,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AttendanceStatus>('ALL');
  const [copiedWA, setCopiedWA] = useState(false);

  const canEdit = currentRole === 'ADMIN' || currentRole === 'BENDAHARA';

  // Get or initialize current daily record
  const currentDaily = useMemo<DailyAttendance>(() => {
    if (attendance[selectedDate]) {
      return attendance[selectedDate];
    }
    const fallbackRecords: Record<number, AttendanceStatus> = {};
    students.forEach((s) => {
      fallbackRecords[s.id] = 'HADIR';
    });
    return {
      date: selectedDate,
      records: fallbackRecords,
      notes: {},
    };
  }, [attendance, selectedDate, students]);

  // Attendance metrics
  const stats = useMemo(() => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    students.forEach((s) => {
      const st = currentDaily.records[s.id] || 'HADIR';
      if (st === 'HADIR') hadir++;
      else if (st === 'SAKIT') sakit++;
      else if (st === 'IZIN') izin++;
      else if (st === 'ALPA') alpa++;
    });

    const total = students.length;
    const pct = total > 0 ? ((hadir / total) * 100).toFixed(1) : '100';

    return { total, hadir, sakit, izin, alpa, pct };
  }, [students, currentDaily]);

  const handleUpdateStatus = (studentId: number, status: AttendanceStatus) => {
    if (!canEdit) return;
    const updatedRecords = { ...currentDaily.records, [studentId]: status };
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    onUpdateAttendance({
      ...attendance,
      [selectedDate]: {
        ...currentDaily,
        date: selectedDate,
        records: updatedRecords,
        updatedAt: nowTime,
      },
    });
  };

  const handleUpdateNote = (studentId: number, note: string) => {
    if (!canEdit) return;
    const updatedNotes = { ...(currentDaily.notes || {}), [studentId]: note };
    onUpdateAttendance({
      ...attendance,
      [selectedDate]: {
        ...currentDaily,
        date: selectedDate,
        notes: updatedNotes,
      },
    });
  };

  const handleMarkAllPresent = () => {
    if (!canEdit) return;
    const allRecords: Record<number, AttendanceStatus> = {};
    students.forEach((s) => {
      allRecords[s.id] = 'HADIR';
    });
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    onUpdateAttendance({
      ...attendance,
      [selectedDate]: {
        ...currentDaily,
        date: selectedDate,
        records: allRecords,
        updatedAt: nowTime,
      },
    });
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    if (!isNaN(d.getTime())) {
      d.setDate(d.getDate() - 1);
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    if (!isNaN(d.getTime())) {
      d.setDate(d.getDate() + 1);
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  };

  const handleResetToday = () => {
    setSelectedDate(getTodayDateString());
  };

  // Copy WhatsApp report
  const handleCopyWA = () => {
    const hadirList: Student[] = [];
    const sakitList: { student: Student; note?: string }[] = [];
    const izinList: { student: Student; note?: string }[] = [];
    const alpaList: Student[] = [];

    students.forEach((s) => {
      const st = currentDaily.records[s.id] || 'HADIR';
      const note = currentDaily.notes?.[s.id];
      if (st === 'HADIR') hadirList.push(s);
      else if (st === 'SAKIT') sakitList.push({ student: s, note });
      else if (st === 'IZIN') izinList.push({ student: s, note });
      else if (st === 'ALPA') alpaList.push(s);
    });

    const parsedDate = new Date(selectedDate);
    const dateFormatted = !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : selectedDate;

    const report = `*📋 PRESENSI HARIAN KELAS IX-H*
📅 Hari/Tanggal: ${dateFormatted}
👥 Total Siswa: ${students.length} Orang

*RINGKASAN KEHADIRAN:*
✅ Hadir: ${hadirList.length} orang
🩹 Sakit: ${sakitList.length} orang
✉️ Izin: ${izinList.length} orang
❌ Alpa: ${alpaList.length} orang
📊 Tingkat Kehadiran: ${stats.pct}%

${
  sakitList.length > 0
    ? `*RINCIAN SAKIT:*\n` +
      sakitList
        .map((x) => `• #${x.student.id} ${x.student.name} ${x.note ? `[Ket: ${x.note}]` : ''}`)
        .join('\n') +
      '\n\n'
    : ''
}${
      izinList.length > 0
        ? `*RINCIAN IZIN:*\n` +
          izinList
            .map((x) => `• #${x.student.id} ${x.student.name} ${x.note ? `[Ket: ${x.note}]` : ''}`)
            .join('\n') +
          '\n\n'
        : ''
    }${
      alpaList.length > 0
        ? `*RINCIAN ALPA:*\n` +
          alpaList.map((x) => `• #${x.id} ${x.name}`).join('\n') +
          '\n\n'
        : ''
    }Dicatat melalui Sistem Presensi SMP Negeri 1 Bojongsari pada ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB.`;

    navigator.clipboard.writeText(report);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 3000);
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.nickname.toLowerCase().includes(q) ||
        s.id.toString() === q;

      if (!matchSearch) return false;

      const st = currentDaily.records[s.id] || 'HADIR';
      if (statusFilter !== 'ALL' && st !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [students, searchQuery, statusFilter, currentDaily]);

  const formattedDateHeader = useMemo(() => {
    const d = new Date(selectedDate);
    if (isNaN(d.getTime())) return selectedDate;
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [selectedDate]);

  return (
    <div className="space-y-6 pb-28 pt-2 px-4 sm:px-6">
      {/* 1. Header & Date Navigator */}
      <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#1C5FE0]/15 flex items-center justify-center text-[#1C5FE0]">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-xl text-[#1F3A5F]">
                  Presensi &amp; Absensi Harian
                </h2>
                <p className="text-xs text-[#5C6F84]">
                  Kelas IX-H &bull; {formattedDateHeader}
                </p>
              </div>
            </div>
          </div>

          {/* Date Picker & Controls */}
          <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
            <div className="flex items-center gap-1 neu-flat rounded-2xl p-1 bg-[#E7EBF5]">
              <button
                onClick={handlePrevDay}
                className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95"
                title="Hari Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1 bg-transparent font-heading font-bold text-xs text-[#1C5FE0] focus:outline-none cursor-pointer"
              />
              <button
                onClick={handleNextDay}
                className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95"
                title="Hari Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleResetToday}
              className="px-3 py-2 rounded-xl neu-btn font-heading font-semibold text-xs text-[#5C6F84] hover:text-[#1F3A5F] active:scale-95"
            >
              Hari Ini
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#C4CAE0]/50">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C6F84]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              Pencatatan Presensi Kelas
            </span>
            {currentDaily.updatedAt && (
              <span className="text-[11px] text-[#8C9BAE]">
                (Terakhir diupdate: {currentDaily.updatedAt})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {canEdit && (
              <button
                onClick={handleMarkAllPresent}
                className="neu-btn px-3.5 py-1.5 rounded-xl font-heading font-bold text-xs text-[#10B981] hover:bg-[#10B981]/10 transition-colors flex items-center gap-1.5 active:scale-95"
                title="Tandai semua 32 siswa berstatus Hadir"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hadirkan Semua Siswa</span>
              </button>
            )}

            <button
              onClick={handleCopyWA}
              className={`neu-btn px-3.5 py-1.5 rounded-xl font-heading font-bold text-xs transition-colors flex items-center gap-1.5 active:scale-95 ${
                copiedWA ? 'text-[#10B981] bg-[#10B981]/10' : 'text-[#1C5FE0] hover:text-[#1F3A5F]'
              }`}
            >
              {copiedWA ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Salin Rekap WA</span>
                </>
              )}
            </button>

            {/* Ekspor Laporan ke PDF */}
            <button
              onClick={() =>
                exportAttendanceToPDF(
                  students,
                  attendance,
                  selectedDate,
                  'Kelas IX-H',
                  'SMP NEGERI 1 BOJONGSARI',
                  waliKelasInfo?.name,
                  waliKelasInfo?.nip
                )
              }
              className="neu-btn px-3.5 py-1.5 rounded-xl font-heading font-bold text-xs text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 active:scale-95"
              title="Unduh laporan presensi resmi dalam bentuk file PDF"
            >
              <FileDown className="w-4 h-4" />
              <span>Ekspor PDF</span>
            </button>

            {currentRole === 'ADMIN' && onOpenAdminAttendance && (
              <button
                onClick={onOpenAdminAttendance}
                className="neu-btn px-3 py-1.5 rounded-xl font-heading font-semibold text-xs text-[#5C6F84] hover:text-[#1F3A5F] active:scale-95"
              >
                Kelola di Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Attendance Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="neu-flat rounded-2xl p-3 bg-[#E7EBF5] text-center border border-white/70">
          <span className="text-[10px] font-heading font-bold text-[#5C6F84] uppercase tracking-wider block mb-1">
            Total Siswa
          </span>
          <span className="font-heading font-extrabold text-lg text-[#1F3A5F]">
            {stats.total}
          </span>
        </div>

        <div className="neu-flat rounded-2xl p-3 bg-[#E7EBF5] text-center border border-emerald-500/20">
          <span className="text-[10px] font-heading font-bold text-[#10B981] uppercase tracking-wider block mb-1 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Hadir (H)
          </span>
          <span className="font-heading font-extrabold text-lg text-[#10B981]">
            {stats.hadir}
          </span>
        </div>

        <div className="neu-flat rounded-2xl p-3 bg-[#E7EBF5] text-center border border-amber-500/20">
          <span className="text-[10px] font-heading font-bold text-[#F59E0B] uppercase tracking-wider block mb-1 flex items-center justify-center gap-1">
            <HeartPulse className="w-3 h-3" /> Sakit (S)
          </span>
          <span className="font-heading font-extrabold text-lg text-[#F59E0B]">
            {stats.sakit}
          </span>
        </div>

        <div className="neu-flat rounded-2xl p-3 bg-[#E7EBF5] text-center border border-blue-500/20">
          <span className="text-[10px] font-heading font-bold text-[#3B82F6] uppercase tracking-wider block mb-1 flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" /> Izin (I)
          </span>
          <span className="font-heading font-extrabold text-lg text-[#3B82F6]">
            {stats.izin}
          </span>
        </div>

        <div className="neu-flat rounded-2xl p-3 bg-[#E7EBF5] text-center border border-rose-500/20">
          <span className="text-[10px] font-heading font-bold text-[#EF4444] uppercase tracking-wider block mb-1 flex items-center justify-center gap-1">
            <XCircle className="w-3 h-3" /> Alpa (A)
          </span>
          <span className="font-heading font-extrabold text-lg text-[#EF4444]">
            {stats.alpa}
          </span>
        </div>
      </div>

      {/* Kehadiran Progress Bar */}
      <div className="neu-flat rounded-2xl p-3.5 bg-[#E7EBF5] border border-white/60 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs font-heading font-bold mb-1">
            <span className="text-[#1F3A5F]">Tingkat Kehadiran Kelas</span>
            <span className="text-[#1C5FE0]">{stats.pct}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full neu-inset p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1C5FE0] to-[#10B981] transition-all duration-500"
              style={{ width: `${stats.pct}%` }}
            ></div>
          </div>
        </div>
        <div className="text-right text-[11px] text-[#5C6F84]">
          {Number(stats.pct) >= 95 ? (
            <span className="text-[#10B981] font-bold">Luar Biasa Kompak! 🌟</span>
          ) : (
            <span>Target: 100% Kehadiran</span>
          )}
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C9BAE] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau no absen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl neu-inset text-xs font-heading font-medium text-[#1F3A5F] placeholder-[#8C9BAE] focus:outline-none"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['ALL', 'HADIR', 'SAKIT', 'IZIN', 'ALPA'] as const).map((filter) => {
            const isActive = statusFilter === filter;
            const labels: Record<string, string> = {
              ALL: `Semua (${students.length})`,
              HADIR: `Hadir (${stats.hadir})`,
              SAKIT: `Sakit (${stats.sakit})`,
              IZIN: `Izin (${stats.izin})`,
              ALPA: `Alpa (${stats.alpa})`,
            };

            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-sm'
                    : 'neu-btn text-[#5C6F84] hover:text-[#1F3A5F]'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Student Attendance List */}
      <div className="space-y-2.5">
        {filteredStudents.map((s) => {
          const currentStatus = currentDaily.records[s.id] || 'HADIR';
          const currentNote = currentDaily.notes?.[s.id] || '';
          const initials = s.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('');

          const isOfficer = s.role !== 'Anggota';

          return (
            <motion.div
              key={s.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="neu-flat rounded-2xl p-3 sm:p-4 bg-[#E7EBF5] border border-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/40 transition-colors"
            >
              {/* Left: Student identity */}
              <div
                onClick={() => onSelectStudent(s)}
                className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                title="Klik untuk membuka Kartu Pelajar Digital & ubah foto profil"
              >
                {/* Avatar / Photo */}
                <div className="relative w-10 h-10 rounded-xl neu-flat-sm p-0.5 flex-shrink-0">
                  {s.photoUrl ? (
                    <img
                      src={s.photoUrl}
                      alt={s.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-lg flex items-center justify-center font-heading font-extrabold text-xs text-white ${
                        s.gender === 'L'
                          ? 'bg-gradient-to-br from-[#1C5FE0] to-[#1F3A5F]'
                          : 'bg-gradient-to-br from-pink-500 to-rose-600'
                      }`}
                    >
                      {initials}
                    </div>
                  )}

                  {isOfficer && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-white font-bold text-[8px] flex items-center justify-center shadow-xs">
                      &#9733;
                    </span>
                  )}
                </div>

                {/* Name & details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-heading font-extrabold px-1.5 py-0.2 rounded-md bg-[#1C5FE0]/15 text-[#1C5FE0] flex-shrink-0">
                      #{s.id}
                    </span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] truncate group-hover:text-[#1C5FE0] transition-colors">
                      {s.name}
                    </h4>
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#5C6F84] flex items-center gap-1.5 mt-0.5 truncate">
                    <span>"{s.nickname}"</span>
                    {isOfficer && (
                      <>
                        <span>&bull;</span>
                        <span className="text-[#1C5FE0] font-semibold truncate">{s.role}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Attendance Status Buttons & Note Input */}
              <div className="flex flex-col sm:items-end gap-1.5">
                {canEdit ? (
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* H */}
                    <motion.button
                      whileTap={{ scale: 0.86 }}
                      onClick={() => handleUpdateStatus(s.id, 'HADIR')}
                      className={`w-8 h-8 rounded-xl font-heading font-bold text-xs transition-all ${
                        currentStatus === 'HADIR'
                          ? 'bg-[#10B981] text-white shadow-sm scale-105'
                          : 'neu-btn text-[#5C6F84] hover:text-[#10B981]'
                      }`}
                      title="Hadir"
                    >
                      H
                    </motion.button>

                    {/* S */}
                    <motion.button
                      whileTap={{ scale: 0.86 }}
                      onClick={() => handleUpdateStatus(s.id, 'SAKIT')}
                      className={`w-8 h-8 rounded-xl font-heading font-bold text-xs transition-all ${
                        currentStatus === 'SAKIT'
                          ? 'bg-[#F59E0B] text-white shadow-sm scale-105'
                          : 'neu-btn text-[#5C6F84] hover:text-[#F59E0B]'
                      }`}
                      title="Sakit"
                    >
                      S
                    </motion.button>

                    {/* I */}
                    <motion.button
                      whileTap={{ scale: 0.86 }}
                      onClick={() => handleUpdateStatus(s.id, 'IZIN')}
                      className={`w-8 h-8 rounded-xl font-heading font-bold text-xs transition-all ${
                        currentStatus === 'IZIN'
                          ? 'bg-[#3B82F6] text-white shadow-sm scale-105'
                          : 'neu-btn text-[#5C6F84] hover:text-[#3B82F6]'
                      }`}
                      title="Izin"
                    >
                      I
                    </motion.button>

                    {/* A */}
                    <motion.button
                      whileTap={{ scale: 0.86 }}
                      onClick={() => handleUpdateStatus(s.id, 'ALPA')}
                      className={`w-8 h-8 rounded-xl font-heading font-bold text-xs transition-all ${
                        currentStatus === 'ALPA'
                          ? 'bg-[#EF4444] text-white shadow-sm scale-105'
                          : 'neu-btn text-[#5C6F84] hover:text-[#EF4444]'
                      }`}
                      title="Alpa / Tanpa Keterangan"
                    >
                      A
                    </motion.button>
                  </div>
                ) : (
                  // Read only badge for Siswa
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-heading font-extrabold uppercase ${
                        currentStatus === 'HADIR'
                          ? 'bg-[#10B981]/15 text-[#10B981]'
                          : currentStatus === 'SAKIT'
                          ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                          : currentStatus === 'IZIN'
                          ? 'bg-[#3B82F6]/15 text-[#3B82F6]'
                          : 'bg-[#EF4444]/15 text-[#EF4444]'
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>
                )}

                {/* Inline Note for non-present status or if note exists */}
                {(currentStatus !== 'HADIR' || currentNote) && (
                  <div className="w-full sm:w-56">
                    {canEdit ? (
                      <input
                        type="text"
                        placeholder="Catatan (misal: Demam, Lomba, dll)..."
                        value={currentNote}
                        onChange={(e) => handleUpdateNote(s.id, e.target.value)}
                        className="w-full px-2.5 py-1 rounded-lg neu-inset text-[11px] font-medium text-[#1F3A5F] placeholder-[#8C9BAE] focus:outline-none"
                      />
                    ) : (
                      currentNote && (
                        <span className="text-[10px] text-[#5C6F84] italic bg-white/40 px-2 py-0.5 rounded-md inline-block">
                          Ket: {currentNote}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="neu-inset rounded-3xl p-8 text-center text-[#5C6F84]">
            <p className="text-sm font-semibold">Tidak ada data siswa yang cocok.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="mt-2 text-xs font-bold text-[#1C5FE0] underline"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>

      {/* Realtime Firebase notice banner */}
      <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-blue-200/60 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#1C5FE0] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#5C6F84] leading-relaxed">
          <span className="font-heading font-bold text-[#1F3A5F] block mb-0.5">
            Presensi Terintegrasi IX-H
          </span>
          Data presensi tersimpan lokal secara instan dan dirancang siap terhubung secara realtime
          dengan cloud database Firebase Firestore ketika diaktifkan. Klik pada kartu nama siswa mana pun
          untuk melihat Kartu Pelajar Digital dan mengganti foto profil mereka.
        </div>
      </div>
    </div>
  );
};
