import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  Users,
  Calendar,
  Sparkles,
  Coins,
  Settings,
  FileText,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Download,
  Copy,
  RotateCcw,
  Search,
  Lock,
  UserPlus,
  Clock,
  MapPin,
  CalendarCheck,
  ListTodo,
  Share2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ExternalLink,
  History,
  Upload,
  FileSpreadsheet,
  Camera,
  GraduationCap,
  LayoutDashboard,
  ArrowLeft,
  TrendingUp,
  Unlock,
  UserCheck,
  Wallet,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { fireConfetti } from '../utils/confettiHelper';
import { savePdfDoc, saveExcelWorkbook, downloadOrShareBlob } from '../utils/fileDownloader';
import { AdminTkaManagerView } from './tka/AdminTkaManagerView';
import { loadAllQuestions } from './tka/tkaStorage';
import {
  Student,
  Gender,
  LessonItem,
  CashTransaction,
  PicketGroup,
  DailyAttendance,
  AttendanceStatus,
  StudyMaterial,
  ClassConfig,
  CountdownEvent,
  UserRole,
} from '../types';
import {
  CLASS_METADATA,
  LESSON_SCHEDULES,
  PICKET_DUTIES,
  DEFAULT_WALI_KELAS,
  getTodayDateString,
} from '../data/classData';
import { PRESET_WALI_AVATARS } from './EditWaliPhotoModal';
import {
  saveClassSettings,
  saveStudentData,
  deleteStudentData,
  restoreFullBackupToFirestore,
} from '../lib/firebase';

export type AdminTab =
  | 'SISWA'
  | 'ABSENSI'
  | 'JADWAL'
  | 'PIKET'
  | 'KAS'
  | 'MATERI'
  | 'SOAL_TKA'
  | 'PENGATURAN'
  | 'LAPORAN'
  | 'LOG';

export type AdminSection = 'OVERVIEW' | AdminTab;

export interface AdminActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  category: 'SISWA' | 'ABSENSI' | 'JADWAL' | 'PIKET' | 'KAS' | 'PENGATURAN' | 'MATERI';
}

export interface AdminDashboardProps {
  isOpen?: boolean;
  onClose?: () => void;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  nominalKas: number;
  onUpdateNominalKas: (nominal: number) => void;
  transactions: CashTransaction[];
  onUpdateTransactions: (txs: CashTransaction[]) => void;
  lessons: LessonItem[];
  onUpdateLessons: (lessons: LessonItem[]) => void;
  picketDuties: PicketGroup[];
  onUpdatePicketDuties: (picket: PicketGroup[]) => void;
  attendance: Record<string, DailyAttendance>;
  onUpdateAttendance: (attendance: Record<string, DailyAttendance>) => void;
  materials?: StudyMaterial[];
  onUpdateMaterials?: (materials: StudyMaterial[]) => void;
  initialTab?: AdminSection;
  onRoleElevate?: () => void;
  isAuthenticatedInitial?: boolean;
  classConfig?: ClassConfig;
  onUpdateClassConfig?: (config: ClassConfig) => void;
  countdownEvents?: CountdownEvent[];
  onUpdateCountdownEvents?: (events: CountdownEvent[]) => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen = true,
  onClose,
  students,
  onUpdateStudents,
  nominalKas,
  onUpdateNominalKas,
  transactions,
  onUpdateTransactions,
  lessons,
  onUpdateLessons,
  picketDuties,
  onUpdatePicketDuties,
  attendance,
  onUpdateAttendance,
  materials = [],
  onUpdateMaterials,
  initialTab = 'OVERVIEW',
  onRoleElevate,
  isAuthenticatedInitial = false,
  classConfig,
  onUpdateClassConfig,
  countdownEvents,
  onUpdateCountdownEvents,
  onSwitchRole,
}) => {
  // Navigation State: 'OVERVIEW' or one of the 10 AdminTab sections
  const [activeTab, setActiveTab] = useState<AdminSection>(initialTab || 'OVERVIEW');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Sensitive PIN lock state (KAS, PENGATURAN, LOG, LAPORAN)
  const [isSensitiveUnlocked, setIsSensitiveUnlocked] = useState(isAuthenticatedInitial);
  const [sensitivePinModal, setSensitivePinModal] = useState<{
    isOpen: boolean;
    targetSection: AdminTab | null;
  }>({ isOpen: false, targetSection: null });
  const [sensitivePinInput, setSensitivePinInput] = useState('');
  const [sensitivePinError, setSensitivePinError] = useState('');

  const SENSITIVE_SECTIONS: AdminTab[] = ['KAS', 'PENGATURAN', 'LOG', 'LAPORAN'];

  const handleSelectSection = (section: AdminSection) => {
    if (section === 'OVERVIEW') {
      setActiveTab('OVERVIEW');
      return;
    }
    if (SENSITIVE_SECTIONS.includes(section) && !isSensitiveUnlocked) {
      setSensitivePinModal({ isOpen: true, targetSection: section });
      setSensitivePinInput('');
      setSensitivePinError('');
      return;
    }
    setActiveTab(section);
  };

  const handleVerifySensitivePin = () => {
    const currentAdminPin = classConfig?.adminPin || '9090';
    if (sensitivePinInput === currentAdminPin) {
      setIsSensitiveUnlocked(true);
      setSensitivePinError('');
      const target = sensitivePinModal.targetSection;
      setSensitivePinModal({ isOpen: false, targetSection: null });
      if (target) {
        setActiveTab(target);
      }
      if (onRoleElevate) {
        onRoleElevate();
      }
    } else {
      setSensitivePinError('PIN Master Admin salah. Silakan coba lagi.');
    }
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (isAuthenticatedInitial) {
      setIsSensitiveUnlocked(true);
    }
  }, [isAuthenticatedInitial]);

  // Notifications
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const showSuccessNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('ixh_admin_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'init-1',
        timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        action: 'Sistem Terhubung',
        actor: 'Admin Kelas',
        details: 'Log aktivitas admin siap mencatat setiap perubahan data kelas.',
        category: 'PENGATURAN',
      },
    ];
  });

  const [logFilterCategory, setLogFilterCategory] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');

  const logActivity = (
    action: string,
    details: string,
    category: AdminActivityLog['category']
  ) => {
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      action,
      actor: 'Master Admin',
      details,
      category,
    };
    setActivityLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 99)];
      try {
        localStorage.setItem('ixh_admin_activity_logs', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const currentBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      const amount = Number(tx.amount) || 0;
      return tx.type === 'PEMASUKAN' ? acc + amount : acc - amount;
    }, 0);
  }, [transactions]);

  // ==========================================
  // TAB 1: SISWA STATE
  // ==========================================
  const [studentSearch, setStudentSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState<Partial<Student>>({
    id: students.length + 1,
    name: '',
    nickname: '',
    gender: 'L',
    role: 'Anggota',
    pin: '1234',
    dreamSchool: 'SMAN 1',
    bio: '',
  });

  // ==========================================
  // TAB 2: ABSENSI STATE
  // ==========================================
  const [attendanceDate, setAttendanceDate] = useState<string>(getTodayDateString());
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | AttendanceStatus>('ALL');
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [copiedAttendanceWA, setCopiedAttendanceWA] = useState(false);

  // Get or initialize daily attendance for attendanceDate
  const currentDailyAttendance = useMemo<DailyAttendance>(() => {
    if (attendance[attendanceDate]) {
      return attendance[attendanceDate];
    }
    const fallbackRecords: Record<number, AttendanceStatus> = {};
    students.forEach((s) => {
      fallbackRecords[s.id] = 'HADIR';
    });
    return {
      date: attendanceDate,
      records: fallbackRecords,
      notes: {},
    };
  }, [attendance, attendanceDate, students]);

  // Attendance stats for selected date
  const attendanceStats = useMemo(() => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;
    let terlambat = 0;

    students.forEach((s) => {
      const st = currentDailyAttendance.records[s.id] || 'HADIR';
      if (st === 'HADIR') hadir++;
      else if (st === 'SAKIT') sakit++;
      else if (st === 'IZIN') izin++;
      else if (st === 'ALPA') alpa++;
      else if (st === 'TERLAMBAT') terlambat++;
    });

    const total = students.length;
    const percentage = total > 0 ? (((hadir + terlambat) / total) * 100).toFixed(1) : '100';

    return { total, hadir, sakit, izin, alpa, terlambat, percentage };
  }, [students, currentDailyAttendance]);

  const handleSetStudentAttendance = (studentId: number, status: AttendanceStatus) => {
    const updatedRecords = { ...currentDailyAttendance.records, [studentId]: status };
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    onUpdateAttendance({
      ...attendance,
      [attendanceDate]: {
        ...currentDailyAttendance,
        date: attendanceDate,
        records: updatedRecords,
        updatedAt: nowTime,
      },
    });
  };

  const handleSetStudentNote = (studentId: number, note: string) => {
    const updatedNotes = { ...(currentDailyAttendance.notes || {}), [studentId]: note };
    onUpdateAttendance({
      ...attendance,
      [attendanceDate]: {
        ...currentDailyAttendance,
        date: attendanceDate,
        notes: updatedNotes,
      },
    });
  };

  const handleMarkAllPresent = () => {
    const allRecords: Record<number, AttendanceStatus> = {};
    students.forEach((s) => {
      allRecords[s.id] = 'HADIR';
    });
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    onUpdateAttendance({
      ...attendance,
      [attendanceDate]: {
        ...currentDailyAttendance,
        date: attendanceDate,
        records: allRecords,
        updatedAt: nowTime,
      },
    });
    fireConfetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    showSuccessNotification(`Semua ${students.length} siswa ditandai HADIR pada tanggal ini!`);
  };

  const generateAttendanceWAReport = (): string => {
    const hadirList: Student[] = [];
    const sakitList: { student: Student; note?: string }[] = [];
    const izinList: { student: Student; note?: string }[] = [];
    const alpaList: Student[] = [];
    const terlambatList: { student: Student; note?: string }[] = [];

    students.forEach((s) => {
      const st = currentDailyAttendance.records[s.id] || 'HADIR';
      const note = currentDailyAttendance.notes?.[s.id];
      if (st === 'HADIR') hadirList.push(s);
      else if (st === 'SAKIT') sakitList.push({ student: s, note });
      else if (st === 'IZIN') izinList.push({ student: s, note });
      else if (st === 'ALPA') alpaList.push(s);
      else if (st === 'TERLAMBAT') terlambatList.push({ student: s, note });
    });

    const parsedDate = new Date(attendanceDate);
    const dateFormatted = !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : attendanceDate;

    return `*📋 REKAP PRESENSI HARIAN KELAS IX-H*
*SMP NEGERI 1*
📅 Hari/Tanggal: ${dateFormatted}
👩‍🏫 Wali Kelas: ${classInfo.waliKelas}

*RINGKASAN KEHADIRAN:*
👥 Total Siswa: ${students.length} Siswa
✅ Hadir: ${hadirList.length} orang
🩹 Sakit: ${sakitList.length} orang
✉️ Izin: ${izinList.length} orang
❌ Alpa: ${alpaList.length} orang
⏰ Terlambat: ${terlambatList.length} orang
📊 Persentase: ${attendanceStats.percentage}%

${
  sakitList.length > 0
    ? `*RINCIAN SAKIT (${sakitList.length}):*\n` +
      sakitList
        .map((x) => `• #${x.student.id} ${x.student.name} ${x.note ? `[${x.note}]` : ''}`)
        .join('\n') +
      '\n\n'
    : ''
}${
      izinList.length > 0
        ? `*RINCIAN IZIN (${izinList.length}):*\n` +
          izinList
            .map((x) => `• #${x.student.id} ${x.student.name} ${x.note ? `[${x.note}]` : ''}`)
            .join('\n') +
          '\n\n'
        : ''
    }${
      alpaList.length > 0
        ? `*RINCIAN ALPA (${alpaList.length}):*\n` +
          alpaList.map((x) => `• #${x.id} ${x.name}`).join('\n') +
          '\n\n'
        : ''
    }${
      terlambatList.length > 0
        ? `*RINCIAN TERLAMBAT (${terlambatList.length}):*\n` +
          terlambatList
            .map((x) => `• #${x.student.id} ${x.student.name} ${x.note ? `[${x.note}]` : ''}`)
            .join('\n') +
          '\n\n'
        : ''
    }Dicatat melalui IX-H Hub - Presensi Digital Kelas`;
  };

  const handleCopyAttendanceWA = () => {
    const text = generateAttendanceWAReport();
    navigator.clipboard.writeText(text);
    setCopiedAttendanceWA(true);
    fireConfetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedAttendanceWA(false), 3000);
    showSuccessNotification('Rekap presensi berhasil disalin ke clipboard!');
  };

  // ==========================================
  // TAB 3: JADWAL PELAJARAN STATE & ACTIONS
  // ==========================================
  const days = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const [scheduleDayFilter, setScheduleDayFilter] = useState<string>('Semua');
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [editingLessonIdx, setEditingLessonIdx] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonItem>({
    day: 'Senin',
    time: '07:30 - 09:00',
    subject: '',
    teacher: '',
    room: 'Ruang IX-H',
  });

  const handleOpenAddLesson = () => {
    setLessonForm({
      day: scheduleDayFilter === 'Semua' ? 'Senin' : scheduleDayFilter,
      time: '07:30 - 09:00',
      subject: '',
      teacher: '',
      room: 'Ruang IX-H',
    });
    setIsAddingLesson(true);
    setEditingLessonIdx(null);
  };

  const handleOpenEditLesson = (index: number) => {
    setEditingLessonIdx(index);
    setLessonForm({ ...lessons[index] });
    setIsAddingLesson(false);
  };

  const handleSaveLesson = () => {
    if (!lessonForm.subject.trim()) {
      alert('Nama mata pelajaran wajib diisi.');
      return;
    }
    if (!lessonForm.time.trim()) {
      alert('Jam pelajaran wajib diisi.');
      return;
    }

    if (editingLessonIdx !== null) {
      // Edit existing
      const updated = [...lessons];
      updated[editingLessonIdx] = { ...lessonForm };
      onUpdateLessons(updated);
      logActivity(
        'Ubah Jadwal Pelajaran',
        `Memperbarui mata pelajaran ${lessonForm.subject} (${lessonForm.day}, ${lessonForm.time})`,
        'JADWAL'
      );
      setEditingLessonIdx(null);
      showSuccessNotification('Jadwal pelajaran berhasil diperbarui!');
    } else {
      // Add new
      onUpdateLessons([...lessons, { ...lessonForm }]);
      logActivity(
        'Tambah Jadwal Pelajaran',
        `Menambahkan jadwal ${lessonForm.subject} (${lessonForm.day}, ${lessonForm.time})`,
        'JADWAL'
      );
      setIsAddingLesson(false);
      showSuccessNotification(`Mata pelajaran ${lessonForm.subject} berhasil ditambahkan!`);
    }
  };

  const handleDeleteLesson = (index: number) => {
    const target = lessons[index];
    if (confirm(`Hapus jadwal ${target.subject} hari ${target.day} (${target.time})?`)) {
      const updated = lessons.filter((_, idx) => idx !== index);
      onUpdateLessons(updated);
      logActivity(
        'Hapus Jadwal Pelajaran',
        `Menghapus jadwal ${target.subject} (${target.day})`,
        'JADWAL'
      );
      showSuccessNotification('Jadwal pelajaran dihapus.');
    }
  };

  const handleResetLessons = () => {
    if (confirm('Kembalikan jadwal pelajaran ke jadwal bawaan sekolah?')) {
      onUpdateLessons(LESSON_SCHEDULES);
      showSuccessNotification('Jadwal pelajaran direset ke bawaan.');
    }
  };

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    if (scheduleDayFilter === 'Semua') return lessons;
    return lessons.filter((l) => l.day === scheduleDayFilter);
  }, [lessons, scheduleDayFilter]);

  // ==========================================
  // TAB 4: PIKET KEBERSIHAN STATE & ACTIONS
  // ==========================================
  const picketDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const [selectedPicketDay, setSelectedPicketDay] = useState<string>('Senin');
  const [newPicketStudentId, setNewPicketStudentId] = useState<number | ''>('');
  const [newTaskText, setNewTaskText] = useState('');

  const currentPicketGroup = useMemo(() => {
    return (
      picketDuties.find((p) => p.day === selectedPicketDay) || {
        day: selectedPicketDay,
        studentIds: [],
        tasks: [],
      }
    );
  }, [picketDuties, selectedPicketDay]);

  const handleAddStudentToPicket = () => {
    if (!newPicketStudentId) return;
    const id = Number(newPicketStudentId);
    if (currentPicketGroup.studentIds.includes(id)) {
      alert('Siswa ini sudah ada dalam kelompok piket hari ini.');
      return;
    }

    const updatedDuties = picketDuties.map((p) => {
      if (p.day === selectedPicketDay) {
        return { ...p, studentIds: [...p.studentIds, id] };
      }
      return p;
    });

    onUpdatePicketDuties(updatedDuties);
    logActivity('Ubah Regu Piket', `Menambahkan siswa #${id} ke regu piket hari ${selectedPicketDay}`, 'PIKET');
    setNewPicketStudentId('');
    showSuccessNotification('Siswa berhasil ditambahkan ke petugas piket!');
  };

  const handleRemoveStudentFromPicket = (id: number) => {
    const updatedDuties = picketDuties.map((p) => {
      if (p.day === selectedPicketDay) {
        return { ...p, studentIds: p.studentIds.filter((sid) => sid !== id) };
      }
      return p;
    });
    onUpdatePicketDuties(updatedDuties);
    logActivity('Ubah Regu Piket', `Menghapus siswa #${id} dari regu piket hari ${selectedPicketDay}`, 'PIKET');
    showSuccessNotification('Siswa dikeluarkan dari giliran piket.');
  };

  const handleAddTaskToPicket = () => {
    if (!newTaskText.trim()) return;
    const updatedDuties = picketDuties.map((p) => {
      if (p.day === selectedPicketDay) {
        return { ...p, tasks: [...p.tasks, newTaskText.trim()] };
      }
      return p;
    });
    onUpdatePicketDuties(updatedDuties);
    setNewTaskText('');
    showSuccessNotification('Tugas piket baru ditambahkan!');
  };

  const handleDeleteTaskFromPicket = (taskIndex: number) => {
    const updatedDuties = picketDuties.map((p) => {
      if (p.day === selectedPicketDay) {
        return { ...p, tasks: p.tasks.filter((_, idx) => idx !== taskIndex) };
      }
      return p;
    });
    onUpdatePicketDuties(updatedDuties);
    showSuccessNotification('Tugas piket dihapus.');
  };

  const handleResetPicketDuties = () => {
    if (confirm('Kembalikan jadwal piket ke daftar default?')) {
      onUpdatePicketDuties(PICKET_DUTIES);
      showSuccessNotification('Jadwal piket direset ke bawaan.');
    }
  };

  // Students not currently in today's picket
  const studentsAvailableForPicket = useMemo(() => {
    return students.filter((s) => !currentPicketGroup.studentIds.includes(s.id));
  }, [students, currentPicketGroup]);

  // ==========================================
  // TAB 5: KAS & KEUANGAN STATE & ACTIONS
  // ==========================================
  const [newTxType, setNewTxType] = useState<'PEMASUKAN' | 'PENGELUARAN'>('PEMASUKAN');
  const [newTxAmount, setNewTxAmount] = useState('50000');
  const [newTxDesc, setNewTxDesc] = useState('');
  const [newTxCategory, setNewTxCategory] = useState('Iuran Kas Mingguan');

  const handleCreateTransaction = () => {
    const amt = Number(newTxAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Nominal harus lebih dari 0.');
      return;
    }
    if (!newTxDesc.trim()) {
      alert('Deskripsi transaksi wajib diisi.');
      return;
    }

    const newTx: CashTransaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: getTodayDateString(),
      type: newTxType,
      amount: amt,
      category: newTxCategory || 'Operasional',
      description: newTxDesc,
      recordedBy: 'Admin Kelas',
    };

    onUpdateTransactions([newTx, ...transactions]);
    logActivity(
      'Tambah Transaksi Kas',
      `${newTx.type === 'PEMASUKAN' ? 'Pemasukan' : 'Pengeluaran'} Rp ${amt.toLocaleString('id-ID')} (${newTxDesc})`,
      'KAS'
    );
    setNewTxDesc('');
    setNewTxAmount('50000');
    showSuccessNotification('Transaksi berhasil dicatat ke pembukuan kas!');
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Hapus catatan transaksi ini dari pembukuan?')) {
      onUpdateTransactions(transactions.filter((tx) => tx.id !== id));
      logActivity('Hapus Transaksi Kas', `Menghapus catatan transaksi #${id}`, 'KAS');
      showSuccessNotification('Transaksi dihapus.');
    }
  };

  // ==========================================
  // TAB 6: PENGATURAN IDENTITAS
  // ==========================================
  const [classInfo, setClassInfo] = useState({
    name: classConfig?.name || CLASS_METADATA.name,
    waliKelas: classConfig?.waliKelas || CLASS_METADATA.waliKelas,
    waliKelasSubject: classConfig?.waliKelasSubject || CLASS_METADATA.waliKelasSubject,
    waliKelasAvatarUrl: classConfig?.waliKelasAvatarUrl || DEFAULT_WALI_KELAS.avatarUrl,
    motto: classConfig?.motto || CLASS_METADATA.motto,
    examDate: classConfig?.examDate || '2026-11-23',
    graduationDate: classConfig?.graduationDate || '2027-06-15',
  });
  const [newAdminPin, setNewAdminPin] = useState('');
  const [newKasPin, setNewKasPin] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const waliFileInputRef = React.useRef<HTMLInputElement>(null);

  // Dynamic Countdown Events State
  const [countdownList, setCountdownList] = useState<CountdownEvent[]>(() => {
    if (countdownEvents && countdownEvents.length > 0) return countdownEvents;
    if (classConfig?.countdownEvents && classConfig.countdownEvents.length > 0) return classConfig.countdownEvents;
    return [
      {
        id: 'cd-1',
        title: 'Asesmen Sumatif Akhir Jenjang (ASAJ)',
        targetDate: classConfig?.examDate || '2026-11-23',
        description: 'Ujian penentu kelulusan kelas 9 SMP Negeri 1 Bojongsari',
        category: 'Ujian',
        active: true,
      },
      {
        id: 'cd-2',
        title: 'Wisuda & Pelepasan Angkatan IX-H',
        targetDate: classConfig?.graduationDate || '2027-06-15',
        description: 'Momen puncak kelulusan dan pelepasan bersama seluruh keluarga besar IX-H',
        category: 'Wisuda',
        active: true,
      },
    ];
  });
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [editingCountdownId, setEditingCountdownId] = useState<string | null>(null);
  const [countdownForm, setCountdownForm] = useState({
    title: '',
    description: '',
    targetDate: new Date().toISOString().slice(0, 10),
    category: 'Kegiatan' as 'Ujian' | 'Wisuda' | 'Kegiatan' | 'Liburan' | 'Lainnya',
    active: true,
  });

  useEffect(() => {
    if (countdownEvents && countdownEvents.length > 0) {
      setCountdownList(countdownEvents);
    } else if (classConfig?.countdownEvents && classConfig.countdownEvents.length > 0) {
      setCountdownList(classConfig.countdownEvents);
    }
  }, [countdownEvents, classConfig?.countdownEvents]);

  const handleOpenAddCountdown = () => {
    setEditingCountdownId(null);
    setCountdownForm({
      title: '',
      description: '',
      targetDate: new Date().toISOString().slice(0, 10),
      category: 'Kegiatan',
      active: true,
    });
    setShowCountdownModal(true);
  };

  const handleOpenEditCountdown = (evt: CountdownEvent) => {
    setEditingCountdownId(evt.id);
    setCountdownForm({
      title: evt.title,
      description: evt.description || '',
      targetDate: evt.targetDate.slice(0, 10),
      category: (evt.category as any) || 'Kegiatan',
      active: evt.active,
    });
    setShowCountdownModal(true);
  };

  const handleDeleteCountdown = (id: string) => {
    if (countdownList.length <= 1) {
      alert('Minimal harus ada 1 target hitung mundur!');
      return;
    }
    if (!confirm('Apakah Anda yakin ingin menghapus target hitung mundur ini?')) return;
    const updated = countdownList.filter((e) => e.id !== id);
    setCountdownList(updated);
    onUpdateCountdownEvents?.(updated);
    if (onUpdateClassConfig && classConfig) {
      onUpdateClassConfig({ ...classConfig, countdownEvents: updated });
    }
    saveClassSettings({ countdownEvents: updated });
    logActivity('Hapus Target Hitung Mundur', `Menghapus target hitung mundur id ${id}`, 'PENGATURAN');
    showSuccessNotification('Target hitung mundur berhasil dihapus!');
  };

  const handleToggleActiveCountdown = (id: string) => {
    const updated = countdownList.map((e) => (e.id === id ? { ...e, active: !e.active } : e));
    setCountdownList(updated);
    onUpdateCountdownEvents?.(updated);
    if (onUpdateClassConfig && classConfig) {
      onUpdateClassConfig({ ...classConfig, countdownEvents: updated });
    }
    saveClassSettings({ countdownEvents: updated });
  };

  const handleSaveCountdownForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!countdownForm.title.trim()) {
      alert('Judul target acara wajib diisi!');
      return;
    }
    let updated: CountdownEvent[];
    if (editingCountdownId) {
      updated = countdownList.map((e) =>
        e.id === editingCountdownId
          ? {
              ...e,
              title: countdownForm.title.trim(),
              description: countdownForm.description.trim(),
              targetDate: countdownForm.targetDate,
              category: countdownForm.category,
              active: countdownForm.active,
            }
          : e
      );
      logActivity('Edit Target Hitung Mundur', `Mengubah target "${countdownForm.title}"`, 'PENGATURAN');
    } else {
      const newEvt: CountdownEvent = {
        id: `cd-${Date.now()}`,
        title: countdownForm.title.trim(),
        description: countdownForm.description.trim(),
        targetDate: countdownForm.targetDate,
        category: countdownForm.category,
        active: countdownForm.active,
      };
      updated = [...countdownList, newEvt];
      logActivity('Tambah Target Hitung Mundur', `Menambahkan target "${countdownForm.title}"`, 'PENGATURAN');
    }

    setCountdownList(updated);
    onUpdateCountdownEvents?.(updated);
    if (onUpdateClassConfig && classConfig) {
      onUpdateClassConfig({ ...classConfig, countdownEvents: updated });
    }
    saveClassSettings({ countdownEvents: updated });
    setShowCountdownModal(false);
    fireConfetti({ particleCount: 25 });
    showSuccessNotification('Target hitung mundur berhasil disimpan!');
  };

  const handleWaliFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 450;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setClassInfo((prev) => ({ ...prev, waliKelasAvatarUrl: compressed }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Sync with Firestore realtime updates
  useEffect(() => {
    if (classConfig) {
      setClassInfo({
        name: classConfig.name || CLASS_METADATA.name,
        waliKelas: classConfig.waliKelas || CLASS_METADATA.waliKelas,
        waliKelasSubject: classConfig.waliKelasSubject || CLASS_METADATA.waliKelasSubject,
        waliKelasAvatarUrl: classConfig.waliKelasAvatarUrl || DEFAULT_WALI_KELAS.avatarUrl,
        motto: classConfig.motto || CLASS_METADATA.motto,
        examDate: classConfig.examDate || '2026-11-23',
        graduationDate: classConfig.graduationDate || '2027-06-15',
      });
    }
  }, [classConfig]);

  const handleSaveClassSettings = async () => {
    setIsSavingSettings(true);
    try {
      const adminPinToSave = newAdminPin.trim() ? newAdminPin.trim() : (classConfig?.adminPin || '9090');
      const kasPinToSave = newKasPin.trim() ? newKasPin.trim() : (classConfig?.kasPin || '1234');

      const updatedPayload = {
        name: classInfo.name.trim() || CLASS_METADATA.name,
        waliKelas: classInfo.waliKelas.trim() || CLASS_METADATA.waliKelas,
        waliKelasSubject: classInfo.waliKelasSubject.trim() || CLASS_METADATA.waliKelasSubject,
        waliKelasAvatarUrl: classInfo.waliKelasAvatarUrl || DEFAULT_WALI_KELAS.avatarUrl,
        motto: classInfo.motto.trim() || CLASS_METADATA.motto,
        adminPin: adminPinToSave,
        kasPin: kasPinToSave,
        examDate: classInfo.examDate,
        graduationDate: classInfo.graduationDate,
        countdownEvents: countdownList,
      };

      await saveClassSettings(updatedPayload);
      if (onUpdateClassConfig) {
        onUpdateClassConfig(updatedPayload);
      }
      logActivity(
        'Ubah Pengaturan Kelas',
        `Memperbarui data kelas (${updatedPayload.name}), jadwal ujian/wisuda, atau PIN`,
        'PENGATURAN'
      );
      setNewAdminPin('');
      setNewKasPin('');
      showSuccessNotification('Pengaturan kelas & PIN berhasil disimpan realtime ke Firestore!');
    } catch (err) {
      console.error('Gagal simpan pengaturan kelas:', err);
      showSuccessNotification('Gagal menyimpan ke Firestore. Silakan coba lagi.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // ==========================================
  // TAB 7: EKSPOR & LAPORAN
  // ==========================================
  const [copiedReport, setCopiedReport] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const generateOfficialReport = () => {
    const maleTotal = students.filter((s) => s.gender === 'L').length;
    const femaleTotal = students.filter((s) => s.gender === 'P').length;
    const officersTotal = students.filter((s) => s.role !== 'Anggota').length;

    return `LAPORAN RESMI ADMINISTRASI KELAS ${classInfo.name}
SMP NEGERI 1
Wali Kelas: ${classInfo.waliKelas} (${classInfo.waliKelasSubject})

A. DEMOGRAFI KELAS:
- Total Siswa: ${students.length} Siswa
- Rincian Gender: ${maleTotal} Siswa Laki-laki & ${femaleTotal} Siswi Perempuan
- Total Pengurus Kelas: ${officersTotal} Siswa
- Iuran Kas Harian: Rp ${nominalKas.toLocaleString('id-ID')} / hari

B. REKAP PRESENSI HARI INI (${attendanceDate}):
- Hadir: ${attendanceStats.hadir} siswa
- Sakit: ${attendanceStats.sakit} siswa
- Izin: ${attendanceStats.izin} siswa
- Alpa: ${attendanceStats.alpa} siswa
- Terlambat: ${attendanceStats.terlambat} siswa
- Tingkat Kehadiran: ${attendanceStats.percentage}%

C. CATATAN KEUANGAN KAS:
- Total Transaksi Tercatat: ${transactions.length} transaksi
- Terakhir Diperbarui: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}

Laporan ini dibuat otomatis melalui IX-H Hub - Portal Administrasi Terpadu.`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateOfficialReport());
    setCopiedReport(true);
    fireConfetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopiedReport(false), 3000);
  };

  const handleDownloadBackup = async () => {
    const data = {
      exportDate: new Date().toISOString(),
      classInfo,
      classConfig,
      nominalKas,
      students,
      lessons,
      picketDuties,
      attendance,
      transactions,
      countdownEvents: countdownList,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const filename = `Backup-Kelas-IXH-${new Date().toISOString().slice(0, 10)}.json`;
    await downloadOrShareBlob(blob, filename, 'Cadangan Data Kelas IX-H');
    logActivity('Unduh Backup JSON', `Mengekspor seluruh arsip basis data kelas ke file JSON`, 'PENGATURAN');
    showSuccessNotification('Cadangan data berhasil disimpan!');
  };

  const handleRestoreBackupFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !confirm(
        `Apakah Anda yakin ingin memulihkan (restore) seluruh data dari file "${file.name}"? Data di sistem & Firestore akan disinkronkan dengan data backup.`
      )
    ) {
      e.target.value = '';
      return;
    }

    setIsRestoring(true);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData || typeof backupData !== 'object') {
        throw new Error('Format file backup JSON tidak valid.');
      }

      const res = await restoreFullBackupToFirestore(backupData);
      if (res.success) {
        if (Array.isArray(backupData.students)) {
          onUpdateStudents(backupData.students);
        }
        if (Array.isArray(backupData.transactions)) {
          onUpdateTransactions(backupData.transactions);
        }
        if (Array.isArray(backupData.lessons)) {
          onUpdateLessons(backupData.lessons);
        }
        if (Array.isArray(backupData.picketDuties)) {
          onUpdatePicketDuties(backupData.picketDuties);
        }
        if (backupData.classConfig || backupData.classInfo) {
          const cfg = backupData.classConfig || backupData.classInfo;
          if (onUpdateClassConfig) {
            onUpdateClassConfig(cfg);
          }
        }
        logActivity('Restore Backup Sistem', `Memulihkan seluruh data kelas dari file ${file.name}`, 'PENGATURAN');
        showSuccessNotification('Seluruh data backup berhasil dipulihkan ke Firestore!');
        fireConfetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      console.error('Gagal restore backup:', err);
      alert('Gagal memproses file backup: ' + (err.message || 'Format tidak valid'));
    } finally {
      setIsRestoring(false);
      e.target.value = '';
    }
  };

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF();

      // Title & Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(31, 58, 95);
      doc.text(`LAPORAN ADMINISTRASI RESMI KELAS ${classInfo.name.toUpperCase()}`, 14, 16);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(92, 111, 132);
      doc.text(`Wali Kelas: ${classInfo.waliKelas} (${classInfo.waliKelasSubject})`, 14, 22);
      doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`, 14, 27);

      // Section A: Presensi Hari Ini
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(28, 95, 224);
      doc.text(`A. REKAP PRESENSI HARIAN (${attendanceDate})`, 14, 35);

      autoTable(doc, {
        startY: 38,
        head: [['Hadir', 'Sakit', 'Izin', 'Alpa', 'Tingkat Kehadiran']],
        body: [[
          `${attendanceStats.hadir} Siswa`,
          `${attendanceStats.sakit} Siswa`,
          `${attendanceStats.izin} Siswa`,
          `${attendanceStats.alpa} Siswa`,
          `${attendanceStats.percentage}%`
        ]],
        theme: 'grid',
        headStyles: { fillColor: [28, 95, 224], textColor: 255 },
        styles: { halign: 'center', fontSize: 9.5 },
      });

      // Section B: Data Siswa
      const yAfterAttendance = (doc as any).lastAutoTable?.finalY || 55;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(28, 95, 224);
      doc.text(`B. DAFTAR SISWA KELAS (${students.length} SISWA)`, 14, yAfterAttendance + 10);

      autoTable(doc, {
        startY: yAfterAttendance + 13,
        head: [['No', 'Nama Siswa', 'L/P', 'Jabatan', 'Cita-cita / Impian']],
        body: students.map((s) => [s.id, s.name, s.gender, s.role, s.dreamSchool || '-']),
        theme: 'striped',
        headStyles: { fillColor: [31, 58, 95], textColor: 255 },
        styles: { fontSize: 8.5 },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          2: { cellWidth: 14, halign: 'center' },
          3: { cellWidth: 32 },
        },
      });

      // Section C: Kas Kelas
      const yAfterStudents = (doc as any).lastAutoTable?.finalY || 160;
      const needNewPage = yAfterStudents > 215;
      if (needNewPage) {
        doc.addPage();
      }
      const yStartCash = needNewPage ? 18 : yAfterStudents + 10;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(28, 95, 224);
      doc.text('C. CATATAN KEUANGAN KAS KELAS (25 Transaksi Terakhir)', 14, yStartCash);

      autoTable(doc, {
        startY: yStartCash + 4,
        head: [['Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Nominal']],
        body: transactions.slice(0, 25).map((t) => [
          t.date,
          t.type,
          t.category,
          t.description,
          `Rp ${t.amount.toLocaleString('id-ID')}`,
        ]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        styles: { fontSize: 8 },
        columnStyles: {
          4: { halign: 'right' },
        },
      });

      const filename = `Laporan-Resmi-${classInfo.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
      const res = await savePdfDoc(doc, filename, `Laporan Resmi Administrasi ${classInfo.name}`);
      if (res.success && res.method !== 'cancelled') {
        logActivity('Ekspor Laporan PDF', `Mengunduh Laporan Resmi Administrasi format PDF`, 'PENGATURAN');
        showSuccessNotification('Laporan PDF berhasil diunduh!');
      }
    } catch (err: any) {
      console.error('Gagal export PDF:', err);
      alert('Gagal membuat file PDF: ' + err.message);
    }
  };

  const handleExportExcel = async () => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Data Siswa
      const studentRows = students.map((s) => ({
        'No Absen': s.id,
        'Nama Lengkap': s.name,
        'Panggilan': s.nickname,
        'Jenis Kelamin': s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
        'Jabatan': s.role,
        'Sekolah Impian / Cita-cita': s.dreamSchool || '-',
        'Bio / Slogan': s.bio || '-',
      }));
      const wsStudents = XLSX.utils.json_to_sheet(studentRows);
      XLSX.utils.book_append_sheet(wb, wsStudents, 'Data Siswa');

      // Sheet 2: Kas Transaksi
      const cashRows = transactions.map((t) => ({
        'ID Transaksi': t.id,
        'Tanggal': t.date,
        'Tipe': t.type,
        'Kategori': t.category,
        'Keterangan': t.description,
        'Nominal (Rp)': t.amount,
        'Dicatat Oleh': t.recordedBy,
      }));
      const wsCash = XLSX.utils.json_to_sheet(cashRows);
      XLSX.utils.book_append_sheet(wb, wsCash, 'Rekap Transaksi Kas');

      // Sheet 3: Rekap Absensi
      const attendanceSummary = [
        {
          'Tanggal': attendanceDate,
          'Total Hadir': attendanceStats.hadir,
          'Total Sakit': attendanceStats.sakit,
          'Total Izin': attendanceStats.izin,
          'Total Alpa': attendanceStats.alpa,
          'Persentase Kehadiran': `${attendanceStats.percentage}%`,
        },
      ];
      const wsAttendance = XLSX.utils.json_to_sheet(attendanceSummary);
      XLSX.utils.book_append_sheet(wb, wsAttendance, 'Rekap Presensi');

      // Sheet 4: Jadwal Pelajaran
      const lessonRows = lessons.map((l) => ({
        'Hari': l.day,
        'Waktu': l.time,
        'Mata Pelajaran': l.subject,
        'Guru Pengampu': l.teacher,
        'Ruangan': l.room,
      }));
      const wsLessons = XLSX.utils.json_to_sheet(lessonRows);
      XLSX.utils.book_append_sheet(wb, wsLessons, 'Jadwal Pelajaran');

      const filename = `Laporan-Kelas-${classInfo.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      const res = await saveExcelWorkbook(wb, filename, `Rekap Administrasi ${classInfo.name}`);
      if (res.success && res.method !== 'cancelled') {
        logActivity('Ekspor Laporan Excel', `Mengunduh Rekap Administrasi format Excel (.xlsx)`, 'PENGATURAN');
        showSuccessNotification('Laporan Excel (.xlsx) berhasil diunduh!');
      }
    } catch (err: any) {
      console.error('Gagal export Excel:', err);
      alert('Gagal membuat file Excel: ' + err.message);
    }
  };

  // Student actions
  const handleSaveEditStudent = () => {
    if (!editingStudent) return;
    const updated = students.map((s) => (s.id === editingStudent.id ? editingStudent : s));
    onUpdateStudents(updated);
    saveStudentData(editingStudent.id, editingStudent);
    logActivity(
      'Edit Data Siswa',
      `Memperbarui profil ${editingStudent.name} (#${editingStudent.id})`,
      'SISWA'
    );
    setEditingStudent(null);
    showSuccessNotification('Data siswa berhasil diperbarui!');
  };

  const handleCreateStudent = () => {
    if (!newStudentForm.name) return;
    const newStudent: Student = {
      id: Number(newStudentForm.id) || students.length + 1,
      name: newStudentForm.name || '',
      nickname: newStudentForm.nickname || newStudentForm.name?.split(' ')[0] || '',
      gender: (newStudentForm.gender as Gender) || 'L',
      role: newStudentForm.role || 'Anggota',
      pin: newStudentForm.pin || '1234',
      dreamSchool: newStudentForm.dreamSchool || 'SMAN 1',
      bio: newStudentForm.bio || '',
      photoUrl: newStudentForm.photoUrl || '',
    };
    onUpdateStudents([...students, newStudent]);
    saveStudentData(newStudent.id, newStudent);
    logActivity(
      'Tambah Siswa Baru',
      `Menambahkan data siswa #${newStudent.id} (${newStudent.name})`,
      'SISWA'
    );
    setIsAddingStudent(false);
    setNewStudentForm({
      id: students.length + 2,
      name: '',
      nickname: '',
      gender: 'L',
      role: 'Anggota',
      pin: '1234',
      dreamSchool: 'SMAN 1',
      bio: '',
    });
    showSuccessNotification('Siswa baru berhasil ditambahkan!');
  };

  const handleDeleteStudent = (id: number) => {
    const s = students.find((item) => item.id === id);
    if (!s) return;
    if (confirm(`Apakah Anda yakin ingin menghapus data "${s.name}" (#${s.id})?`)) {
      onUpdateStudents(students.filter((item) => item.id !== id));
      deleteStudentData(id);
      logActivity(
        'Hapus Siswa',
        `Menghapus data siswa #${id} (${s.name})`,
        'SISWA'
      );
      showSuccessNotification(`Data siswa ${s.name} berhasil dihapus.`);
    }
  };

  // Filtered students for TAB 1
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nickname.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.role.toLowerCase().includes(studentSearch.toLowerCase()) ||
      String(s.id).includes(studentSearch)
  );

  // Filtered students for TAB 2 (ABSENSI)
  const filteredAttendanceStudents = students.filter((s) => {
    const st = currentDailyAttendance.records[s.id] || 'HADIR';
    const matchesFilter = attendanceFilter === 'ALL' || st === attendanceFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      String(s.id).includes(attendanceSearch);
    return matchesFilter && matchesSearch;
  });

  const maleCount = students.filter((s) => s.gender === 'L').length;
  const femaleCount = students.filter((s) => s.gender === 'P').length;

  const tkaQuestionCount = useMemo(() => {
    try {
      return loadAllQuestions().length;
    } catch {
      return 0;
    }
  }, [activeTab, isOpen]);

  // Materials State for TAB MATERI
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialTypeFilter, setMaterialTypeFilter] = useState<'ALL' | 'BUKU_PAKET' | 'MODUL' | 'TUGAS' | 'CATATAN'>('ALL');
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newMaterialForm, setNewMaterialForm] = useState<{
    title: string;
    subject: string;
    type: 'BUKU_PAKET' | 'MODUL' | 'TUGAS' | 'CATATAN';
    grade: string;
    author: string;
    fileUrl: string;
    fileSize: string;
    description: string;
  }>({
    title: '',
    subject: 'Matematika',
    type: 'BUKU_PAKET',
    grade: 'Kelas 9',
    author: '',
    fileUrl: '',
    fileSize: '5.2 MB',
    description: '',
  });

  const handleCreateMaterial = () => {
    if (!newMaterialForm.title.trim() || !newMaterialForm.subject.trim()) {
      alert('Judul materi/buku dan mata pelajaran wajib diisi!');
      return;
    }
    const createdMaterial: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: newMaterialForm.title.trim(),
      subject: newMaterialForm.subject.trim(),
      type: newMaterialForm.type,
      grade: newMaterialForm.grade || 'Kelas 9',
      author: newMaterialForm.author.trim() || 'Admin IX-H',
      fileUrl: newMaterialForm.fileUrl.trim() || 'https://buku.kemdikbud.go.id',
      fileSize: newMaterialForm.fileSize.trim() || '3.5 MB',
      description:
        newMaterialForm.description.trim() ||
        'Materi pembelajaran kelas IX-H SMP Negeri 1 Bojongsari',
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    if (onUpdateMaterials) {
      onUpdateMaterials([createdMaterial, ...materials]);
    }
    setIsAddingMaterial(false);
    setNewMaterialForm({
      title: '',
      subject: 'Matematika',
      type: 'BUKU_PAKET',
      grade: 'Kelas 9',
      author: '',
      fileUrl: '',
      fileSize: '5.2 MB',
      description: '',
    });
    showSuccessNotification('Buku / Materi berhasil ditambahkan!');
  };

  const handleDeleteMaterial = (id: string) => {
    const mat = materials.find((m) => m.id === id);
    if (!mat) return;
    if (confirm(`Apakah Anda yakin ingin menghapus materi "${mat.title}"?`)) {
      if (onUpdateMaterials) {
        onUpdateMaterials(materials.filter((m) => m.id !== id));
      }
      showSuccessNotification(`Materi "${mat.title}" berhasil dihapus.`);
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.subject.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.author.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.description.toLowerCase().includes(materialSearch.toLowerCase());
      const matchType =
        materialTypeFilter === 'ALL' || m.type === materialTypeFilter;
      return matchSearch && matchType;
    });
  }, [materials, materialSearch, materialTypeFilter]);

  if (!isOpen) return null;

  // Rail navigation items (10 modules)
  const RAIL_NAV_ITEMS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'SISWA', label: 'Data Siswa', icon: Users },
    { id: 'ABSENSI', label: 'Presensi / Absen', icon: CalendarCheck },
    { id: 'JADWAL', label: 'Ubah Jadwal', icon: Calendar },
    { id: 'PIKET', label: 'Kelola Piket', icon: Sparkles },
    { id: 'KAS', label: 'Keuangan & Kas', icon: Coins },
    { id: 'MATERI', label: 'Buku & Materi', icon: BookOpen },
    { id: 'SOAL_TKA', label: 'Bank Soal TKA', icon: GraduationCap },
    { id: 'PENGATURAN', label: 'Identitas & PIN', icon: Settings },
    { id: 'LAPORAN', label: 'Ekspor & WA', icon: FileText },
    { id: 'LOG', label: 'Log Aktivitas', icon: History },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-[calc(100vh-65px)] w-full bg-[#E7EBF5] text-[#1F3A5F] overflow-x-hidden relative">
      {/* ---------------- FIXED VERTICAL ICON RAIL (~56-64px) ---------------- */}
      <aside className="w-14 sm:w-16 bg-[#E7EBF5] border-r border-white/80 neu-flat flex flex-col items-center py-3 z-20 flex-shrink-0 select-none sticky top-0 sm:top-[53px] h-[calc(100vh-53px)] overflow-y-auto no-scrollbar justify-between">
        <div className="flex flex-col items-center gap-2 w-full px-1">
          {/* Ringkasan Dashboard (Overview) */}
          <button
            onClick={() => handleSelectSection('OVERVIEW')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              activeTab === 'OVERVIEW'
                ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-md'
                : 'neu-btn text-[#5C6F84] hover:text-[#1C5FE0]'
            }`}
            title="Ringkasan Dashboard"
            aria-label="Ringkasan Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>

          <div className="w-7 h-[1px] bg-[#C4CAE0]/60 my-1" />

          {/* 10 Icons in Rail */}
          {RAIL_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isSensitive = SENSITIVE_SECTIONS.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSection(item.id)}
                className={`w-11 h-11 rounded-2xl relative flex items-center justify-center transition-all ${
                  isActive
                    ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-md'
                    : 'neu-btn text-[#5C6F84] hover:text-[#1C5FE0]'
                }`}
                title={`${item.label}${isSensitive && !isSensitiveUnlocked ? ' (PIN Diperlukan)' : ''}`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                {isSensitive && !isSensitiveUnlocked && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px] shadow-xs">
                    <Lock className="w-2 h-2" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mode Siswa button */}
        {onSwitchRole && (
          <div className="pt-2 w-full flex justify-center border-t border-[#C4CAE0]/40">
            <button
              onClick={() => onSwitchRole('SISWA')}
              className="w-11 h-11 rounded-2xl neu-btn text-[#5C6F84] hover:text-[#1C5FE0] flex items-center justify-center"
              title="Kembali ke Mode Siswa"
              aria-label="Kembali ke Mode Siswa"
            >
              <UserCheck className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#E7EBF5]">
        {/* Success Notification Banner */}
        {saveSuccessMsg && (
          <div className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between animate-fadeIn z-10 sticky top-0 sm:top-[53px]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button
              onClick={() => setSaveSuccessMsg('')}
              className="text-white/80 hover:text-white text-base"
            >
              &times;
            </button>
          </div>
        )}

        {activeTab === 'OVERVIEW' ? (
          /* ==================== VIEW 0: RINGKASAN DASHBOARD ==================== */
          <div className="p-3.5 sm:p-6 space-y-5 max-w-4xl w-full mx-auto pb-16">
            {/* 1. Sapaan Header & Tanggal */}
            <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center font-heading font-extrabold text-lg neu-flat-sm">
                  <ShieldCheck className="w-6 h-6 text-[#1C5FE0]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-extrabold text-lg sm:text-xl text-[#1F3A5F]">
                      Halo, Admin! 👋
                    </h2>
                    <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#1C5FE0]/15 text-[#1C5FE0]">
                      Master IX-H
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6F84] mt-0.5">
                    {currentDateFormatted} &bull; SMP Negeri 1 Bojongsari
                  </p>
                </div>
              </div>

              {onSwitchRole && (
                <button
                  onClick={() => onSwitchRole('SISWA')}
                  className="neu-btn px-3.5 py-2 rounded-xl text-xs font-heading font-bold text-[#1F3A5F] hover:text-[#1C5FE0] flex items-center gap-2 self-start sm:self-auto"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Mode Siswa</span>
                </button>
              )}
            </div>

            {/* 2. Grid Kartu Ringkasan (2 kolom di HP) - SEMUA pakai aksen biru yang sama (#1C5FE0) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Total Siswa */}
              <div
                onClick={() => handleSelectSection('SISWA')}
                className="neu-flat rounded-2xl p-3.5 sm:p-4 bg-[#E7EBF5] border border-white/80 hover:border-[#1C5FE0]/40 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-[#5C6F84]">
                    Total Siswa
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-xl sm:text-2xl text-[#1F3A5F]">
                    {students.length}
                  </div>
                  <div className="text-[10px] text-[#5C6F84] mt-0.5">
                    {maleCount} L &bull; {femaleCount} P
                  </div>
                </div>
              </div>

              {/* Card 2: Saldo Kas */}
              <div
                onClick={() => handleSelectSection('KAS')}
                className="neu-flat rounded-2xl p-3.5 sm:p-4 bg-[#E7EBF5] border border-white/80 hover:border-[#1C5FE0]/40 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-[#5C6F84]">
                    Saldo Kas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-lg sm:text-xl text-[#1F3A5F] truncate">
                    Rp {currentBalance.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-[#5C6F84] mt-0.5 truncate">
                    Target: Rp {nominalKas.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Card 3: Kehadiran Hari Ini */}
              <div
                onClick={() => handleSelectSection('ABSENSI')}
                className="neu-flat rounded-2xl p-3.5 sm:p-4 bg-[#E7EBF5] border border-white/80 hover:border-[#1C5FE0]/40 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-[#5C6F84]">
                    Kehadiran
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-xl sm:text-2xl text-[#1F3A5F]">
                    {attendanceStats.percentage}%
                  </div>
                  <div className="text-[10px] text-[#5C6F84] mt-0.5">
                    {attendanceStats.hadir} dari {students.length} Hadir
                  </div>
                </div>
              </div>

              {/* Card 4: Bank Soal TKA */}
              <div
                onClick={() => handleSelectSection('SOAL_TKA')}
                className="neu-flat rounded-2xl p-3.5 sm:p-4 bg-[#E7EBF5] border border-white/80 hover:border-[#1C5FE0]/40 transition-all cursor-pointer group shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-heading font-bold text-[#5C6F84]">
                    Bank Soal TKA
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="font-heading font-extrabold text-xl sm:text-2xl text-[#1F3A5F]">
                    {tkaQuestionCount}
                  </div>
                  <div className="text-[10px] text-[#5C6F84] mt-0.5">
                    Soal Terdaftar
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Grafik Simpel Garis / Area (1 tone biru #1C5FE0) */}
            <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                      Tren Tingkat Kehadiran
                    </h4>
                    <p className="text-[11px] text-[#5C6F84]">
                      7 hari pembelajaran terakhir kelas IX-H
                    </p>
                  </div>
                </div>
                <span className="text-xs font-heading font-extrabold text-[#1C5FE0] px-2.5 py-1 rounded-full bg-[#1C5FE0]/10">
                  Rata-rata: 97.4%
                </span>
              </div>

              {/* Area Line Chart via SVG */}
              <div className="w-full h-36 pt-1">
                <svg viewBox="0 0 380 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1C5FE0" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#1C5FE0" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="360" y2="20" stroke="#C4CAE0" strokeOpacity="0.45" strokeDasharray="3 3" />
                  <line x1="20" y1="55" x2="360" y2="55" stroke="#C4CAE0" strokeOpacity="0.45" strokeDasharray="3 3" />
                  <line x1="20" y1="90" x2="360" y2="90" stroke="#C4CAE0" strokeOpacity="0.45" strokeDasharray="3 3" />

                  {/* Gradient Area */}
                  <path
                    d="M 30,35 C 75,25 105,45 140,25 C 175,10 205,30 245,20 C 285,15 315,30 350,15 L 350,95 L 30,95 Z"
                    fill="url(#adminChartGrad)"
                  />
                  {/* Curve Line */}
                  <path
                    d="M 30,35 C 75,25 105,45 140,25 C 175,10 205,30 245,20 C 285,15 315,30 350,15"
                    fill="none"
                    stroke="#1C5FE0"
                    strokeWidth="2.75"
                    strokeLinecap="round"
                  />

                  {/* Points & Day labels */}
                  {[
                    { x: 30, y: 35, val: '94%', day: 'Sen' },
                    { x: 83, y: 28, val: '97%', day: 'Sel' },
                    { x: 136, y: 25, val: '97%', day: 'Rab' },
                    { x: 190, y: 15, val: '100%', day: 'Kam' },
                    { x: 243, y: 20, val: '98%', day: 'Jum' },
                    { x: 296, y: 26, val: '97%', day: 'Sab' },
                    { x: 350, y: 15, val: `${attendanceStats.percentage}%`, day: 'Hari Ini' },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="3.5" fill="#1C5FE0" stroke="#E7EBF5" strokeWidth="2" />
                      <text x={pt.x} y={pt.y - 7} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1C5FE0">
                        {pt.val}
                      </text>
                      <text x={pt.x} y="112" textAnchor="middle" fontSize="9" fontWeight="600" fill="#5C6F84">
                        {pt.day}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* 4. Grid "Aksi Cepat Admin" (10 shortcut buttons) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                  Aksi Cepat &amp; Modul Admin
                </h4>
                <span className="text-xs text-[#5C6F84]">10 Fungsi Pengelolaan</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {RAIL_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isSensitive = SENSITIVE_SECTIONS.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSection(item.id)}
                      className="neu-flat rounded-2xl p-3 bg-[#E7EBF5] border border-white/80 hover:border-[#1C5FE0]/40 transition-all text-left flex flex-col justify-between gap-2 cursor-pointer group shadow-xs min-h-[82px]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="w-8 h-8 rounded-xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSensitive && !isSensitiveUnlocked && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 flex items-center gap-1 font-semibold">
                            <Lock className="w-2.5 h-2.5" /> PIN
                          </span>
                        )}
                      </div>
                      <span className="font-heading font-bold text-xs text-[#1F3A5F] group-hover:text-[#1C5FE0] transition-colors line-clamp-1">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ==================== VIEW FULL-SCREEN UNTUK TIAP SECTION ==================== */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Breadcrumb Header */}
            <div className="px-3.5 sm:px-6 py-3 bg-[#E7EBF5] border-b border-white/80 flex items-center justify-between gap-3 shadow-xs sticky top-0 sm:top-[53px] z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => handleSelectSection('OVERVIEW')}
                  className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#1F3A5F] flex items-center gap-1.5 hover:text-[#1C5FE0] transition-colors shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Ringkasan</span>
                </button>
                <div className="h-4 w-[1px] bg-[#C4CAE0]/60 shrink-0" />
                <h3 className="font-heading font-bold text-sm sm:text-base text-[#1F3A5F] truncate">
                  {RAIL_NAV_ITEMS.find((i) => i.id === activeTab)?.label || activeTab}
                </h3>
              </div>

              {/* Status PIN if sensitive */}
              {SENSITIVE_SECTIONS.includes(activeTab as AdminTab) && isSensitiveUnlocked && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                  <Unlock className="w-3 h-3" />
                  <span className="hidden sm:inline">PIN Terverifikasi</span>
                </div>
              )}
            </div>

            {/* Content Body of the Active Section */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-5">
              {/* ---------------- TAB 1: SISWA ---------------- */}
              {activeTab === 'SISWA' && (
                <div className="space-y-4">
                  {/* Summary bar & Actions */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl neu-flat-sm flex items-center justify-center text-[#1C5FE0]">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                          Total Terdaftar: {students.length} Siswa
                        </h4>
                        <p className="text-xs text-[#5C6F84]">
                          {maleCount} Siswa Laki-laki &bull; {femaleCount} Siswi Perempuan
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAddingStudent(!isAddingStudent)}
                        className="neu-btn-active bg-[#1C5FE0] text-white px-3.5 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{isAddingStudent ? 'Tutup Form' : 'Tambah Siswa'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Add Student Form */}
                  {isAddingStudent && (
                    <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-blue-200 space-y-3 animate-fadeIn">
                      <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1C5FE0]">
                        Input Data Siswa Baru
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Nomor Absen
                          </label>
                          <input
                            type="number"
                            value={newStudentForm.id}
                            onChange={(e) =>
                              setNewStudentForm({ ...newStudentForm, id: Number(e.target.value) })
                            }
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Muhammad Farhan Maulana"
                            value={newStudentForm.name}
                            onChange={(e) =>
                              setNewStudentForm({ ...newStudentForm, name: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Nama Panggilan
                          </label>
                          <input
                            type="text"
                            placeholder="Farhan"
                            value={newStudentForm.nickname}
                            onChange={(e) =>
                              setNewStudentForm({ ...newStudentForm, nickname: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Gender
                          </label>
                          <select
                            value={newStudentForm.gender}
                            onChange={(e) =>
                              setNewStudentForm({
                                ...newStudentForm,
                                gender: e.target.value as Gender,
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                          >
                            <option value="L">L (Putra)</option>
                            <option value="P">P (Putri)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Jabatan / Peran
                          </label>
                          <select
                            value={newStudentForm.role}
                            onChange={(e) =>
                              setNewStudentForm({ ...newStudentForm, role: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                          >
                            <option value="Anggota">Anggota</option>
                            <option value="Ketua Kelas">Ketua Kelas</option>
                            <option value="Wakil Ketua">Wakil Ketua</option>
                            <option value="Bendahara 1">Bendahara 1</option>
                            <option value="Bendahara 2">Bendahara 2</option>
                            <option value="Sekretaris 1">Sekretaris 1</option>
                            <option value="Sekretaris 2">Sekretaris 2</option>
                            <option value="Seksi Kebersihan">Seksi Kebersihan</option>
                            <option value="Seksi Keamanan">Seksi Keamanan</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setIsAddingStudent(false)}
                          className="px-4 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#5C6F84]"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleCreateStudent}
                          className="px-5 py-1.5 rounded-xl bg-[#1C5FE0] text-white text-xs font-heading font-bold shadow-sm"
                        >
                          Simpan Siswa Baru
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Search Bar */}
                  <div className="neu-inset rounded-2xl p-2.5 flex items-center gap-2 border border-white/50">
                    <Search className="w-4 h-4 text-[#5C6F84] ml-1.5 flex-shrink-0" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Cari siswa berdasarkan nama, absen, peran..."
                      className="w-full bg-transparent text-xs sm:text-sm text-[#1F3A5F] placeholder-[#8B9BB0] focus:outline-none"
                    />
                  </div>

                  {/* Students Table */}
                  <div className="neu-flat rounded-2xl overflow-hidden border border-white/70">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#DDE3F0] text-[#1F3A5F] font-heading font-bold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="px-3.5 py-2.5">Absen</th>
                            <th className="px-3.5 py-2.5">Nama Siswa</th>
                            <th className="px-3.5 py-2.5">Gender</th>
                            <th className="px-3.5 py-2.5">Peran</th>
                            <th className="px-3.5 py-2.5">Target SMA</th>
                            <th className="px-3.5 py-2.5 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C4CAE0]/40">
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-[#E0E5F0]/50 transition-colors">
                              <td className="px-3.5 py-2.5 font-bold text-[#1C5FE0]">
                                #{student.id}
                              </td>
                              <td className="px-3.5 py-2.5 font-medium text-[#1F3A5F]">
                                <div>{student.name}</div>
                                <div className="text-[10px] text-[#5C6F84]">{student.nickname}</div>
                              </td>
                              <td className="px-3.5 py-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                    student.gender === 'L'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-rose-100 text-rose-700'
                                  }`}
                                >
                                  {student.gender === 'L' ? 'Putra' : 'Putri'}
                                </span>
                              </td>
                              <td className="px-3.5 py-2.5">
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                    student.role !== 'Anggota'
                                      ? 'bg-amber-100 text-amber-800 font-bold'
                                      : 'text-[#5C6F84]'
                                  }`}
                                >
                                  {student.role}
                                </span>
                              </td>
                              <td className="px-3.5 py-2.5 text-[#5C6F84] text-[11px]">
                                {student.dreamSchool || '-'}
                              </td>
                              <td className="px-3.5 py-2.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingStudent(student)}
                                    className="p-1.5 rounded-lg neu-btn text-[#1C5FE0]"
                                    title="Edit Siswa"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStudent(student.id)}
                                    className="p-1.5 rounded-lg neu-btn text-rose-500 hover:text-rose-700"
                                    title="Hapus Siswa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- TAB 2: ABSENSI SISWA ---------------- */}
              {activeTab === 'ABSENSI' && (
                <div className="space-y-4">
                  {/* Top Bar: Date Picker & Stats */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C4CAE0]/40">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-2">
                          <CalendarCheck className="w-4 h-4 text-[#1C5FE0]" />
                          <span>Presensi &amp; Absensi Harian Siswa</span>
                        </h4>
                        <p className="text-xs text-[#5C6F84]">
                          Pencatatan kehadiran digital 32 siswa kelas IX-H
                        </p>
                      </div>

                      {/* Date Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#5C6F84]">Tanggal:</span>
                        <input
                          type="date"
                          value={attendanceDate}
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="px-3 py-1.5 rounded-xl neu-inset font-heading font-bold text-xs text-[#1C5FE0] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                      <div className="neu-flat-sm rounded-xl p-2.5 bg-[#E7EBF5]">
                        <span className="text-[10px] font-bold text-[#5C6F84] uppercase block">
                          Total
                        </span>
                        <span className="font-heading font-bold text-base text-[#1F3A5F]">
                          {attendanceStats.total}
                        </span>
                      </div>
                      <div className="neu-flat-sm rounded-xl p-2.5 bg-emerald-50/60 border border-emerald-200/50">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                          Hadir
                        </span>
                        <span className="font-heading font-bold text-base text-emerald-600">
                          {attendanceStats.hadir}
                        </span>
                      </div>
                      <div className="neu-flat-sm rounded-xl p-2.5 bg-amber-50/60 border border-amber-200/50">
                        <span className="text-[10px] font-bold text-amber-700 uppercase block">
                          Sakit
                        </span>
                        <span className="font-heading font-bold text-base text-amber-600">
                          {attendanceStats.sakit}
                        </span>
                      </div>
                      <div className="neu-flat-sm rounded-xl p-2.5 bg-blue-50/60 border border-blue-200/50">
                        <span className="text-[10px] font-bold text-blue-700 uppercase block">
                          Izin
                        </span>
                        <span className="font-heading font-bold text-base text-blue-600">
                          {attendanceStats.izin}
                        </span>
                      </div>
                      <div className="neu-flat-sm rounded-xl p-2.5 bg-rose-50/60 border border-rose-200/50">
                        <span className="text-[10px] font-bold text-rose-700 uppercase block">
                          Alpa
                        </span>
                        <span className="font-heading font-bold text-base text-rose-600">
                          {attendanceStats.alpa}
                        </span>
                      </div>
                      <div className="neu-flat-sm rounded-xl p-2.5 bg-purple-50/60 border border-purple-200/50">
                        <span className="text-[10px] font-bold text-purple-700 uppercase block">
                          Terlambat
                        </span>
                        <span className="font-heading font-bold text-base text-purple-600">
                          {attendanceStats.terlambat}
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleMarkAllPresent}
                          className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Hadirkan Semua Siswa</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyAttendanceWA}
                          className="neu-btn-active bg-[#1C5FE0] text-white px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{copiedAttendanceWA ? 'Tersalin ke WA!' : 'Salin Rekap WA'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="neu-inset rounded-2xl p-2 flex items-center gap-2 border border-white/50 flex-1">
                      <Search className="w-4 h-4 text-[#5C6F84] ml-1 flex-shrink-0" />
                      <input
                        type="text"
                        value={attendanceSearch}
                        onChange={(e) => setAttendanceSearch(e.target.value)}
                        placeholder="Cari siswa..."
                        className="w-full bg-transparent text-xs text-[#1F3A5F] focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                      {(
                        [
                          { id: 'ALL', label: 'Semua' },
                          { id: 'HADIR', label: 'Hadir' },
                          { id: 'SAKIT', label: 'Sakit' },
                          { id: 'IZIN', label: 'Izin' },
                          { id: 'ALPA', label: 'Alpa' },
                          { id: 'TERLAMBAT', label: 'Terlambat' },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setAttendanceFilter(f.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap ${
                            attendanceFilter === f.id
                              ? 'neu-btn-active bg-[#1F3A5F] text-white'
                              : 'neu-btn text-[#5C6F84]'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student Attendance List */}
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {filteredAttendanceStudents.map((s) => {
                      const currentStatus = currentDailyAttendance.records[s.id] || 'HADIR';
                      const currentNote = currentDailyAttendance.notes?.[s.id] || '';

                      return (
                        <div
                          key={s.id}
                          className="neu-flat rounded-2xl p-3 bg-[#E7EBF5] border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-xl neu-inset-sm font-bold text-[#1C5FE0] flex items-center justify-center flex-shrink-0">
                              #{s.id}
                            </span>
                            <div className="min-w-0">
                              <div className="font-heading font-bold text-[#1F3A5F] truncate">
                                {s.name}
                              </div>
                              <div className="text-[10px] text-[#5C6F84] flex items-center gap-1.5">
                                <span>{s.nickname}</span>
                                <span>&bull;</span>
                                <span className={s.gender === 'L' ? 'text-blue-600' : 'text-rose-600'}>
                                  {s.gender === 'L' ? 'Putra' : 'Putri'}
                                </span>
                                {s.role !== 'Anggota' && (
                                  <>
                                    <span>&bull;</span>
                                    <span className="text-amber-700 font-semibold">{s.role}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status Buttons (H, S, I, A) */}
                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            {(
                              [
                                { key: 'HADIR' as const, label: 'H', full: 'Hadir', bg: 'bg-emerald-500 text-white' },
                                { key: 'SAKIT' as const, label: 'S', full: 'Sakit', bg: 'bg-amber-500 text-white' },
                                { key: 'IZIN' as const, label: 'I', full: 'Izin', bg: 'bg-blue-500 text-white' },
                                { key: 'ALPA' as const, label: 'A', full: 'Alpa', bg: 'bg-rose-500 text-white' },
                              ]
                            ).map((st) => {
                              const isSelected = currentStatus === st.key;
                              return (
                                <button
                                  key={st.key}
                                  onClick={() => handleSetStudentAttendance(s.id, st.key)}
                                  className={`w-7 h-7 rounded-xl font-heading font-bold text-xs transition-all flex items-center justify-center ${
                                    isSelected
                                      ? `${st.bg} shadow-md scale-105`
                                      : 'neu-btn text-[#5C6F84] hover:text-[#1F3A5F]'
                                  }`}
                                  title={`${st.full}`}
                                >
                                  {st.label}
                                </button>
                              );
                            })}
                          </div>

                          {/* Optional Note input for Sakit/Izin */}
                          {(currentStatus === 'SAKIT' || currentStatus === 'IZIN') && (
                            <div className="w-full sm:w-48">
                              <input
                                type="text"
                                value={currentNote}
                                onChange={(e) => handleSetStudentNote(s.id, e.target.value)}
                                placeholder="Ket: sakit flu, izin dinas..."
                                className="w-full px-2.5 py-1 rounded-xl neu-inset text-[11px] text-[#1F3A5F] focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ---------------- TAB 3: UBAH JADWAL PELAJARAN ---------------- */}
              {activeTab === 'JADWAL' && (
                <div className="space-y-4">
                  {/* Action Header */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#1C5FE0]" />
                        <span>Kelola &amp; Ubah Jadwal Pelajaran</span>
                      </h4>
                      <p className="text-xs text-[#5C6F84]">
                        Tambah, edit, hapus jam pelajaran per hari (Senin s/d Sabtu)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetLessons}
                        className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#5C6F84] hover:text-[#1F3A5F] flex items-center gap-1"
                        title="Kembalikan ke jadwal standar"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Bawaan</span>
                      </button>

                      <button
                        onClick={handleOpenAddLesson}
                        className="neu-btn-active bg-[#1C5FE0] text-white px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Pelajaran</span>
                      </button>
                    </div>
                  </div>

                  {/* Day Filter Pills */}
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    {days.map((d) => (
                      <button
                        key={d}
                        onClick={() => setScheduleDayFilter(d)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap ${
                          scheduleDayFilter === d
                            ? 'neu-btn-active bg-[#1F3A5F] text-white'
                            : 'neu-btn text-[#5C6F84]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Add / Edit Lesson Form Modal/Card */}
                  {(isAddingLesson || editingLessonIdx !== null) && (
                    <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-blue-300 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between pb-2 border-b border-[#C4CAE0]/40">
                        <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1C5FE0]">
                          {editingLessonIdx !== null
                            ? 'Edit Jam Pelajaran'
                            : 'Tambah Jam Pelajaran Baru'}
                        </h5>
                        <button
                          onClick={() => {
                            setIsAddingLesson(false);
                            setEditingLessonIdx(null);
                          }}
                          className="w-6 h-6 rounded-full neu-btn flex items-center justify-center text-xs"
                        >
                          &times;
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Hari
                          </label>
                          <select
                            value={lessonForm.day}
                            onChange={(e) => setLessonForm({ ...lessonForm, day: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                          >
                            {picketDays.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Waktu / Jam
                          </label>
                          <input
                            type="text"
                            placeholder="07:30 - 09:00"
                            value={lessonForm.time}
                            onChange={(e) => setLessonForm({ ...lessonForm, time: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1C5FE0]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Mata Pelajaran
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Matematika Terapan"
                            value={lessonForm.subject}
                            onChange={(e) =>
                              setLessonForm({ ...lessonForm, subject: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Guru Pengampu
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Drs. Bambang Sudarsono"
                            value={lessonForm.teacher}
                            onChange={(e) =>
                              setLessonForm({ ...lessonForm, teacher: e.target.value })
                            }
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                            Ruang Kelas / Lokasi
                          </label>
                          <input
                            type="text"
                            placeholder="Ruang IX-H / Lab Komputer"
                            value={lessonForm.room}
                            onChange={(e) => setLessonForm({ ...lessonForm, room: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setIsAddingLesson(false);
                            setEditingLessonIdx(null);
                          }}
                          className="px-4 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#5C6F84]"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleSaveLesson}
                          className="px-5 py-1.5 rounded-xl bg-[#1C5FE0] text-white text-xs font-heading font-bold shadow-md"
                        >
                          {editingLessonIdx !== null ? 'Simpan Perubahan' : 'Tambahkan ke Jadwal'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lessons List by Selected Day Filter */}
                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                    {filteredLessons.map((lesson, idx) => {
                      // Find real index in lessons array for deletion / editing
                      const realIndex = lessons.indexOf(lesson);

                      return (
                        <div
                          key={idx}
                          className="neu-flat rounded-2xl p-3.5 bg-[#E7EBF5] border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="px-2.5 py-1 rounded-xl bg-[#1C5FE0]/10 text-[#1C5FE0] font-heading font-bold text-xs flex-shrink-0">
                              {lesson.day}
                            </span>
                            <div className="min-w-0">
                              <h5 className="font-heading font-bold text-sm text-[#1F3A5F] truncate">
                                {lesson.subject}
                              </h5>
                              <div className="text-xs text-[#5C6F84] flex items-center gap-2 mt-0.5">
                                <span className="font-semibold text-[#1C5FE0] flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {lesson.time}
                                </span>
                                <span>&bull;</span>
                                <span>{lesson.teacher}</span>
                                <span>&bull;</span>
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3 text-[#5C6F84]" /> {lesson.room}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => handleOpenEditLesson(realIndex)}
                              className="p-1.5 rounded-lg neu-btn text-[#1C5FE0]"
                              title="Edit Jadwal"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(realIndex)}
                              className="p-1.5 rounded-lg neu-btn text-rose-500 hover:text-rose-700"
                              title="Hapus Jadwal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ---------------- TAB 4: KELOLA PIKET KEBERSIHAN ---------------- */}
              {activeTab === 'PIKET' && (
                <div className="space-y-4">
                  {/* Header & Reset */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#1C5FE0]" />
                        <span>Kelola Anggota &amp; Tugas Piket</span>
                      </h4>
                      <p className="text-xs text-[#5C6F84]">
                        Atur siswa piket harian dan rincian tugas piket Senin - Sabtu
                      </p>
                    </div>

                    <button
                      onClick={handleResetPicketDuties}
                      className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#5C6F84] hover:text-[#1F3A5F] flex items-center gap-1 self-start sm:self-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Piket Bawaan</span>
                    </button>
                  </div>

                  {/* Day Selector */}
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    {picketDays.map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedPicketDay(d)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-heading font-bold transition-all whitespace-nowrap ${
                          selectedPicketDay === d
                            ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-sm'
                            : 'neu-btn text-[#5C6F84]'
                        }`}
                      >
                        Piket {d}
                      </button>
                    ))}
                  </div>

                  {/* Assigned Students for Selected Day */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                        Petugas Piket Hari {selectedPicketDay} ({currentPicketGroup.studentIds.length} Siswa)
                      </h5>
                    </div>

                    {/* Member chips */}
                    <div className="flex flex-wrap gap-2">
                      {currentPicketGroup.studentIds.map((sid) => {
                        const s = students.find((item) => item.id === sid);
                        if (!s) return null;
                        return (
                          <div
                            key={sid}
                            className="neu-flat-sm rounded-xl px-3 py-1.5 bg-[#E7EBF5] border border-white/80 flex items-center gap-2 text-xs"
                          >
                            <span className="font-bold text-[#1C5FE0]">#{s.id}</span>
                            <span className="font-medium text-[#1F3A5F]">{s.nickname || s.name}</span>
                            <button
                              onClick={() => handleRemoveStudentFromPicket(sid)}
                              className="w-4 h-4 rounded-full text-rose-500 hover:bg-rose-100 flex items-center justify-center font-bold text-xs ml-1"
                              title="Keluarkan dari piket"
                            >
                              &times;
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add student dropdown */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#C4CAE0]/40">
                      <select
                        value={newPicketStudentId}
                        onChange={(e) =>
                          setNewPicketStudentId(e.target.value ? Number(e.target.value) : '')
                        }
                        className="flex-1 px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                      >
                        <option value="">-- Pilih Siswa untuk Ditambahkan ke Piket --</option>
                        {studentsAvailableForPicket.map((s) => (
                          <option key={s.id} value={s.id}>
                            #{s.id} {s.name} ({s.gender === 'L' ? 'L' : 'P'})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddStudentToPicket}
                        disabled={!newPicketStudentId}
                        className="px-4 py-1.5 rounded-xl bg-[#1C5FE0] disabled:opacity-50 text-white text-xs font-heading font-bold shadow-sm flex items-center gap-1 whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Petugas</span>
                      </button>
                    </div>
                  </div>

                  {/* Tasks for Selected Day */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 space-y-3">
                    <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                      Daftar Tugas Piket Hari {selectedPicketDay}
                    </h5>

                    <div className="space-y-1.5">
                      {currentPicketGroup.tasks.map((task, tidx) => (
                        <div
                          key={tidx}
                          className="neu-flat-sm rounded-xl px-3 py-2 bg-[#E7EBF5] flex items-center justify-between text-xs"
                        >
                          <span className="text-[#1F3A5F]">{task}</span>
                          <button
                            onClick={() => handleDeleteTaskFromPicket(tidx)}
                            className="p-1 text-rose-500 hover:text-rose-700 rounded-lg"
                            title="Hapus tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#C4CAE0]/40">
                      <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTaskToPicket()}
                        placeholder="Contoh: Bersihkan kaca jendela dan siram pot bunga..."
                        className="flex-1 px-3 py-1.5 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F]"
                      />
                      <button
                        onClick={handleAddTaskToPicket}
                        className="px-4 py-1.5 rounded-xl neu-btn-active bg-[#1C5FE0] text-white text-xs font-heading font-bold whitespace-nowrap"
                      >
                        Tambah Tugas
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- TAB 5: KAS & KEUANGAN ---------------- */}
              {activeTab === 'KAS' && (
                <div className="space-y-4">
                  {/* Tarif Kas Card */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                        Tarif Iuran Kas Harian Kelas
                      </h4>
                      <p className="text-xs text-[#5C6F84]">
                        Nominal wajib yang disetorkan setiap siswa per hari aktif
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1F3A5F]">Rp</span>
                      <input
                        type="number"
                        step={500}
                        value={nominalKas}
                        onChange={(e) => onUpdateNominalKas(Number(e.target.value))}
                        className="w-28 px-3 py-1.5 rounded-xl neu-inset font-heading font-bold text-sm text-[#1C5FE0]"
                      />
                      <button
                        onClick={() => showSuccessNotification('Tarif kas berhasil diperbarui!')}
                        className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#1C5FE0]"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>

                  {/* Add Manual Transaction */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 space-y-3">
                    <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                      Catat Transaksi Manual Baru
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                          Tipe Transaksi
                        </label>
                        <select
                          value={newTxType}
                          onChange={(e) => setNewTxType(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                        >
                          <option value="PEMASUKAN">Pemasukan (+)</option>
                          <option value="PENGELUARAN">Pengeluaran (-)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                          Nominal (Rp)
                        </label>
                        <input
                          type="text"
                          value={newTxAmount}
                          onChange={(e) => setNewTxAmount(e.target.value)}
                          placeholder="50000"
                          className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                          Kategori
                        </label>
                        <input
                          type="text"
                          value={newTxCategory}
                          onChange={(e) => setNewTxCategory(e.target.value)}
                          placeholder="Alat Tulis / Iuran"
                          className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                          Deskripsi
                        </label>
                        <input
                          type="text"
                          value={newTxDesc}
                          onChange={(e) => setNewTxDesc(e.target.value)}
                          placeholder="Beli sapu & tinta..."
                          className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={handleCreateTransaction}
                        className="px-5 py-2 rounded-xl bg-[#1C5FE0] text-white text-xs font-heading font-bold shadow-md"
                      >
                        Simpan Transaksi Kas
                      </button>
                    </div>
                  </div>

                  {/* Transactions History */}
                  <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70 space-y-3">
                    <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                      Riwayat Pembukuan ({transactions.length} Transaksi)
                    </h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="neu-flat-sm rounded-xl p-3 bg-[#E7EBF5] flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-heading font-bold text-[#1F3A5F]">
                              {tx.description}
                            </div>
                            <div className="text-[10px] text-[#5C6F84]">
                              {tx.date} &bull; {tx.category} &bull; Dicatat: {tx.recordedBy}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-heading font-bold ${
                                tx.type === 'PEMASUKAN' ? 'text-[#10B981]' : 'text-rose-500'
                              }`}
                            >
                              {tx.type === 'PEMASUKAN' ? '+' : '-'} Rp{' '}
                              {tx.amount.toLocaleString('id-ID')}
                            </span>
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="p-1 rounded-lg text-[#8B9BB0] hover:text-rose-500"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- TAB MATERI: BUKU & MATERI ---------------- */}
              {activeTab === 'MATERI' && (
                <div className="space-y-4">
                  <div className="neu-flat rounded-2xl p-5 bg-[#E7EBF5] border border-white/70 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C4CAE0]/40 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-base text-[#1F3A5F]">
                            Kelola Buku Paket &amp; Materi Pembelajaran
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1C5FE0]/15 text-[#1C5FE0]">
                            {materials.length} Item
                          </span>
                        </div>
                        <p className="text-xs text-[#5C6F84] mt-0.5">
                          Tambah buku BSE Kemdikbud, modul, tautan file, dan rangkuman untuk siswa kelas IX-H
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAddingMaterial(!isAddingMaterial)}
                        className="neu-btn-active bg-[#1C5FE0] text-white px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isAddingMaterial ? 'Tutup Formulir' : '+ Tambah Buku / Materi'}</span>
                      </button>
                    </div>

                    {/* Form Tambah Materi Baru */}
                    {isAddingMaterial && (
                      <div className="neu-inset-deep rounded-2xl p-4 bg-[#DCE2EF]/80 space-y-3.5 border border-white/60 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#1C5FE0] flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            Formulir Tambah Buku / Materi Baru
                          </span>
                          <span className="text-[10px] text-[#5C6F84]">Wajib isi judul &amp; mapel</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-[#5C6F84] block mb-1">
                              Judul Buku / Materi <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newMaterialForm.title}
                              onChange={(e) => setNewMaterialForm({ ...newMaterialForm, title: e.target.value })}
                              placeholder="contoh: Buku Paket Matematika Kelas IX"
                              className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#5C6F84] block mb-1">
                              Mata Pelajaran <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newMaterialForm.subject}
                              onChange={(e) => setNewMaterialForm({ ...newMaterialForm, subject: e.target.value })}
                              placeholder="contoh: Matematika, IPA, Bahasa Indonesia..."
                              className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#5C6F84] block mb-1">
                              Kategori / Tipe Materi
                            </label>
                            <select
                              value={newMaterialForm.type}
                              onChange={(e) => setNewMaterialForm({ ...newMaterialForm, type: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F] focus:outline-none"
                            >
                              <option value="BUKU_PAKET">Buku Paket Resmi (BSE)</option>
                              <option value="MODUL">Modul Pembelajaran</option>
                              <option value="TUGAS">Tugas &amp; Lembar Kerja (LKPD)</option>
                              <option value="CATATAN">Rangkuman / Catatan Materi</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#5C6F84] block mb-1">
                              Penulis / Guru Pengampu
                            </label>
                            <input
                              type="text"
                              value={newMaterialForm.author}
                              onChange={(e) => setNewMaterialForm({ ...newMaterialForm, author: e.target.value })}
                              placeholder="contoh: Kemendikbudristek / Ibu Sri Rahayu, S.Pd"
                              className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-[#5C6F84] block mb-1">
                              Tautan / Link File Buku (PDF / Drive / Web)
                            </label>
                            <input
                              type="text"
                              value={newMaterialForm.fileUrl}
                              onChange={(e) => setNewMaterialForm({ ...newMaterialForm, fileUrl: e.target.value })}
                              placeholder="contoh: https://buku.kemdikbud.go.id/katalog/buku-matematika-kelas-9"
                              className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1C5FE0] focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] font-bold text-[#5C6F84] block mb-1">
                                Jenjang / Kelas
                              </label>
                              <input
                                type="text"
                                value={newMaterialForm.grade}
                                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, grade: e.target.value })}
                                placeholder="Kelas 9"
                                className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-[#5C6F84] block mb-1">
                                Ukuran File
                              </label>
                              <input
                                type="text"
                                value={newMaterialForm.fileSize}
                                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, fileSize: e.target.value })}
                                placeholder="5.4 MB"
                                className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#5C6F84] block mb-1">
                            Deskripsi Ringkas / Petunjuk Belajar
                          </label>
                          <textarea
                            rows={2}
                            value={newMaterialForm.description}
                            onChange={(e) => setNewMaterialForm({ ...newMaterialForm, description: e.target.value })}
                            placeholder="Tuliskan petunjuk bab, materi penting, atau kompetensi dasar yang dipelajari..."
                            className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F] focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsAddingMaterial(false)}
                            className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-[#5C6F84]"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleCreateMaterial}
                            className="px-5 py-2 rounded-xl bg-[#10B981] text-white font-heading font-bold text-xs shadow-md hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Simpan Buku / Materi</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
                      <div className="w-full sm:w-72 neu-inset rounded-xl p-2 flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-[#5C6F84] ml-1" />
                        <input
                          type="text"
                          value={materialSearch}
                          onChange={(e) => setMaterialSearch(e.target.value)}
                          placeholder="Cari judul, mapel, atau guru..."
                          className="w-full bg-transparent text-xs text-[#1F3A5F] focus:outline-none font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
                        {[
                          { id: 'ALL', label: 'Semua' },
                          { id: 'BUKU_PAKET', label: 'Buku Paket' },
                          { id: 'MODUL', label: 'Modul' },
                          { id: 'TUGAS', label: 'Tugas' },
                          { id: 'CATATAN', label: 'Catatan' },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setMaterialTypeFilter(btn.id as any)}
                            className={`px-3 py-1 rounded-xl text-[11px] font-heading font-bold whitespace-nowrap transition-all ${
                              materialTypeFilter === btn.id
                                ? 'neu-btn-active bg-[#1F3A5F] text-white'
                                : 'neu-btn text-[#5C6F84] hover:text-[#1F3A5F]'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* List Existing Materials */}
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {filteredMaterials.length === 0 ? (
                        <div className="text-center py-8 text-[#5C6F84] neu-inset rounded-2xl p-6">
                          <BookOpen className="w-8 h-8 mx-auto text-[#8B9BB0] mb-2" />
                          <p className="text-xs font-bold">Tidak ada materi yang sesuai pencarian.</p>
                          <button
                            onClick={() => setIsAddingMaterial(true)}
                            className="mt-2 text-xs text-[#1C5FE0] font-bold hover:underline"
                          >
                            + Tambahkan Buku / Materi Sekarang
                          </button>
                        </div>
                      ) : (
                        filteredMaterials.map((mat) => {
                          const typeBadgeColor =
                            mat.type === 'BUKU_PAKET'
                              ? 'bg-blue-500/15 text-blue-600'
                              : mat.type === 'MODUL'
                              ? 'bg-emerald-500/15 text-emerald-600'
                              : mat.type === 'TUGAS'
                              ? 'bg-rose-500/15 text-rose-600'
                              : 'bg-amber-500/15 text-amber-600';
                          const typeLabel =
                            mat.type === 'BUKU_PAKET'
                              ? 'Buku Paket'
                              : mat.type === 'MODUL'
                              ? 'Modul'
                              : mat.type === 'TUGAS'
                              ? 'Tugas'
                              : 'Catatan';

                          return (
                            <div
                              key={mat.id}
                              className="neu-flat rounded-2xl p-3.5 bg-[#E7EBF5] border border-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full ${typeBadgeColor}`}>
                                    {typeLabel}
                                  </span>
                                  <span className="text-[11px] font-bold text-[#1C5FE0]">
                                    {mat.subject}
                                  </span>
                                  <span className="text-[10px] text-[#8C9BAE]">
                                    &bull; {mat.grade} &bull; {mat.fileSize || 'PDF'}
                                  </span>
                                </div>
                                <h5 className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] truncate">
                                  {mat.title}
                                </h5>
                                <p className="text-[11px] text-[#5C6F84] line-clamp-1">
                                  {mat.description}
                                </p>
                                <div className="text-[10px] text-[#8B9BB0]">
                                  Oleh: <strong className="text-[#5C6F84]">{mat.author}</strong> &bull; Diunggah: {mat.uploadedAt}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                <a
                                  href={mat.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="neu-btn px-3 py-1.5 rounded-xl text-[11px] font-heading font-bold text-[#1C5FE0] hover:text-blue-700 flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Buka Link</span>
                                </a>
                                <button
                                  onClick={() => handleDeleteMaterial(mat.id)}
                                  className="neu-btn p-1.5 rounded-xl text-[#8B9BB0] hover:text-rose-600 hover:bg-rose-50"
                                  title="Hapus Materi"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- TAB: BANK SOAL TKA ---------------- */}
              {activeTab === 'SOAL_TKA' && (
                <div className="p-4 sm:p-5 overflow-y-auto">
                  <AdminTkaManagerView
                    onLogActivity={(action, details, category) =>
                      logActivity(action, details, (category as any) || 'MATERI')
                    }
                  />
                </div>
              )}

              {/* ---------------- TAB 6: PENGATURAN IDENTITAS ---------------- */}
              {activeTab === 'PENGATURAN' && (
                <div className="space-y-4">
                  <div className="neu-flat rounded-2xl p-5 bg-[#E7EBF5] border border-white/70 space-y-4">
                    <h4 className="font-heading font-bold text-sm text-[#1F3A5F] border-b border-[#C4CAE0]/40 pb-2">
                      Identitas Kelas &amp; Wali Kelas
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#5C6F84] block mb-1">
                          Nama Kelas
                        </label>
                        <input
                          type="text"
                          value={classInfo.name}
                          onChange={(e) => setClassInfo({ ...classInfo, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#5C6F84] block mb-1">
                          Nama Wali Kelas
                        </label>
                        <input
                          type="text"
                          value={classInfo.waliKelas}
                          onChange={(e) =>
                            setClassInfo({ ...classInfo, waliKelas: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#5C6F84] block mb-1">
                          Mata Pelajaran Wali Kelas
                        </label>
                        <input
                          type="text"
                          value={classInfo.waliKelasSubject}
                          onChange={(e) =>
                            setClassInfo({ ...classInfo, waliKelasSubject: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#5C6F84] block mb-1">
                          Slogan / Motto Kelas
                        </label>
                        <input
                          type="text"
                          value={classInfo.motto}
                          onChange={(e) => setClassInfo({ ...classInfo, motto: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F]"
                        />
                      </div>
                    </div>

                    {/* Foto Profil Wali Kelas */}
                    <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white dark:border-slate-700/60 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#1F3A5F] dark:text-white flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-[#1C5FE0]" />
                          Foto Profil Wali Kelas
                        </label>
                        <button
                          type="button"
                          onClick={() => setClassInfo(prev => ({ ...prev, waliKelasAvatarUrl: DEFAULT_WALI_KELAS.avatarUrl }))}
                          className="text-[10px] font-bold text-[#5C6F84] hover:text-[#1C5FE0] flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Reset Foto Default</span>
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="relative group/avatar flex-shrink-0">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-md">
                            <img
                              src={classInfo.waliKelasAvatarUrl}
                              alt="Wali Kelas"
                              className="w-full h-full object-cover rounded-xl"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_WALI_KELAS.avatarUrl;
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => waliFileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#1C5FE0] text-white shadow hover:bg-blue-600 cursor-pointer"
                            title="Unggah Foto Baru"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <input
                            type="file"
                            ref={waliFileInputRef}
                            accept="image/*"
                            onChange={handleWaliFileChange}
                            className="hidden"
                          />
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="Atau tempel URL gambar (https://...)"
                              value={classInfo.waliKelasAvatarUrl}
                              onChange={(e) => setClassInfo(prev => ({ ...prev, waliKelasAvatarUrl: e.target.value }))}
                              className="flex-1 px-3 py-2 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F] dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => waliFileInputRef.current?.click()}
                              className="px-3 py-2 rounded-xl neu-btn text-xs font-bold text-[#1C5FE0] hover:bg-blue-50 flex items-center gap-1 cursor-pointer flex-shrink-0"
                            >
                              <Upload className="w-3 h-3" />
                              <span className="hidden sm:inline">Pilih File</span>
                            </button>
                          </div>

                          {/* Preset Avatars */}
                          <div>
                            <span className="text-[10px] font-bold text-[#5C6F84] block mb-1">
                              Pilihan Cepat Foto Pendidik:
                            </span>
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                              {PRESET_WALI_AVATARS.slice(0, 5).map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setClassInfo(prev => ({ ...prev, waliKelasAvatarUrl: preset.url }))}
                                  className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                                    classInfo.waliKelasAvatarUrl === preset.url
                                      ? 'border-[#1C5FE0] scale-110 shadow'
                                      : 'border-transparent opacity-70 hover:opacity-100'
                                  }`}
                                  title={preset.title}
                                >
                                  <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#C4CAE0]/40">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h5 className="font-heading font-bold text-xs text-[#1F3A5F] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#1C5FE0]" />
                          <span>Daftar Target Hitung Mundur Kelas</span>
                        </h5>
                        <button
                          type="button"
                          onClick={handleOpenAddCountdown}
                          className="px-3 py-1.5 rounded-xl bg-[#1C5FE0] hover:bg-[#154bb3] text-white text-xs font-heading font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Target</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {countdownList.map((evt) => (
                          <div
                            key={evt.id}
                            className="p-3 rounded-2xl neu-inset flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full bg-[#1C5FE0]/15 text-[#1C5FE0]">
                                  {evt.category || 'Target'}
                                </span>
                                <span className="text-xs font-bold text-[#1F3A5F]">
                                  {evt.title}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleActiveCountdown(evt.id)}
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-all ${
                                    evt.active
                                      ? 'bg-emerald-500/15 text-emerald-700'
                                      : 'bg-slate-400/20 text-[#5C6F84]'
                                  }`}
                                  title="Klik untuk aktifkan/nonaktifkan"
                                >
                                  {evt.active ? 'Aktif di Beranda' : 'Nonaktif'}
                                </button>
                              </div>
                              <p className="text-[11px] text-[#5C6F84] truncate">
                                Target: <strong>{new Date(evt.targetDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</strong>
                                {evt.description ? ` &bull; ${evt.description}` : ''}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCountdown(evt)}
                                className="px-2.5 py-1 rounded-lg neu-btn text-[11px] font-bold text-[#1F3A5F] hover:text-[#1C5FE0]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCountdown(evt.id)}
                                className="px-2.5 py-1 rounded-lg neu-btn text-[11px] font-bold text-red-600 hover:bg-red-500/10"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-[11px] text-[#5C6F84] mt-2">
                        * Target yang berstatus aktif akan muncul di kartu hitung mundur beranda. Siswa dapat berpindah target langsung dari kartu.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#C4CAE0]/40">
                      <h5 className="font-heading font-bold text-xs text-[#1F3A5F] mb-3">
                        Ganti Kode Keamanan / PIN
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-[#5C6F84] block mb-1">
                            PIN Master Admin Baru
                          </label>
                          <input
                            type="password"
                            value={newAdminPin}
                            onChange={(e) => setNewAdminPin(e.target.value)}
                            placeholder="Kosongkan jika tidak diubah"
                            className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-bold tracking-widest text-[#1F3A5F]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#5C6F84] block mb-1">
                            PIN Uang Kas / Bendahara Baru
                          </label>
                          <input
                            type="password"
                            value={newKasPin}
                            onChange={(e) => setNewKasPin(e.target.value)}
                            placeholder="Kosongkan jika tidak diubah"
                            className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-bold tracking-widest text-[#1F3A5F]"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-[#5C6F84] mt-2">
                        * PIN disimpan realtime di Firestore. Jika field dikosongkan, PIN saat ini tetap berlaku.
                      </p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveClassSettings}
                        disabled={isSavingSettings}
                        className="px-6 py-2.5 rounded-xl bg-[#1C5FE0] text-white font-heading font-bold text-xs shadow-md active:scale-95 disabled:opacity-50 transition-all"
                      >
                        {isSavingSettings ? 'Menyimpan...' : 'Simpan Perubahan ke Firestore'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- TAB 7: LAPORAN & EKSPOR ---------------- */}
              {activeTab === 'LAPORAN' && (
                <div className="space-y-4">
                  <div className="neu-flat rounded-2xl p-5 bg-[#E7EBF5] border border-white/70 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                          Ekspor &amp; Backup Administrasi Resmi
                        </h4>
                        <p className="text-xs text-[#5C6F84]">
                          Format laporan resmi untuk Wali Kelas, Sekolah, maupun arsip cadangan (PDF, Excel, JSON)
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* WhatsApp text copy */}
                        <button
                          onClick={handleCopyReport}
                          className="neu-btn px-3 py-2 rounded-xl text-xs font-heading font-bold text-[#1C5FE0] flex items-center gap-1.5"
                          title="Salin rekap teks untuk WhatsApp"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedReport ? 'Tersalin!' : 'Salin WhatsApp'}</span>
                        </button>

                        {/* Export PDF button */}
                        <button
                          onClick={handleExportPDF}
                          className="neu-btn px-3 py-2 rounded-xl text-xs font-heading font-bold text-[#E11D48] flex items-center gap-1.5"
                          title="Unduh Laporan Format PDF Resmi"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ekspor PDF</span>
                        </button>

                        {/* Export Excel button */}
                        <button
                          onClick={handleExportExcel}
                          className="neu-btn px-3 py-2 rounded-xl text-xs font-heading font-bold text-[#059669] flex items-center gap-1.5"
                          title="Unduh Rekap Format Microsoft Excel (.xlsx)"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Ekspor Excel (.xlsx)</span>
                        </button>

                        {/* Backup JSON button */}
                        <button
                          onClick={handleDownloadBackup}
                          className="neu-btn px-3 py-2 rounded-xl text-xs font-heading font-bold text-[#1F3A5F] flex items-center gap-1.5"
                          title="Unduh file arsip cadangan JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Backup JSON</span>
                        </button>

                        {/* Restore JSON button */}
                        <label
                          className={`cursor-pointer neu-btn-active bg-[#1C5FE0] text-white px-3.5 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#1550c0] transition-colors ${
                            isRestoring ? 'opacity-50 pointer-events-none' : ''
                          }`}
                          title="Pulihkan seluruh data dari file arsip cadangan .json"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isRestoring ? 'Memulihkan...' : 'Restore Backup'}</span>
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleRestoreBackupFile}
                            disabled={isRestoring}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Report Preview */}
                    <div className="neu-inset-deep rounded-2xl p-4 bg-[#DCE2EF] text-[#1F3A5F] font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto border border-white/40">
                      {generateOfficialReport()}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'LOG' && (
                <div className="space-y-4">
                  {/* Header Card */}
                  <div className="neu-flat rounded-2xl p-5 bg-[#E7EBF5] border border-white/70">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-2">
                          <History className="w-4 h-4 text-[#1C5FE0]" />
                          Log &amp; Audit Trail Aktivitas Admin
                        </h4>
                        <p className="text-xs text-[#5C6F84]">
                          Pencatatan riwayat perubahan data kelas secara transparan &amp; realtime
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm('Bersihkan seluruh riwayat log aktivitas admin?')) {
                              setActivityLogs([]);
                              try {
                                localStorage.removeItem('ixh_admin_activity_logs');
                              } catch {
                                // ignore
                              }
                              showSuccessNotification('Riwayat log berhasil dibersihkan.');
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl neu-btn text-xs font-heading font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Log</span>
                        </button>
                      </div>
                    </div>

                    {/* Search & Category Filter */}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6F84]" />
                        <input
                          type="text"
                          value={logSearch}
                          onChange={(e) => setLogSearch(e.target.value)}
                          placeholder="Cari aksi, detail perubahan, atau waktu..."
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl neu-inset text-xs text-[#1F3A5F] focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                        {['ALL', 'SISWA', 'KAS', 'JADWAL', 'PIKET', 'ABSENSI', 'PENGATURAN'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setLogFilterCategory(cat)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold whitespace-nowrap transition-all ${
                              logFilterCategory === cat
                                ? 'bg-[#1C5FE0] text-white shadow-sm'
                                : 'neu-btn text-[#5C6F84]'
                            }`}
                          >
                            {cat === 'ALL' ? 'Semua' : cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Log List */}
                  <div className="space-y-2.5">
                    {activityLogs
                      .filter((item) => {
                        const matchCat =
                          logFilterCategory === 'ALL' || item.category === logFilterCategory;
                        const matchSearch =
                          !logSearch.trim() ||
                          item.action.toLowerCase().includes(logSearch.toLowerCase()) ||
                          item.details.toLowerCase().includes(logSearch.toLowerCase()) ||
                          item.timestamp.toLowerCase().includes(logSearch.toLowerCase());
                        return matchCat && matchSearch;
                      })
                      .map((log) => {
                        const categoryColor =
                          log.category === 'SISWA'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : log.category === 'KAS'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : log.category === 'JADWAL'
                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                            : log.category === 'PIKET'
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : log.category === 'ABSENSI'
                            ? 'bg-teal-100 text-teal-700 border-teal-200'
                            : 'bg-indigo-100 text-indigo-700 border-indigo-200';

                        return (
                          <div
                            key={log.id}
                            className="neu-flat-sm rounded-2xl p-3.5 bg-[#E7EBF5] border border-white/60 flex items-start justify-between gap-3 transition-all hover:bg-white/40"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-heading font-bold border ${categoryColor}`}
                                >
                                  {log.category}
                                </span>
                                <span className="font-heading font-bold text-xs text-[#1F3A5F]">
                                  {log.action}
                                </span>
                                <span className="text-[10px] text-[#5C6F84] bg-white/50 px-1.5 py-0.5 rounded">
                                  Oleh: {log.actor}
                                </span>
                              </div>
                              <p className="text-xs text-[#334D6E] leading-relaxed">
                                {log.details}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-[#5C6F84] whitespace-nowrap pt-0.5">
                              <Clock className="w-3 h-3 text-[#5C6F84]" />
                              <span>{log.timestamp}</span>
                            </div>
                          </div>
                        );
                      })}

                    {activityLogs.length === 0 && (
                      <div className="neu-inset rounded-2xl p-8 text-center text-[#5C6F84]">
                        <p className="text-xs">Belum ada riwayat aktivitas yang dicatat.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

        {/* Edit Student Modal Overlay */}
        {editingStudent && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
            <div className="neu-flat-lg rounded-3xl p-5 bg-[#E7EBF5] max-w-md w-full border border-white/80 space-y-3.5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#C4CAE0]/40 pb-2">
                <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                  Edit Data Siswa #{editingStudent.id}
                </h4>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="w-7 h-7 rounded-full neu-btn flex items-center justify-center text-xs"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-[#5C6F84] block mb-0.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#5C6F84] block mb-0.5">
                      Nama Panggilan
                    </label>
                    <input
                      type="text"
                      value={editingStudent.nickname}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, nickname: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#5C6F84] block mb-0.5">
                      Gender
                    </label>
                    <select
                      value={editingStudent.gender}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, gender: e.target.value as Gender })
                      }
                      className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                    >
                      <option value="L">L (Putra)</option>
                      <option value="P">P (Putri)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#5C6F84] block mb-0.5">
                      Jabatan / Role
                    </label>
                    <select
                      value={editingStudent.role}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, role: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    >
                      <option value="Anggota">Anggota</option>
                      <option value="Ketua Kelas">Ketua Kelas</option>
                      <option value="Wakil Ketua">Wakil Ketua</option>
                      <option value="Bendahara 1">Bendahara 1</option>
                      <option value="Bendahara 2">Bendahara 2</option>
                      <option value="Sekretaris 1">Sekretaris 1</option>
                      <option value="Sekretaris 2">Sekretaris 2</option>
                      <option value="Seksi Kebersihan">Seksi Kebersihan</option>
                      <option value="Seksi Keamanan">Seksi Keamanan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#5C6F84] block mb-0.5">
                      PIN Rahasia (4 Digit)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={editingStudent.pin}
                      onChange={(e) => setEditingStudent({ ...editingStudent, pin: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold tracking-wider text-[#1F3A5F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5C6F84] block mb-0.5">
                    Target SMA / SMK Impian
                  </label>
                  <input
                    type="text"
                    value={editingStudent.dreamSchool}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, dreamSchool: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5C6F84] block mb-0.5">
                    Cita-cita / Bio
                  </label>
                  <textarea
                    rows={2}
                    value={editingStudent.bio}
                    onChange={(e) => setEditingStudent({ ...editingStudent, bio: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#C4CAE0]/40">
                <button
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#5C6F84]"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEditStudent}
                  className="px-5 py-1.5 rounded-xl bg-[#1C5FE0] text-white text-xs font-heading font-bold shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Countdown Form Modal */}
        {showCountdownModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
            <div className="neu-flat-lg rounded-3xl p-5 bg-[#E7EBF5] max-w-md w-full border border-white/80 space-y-3.5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#C4CAE0]/40 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                    {editingCountdownId ? 'Edit Target Hitung Mundur' : 'Tambah Target Hitung Mundur'}
                  </h4>
                </div>
                <button
                  onClick={() => setShowCountdownModal(false)}
                  className="w-7 h-7 rounded-full neu-btn flex items-center justify-center text-xs text-[#5C6F84]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCountdownForm} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#1F3A5F] block mb-1">
                    Judul Acara / Target <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={countdownForm.title}
                    onChange={(e) => setCountdownForm({ ...countdownForm, title: e.target.value })}
                    placeholder="Contoh: Try Out Ujian Sekolah Tahap 1"
                    className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#5C6F84] block mb-1">Tanggal Acara</label>
                    <input
                      type="date"
                      required
                      value={countdownForm.targetDate}
                      onChange={(e) => setCountdownForm({ ...countdownForm, targetDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#5C6F84] block mb-1">Kategori</label>
                    <select
                      value={countdownForm.category}
                      onChange={(e) => setCountdownForm({ ...countdownForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    >
                      <option value="Ujian">Ujian</option>
                      <option value="Wisuda">Wisuda</option>
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Liburan">Liburan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#5C6F84] block mb-1">
                    Deskripsi Singkat / Keterangan
                  </label>
                  <textarea
                    rows={2}
                    value={countdownForm.description}
                    onChange={(e) => setCountdownForm({ ...countdownForm, description: e.target.value })}
                    placeholder="Contoh: Seluruh siswa hadir pukul 07.00 WIB membawa seragam rapi"
                    className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="countdownActiveCheckbox"
                    checked={countdownForm.active}
                    onChange={(e) => setCountdownForm({ ...countdownForm, active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1C5FE0] focus:ring-0"
                  />
                  <label htmlFor="countdownActiveCheckbox" className="font-bold text-[#1F3A5F] cursor-pointer">
                    Aktifkan dan tampilkan di widget beranda
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#C4CAE0]/40">
                  <button
                    type="button"
                    onClick={() => setShowCountdownModal(false)}
                    className="px-4 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#5C6F84]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 rounded-xl bg-[#1C5FE0] hover:bg-[#154bb3] text-white text-xs font-heading font-bold shadow-md transition-all active:scale-95"
                  >
                    Simpan Target
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Sensitive Section PIN Modal Overlay */}
      {sensitivePinModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="neu-flat-lg rounded-3xl p-6 bg-[#E7EBF5] max-w-sm w-full border border-white/80 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl neu-flat flex items-center justify-center text-[#1C5FE0] mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-[#1F3A5F]">
                Autentikasi Modul Sensitif
              </h4>
              <p className="text-xs text-[#5C6F84] mt-1">
                Masukkan PIN Master Admin untuk mengakses modul ini
              </p>
            </div>

            <div className="w-full space-y-2">
              <input
                type="password"
                maxLength={6}
                value={sensitivePinInput}
                onChange={(e) => setSensitivePinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifySensitivePin()}
                placeholder="PIN Admin"
                autoFocus
                className="w-full px-4 py-2.5 rounded-2xl neu-inset text-center font-heading font-bold tracking-widest text-lg text-[#1F3A5F] focus:outline-none"
              />
              {sensitivePinError && (
                <p className="text-xs text-rose-500 font-semibold">{sensitivePinError}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSensitivePinModal({ isOpen: false, targetSection: null })}
                className="flex-1 py-2.5 rounded-2xl neu-btn text-xs font-heading font-bold text-[#5C6F84] hover:text-[#1F3A5F]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleVerifySensitivePin}
                className="flex-1 py-2.5 rounded-2xl bg-[#1C5FE0] text-white font-heading font-bold text-xs shadow-md hover:bg-blue-700 transition-colors"
              >
                Buka Modul
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminPanelModal = AdminDashboard;
export type { AdminDashboardProps as AdminPanelModalProps };

