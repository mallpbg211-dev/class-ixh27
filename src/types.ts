export type UserRole = 'SISWA' | 'BENDAHARA' | 'ADMIN';

export type Gender = 'L' | 'P';

export interface Student {
  id: number; // No. Absen 1 - 32
  name: string;
  nickname: string;
  gender: Gender;
  role: string; // 'Ketua Kelas', 'Wakil Ketua', 'Bendahara 1', 'Bendahara 2', 'Sekretaris 1', 'Sekretaris 2', 'Seksi Kebersihan', 'Seksi Keamanan', 'Anggota'
  pin: string; // 4-digit unique code
  dreamSchool: string;
  bio: string;
  avatarUrl?: string;
  photoUrl?: string;
}

export interface OfficerMember {
  name: string;
  role: string;
  nickname: string;
  gender: Gender;
  avatarUrl?: string;
}

export interface OrgStructure {
  waliKelas: {
    name: string;
    title: string;
    subject: string;
    avatarUrl?: string;
  };
  ketua: OfficerMember;
  wakilKetua: OfficerMember;
  sections: {
    id: string;
    name: string;
    icon: string;
    members: OfficerMember[];
  }[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Dokumentasi' | 'Kegiatan' | 'Prestasi' | 'Rapat';
  date: string;
  imageUrl: string;
  description: string;
}

export interface LessonItem {
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface PicketGroup {
  day: string;
  studentIds: number[];
  tasks: string[];
}

export interface StudentCashStatus {
  studentId: number;
  date: string;
  isPaid: boolean;
  amount: number;
  paidAt?: string;
  note?: string;
}

export interface CashTransaction {
  id: string;
  date: string;
  type: 'PEMASUKAN' | 'PENGELUARAN';
  amount: number;
  category: string;
  description: string;
  recordedBy: string;
}

export type AttendanceStatus = 'HADIR' | 'SAKIT' | 'IZIN' | 'ALPA';

export interface DailyAttendance {
  date: string; // YYYY-MM-DD
  records: Record<number, AttendanceStatus>; // studentId -> status
  notes?: Record<number, string>; // studentId -> optional note
  updatedAt?: string;
  recordedBy?: string;
}

export interface CountdownEvent {
  id: string;
  title: string;
  targetDate: string; // YYYY-MM-DDTHH:mm or YYYY-MM-DD
  description?: string;
  category?: 'Ujian' | 'Kelulusan' | 'Kegiatan' | 'Liburan';
  active: boolean;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  type: 'BUKU_PAKET' | 'TUGAS' | 'MODUL' | 'CATATAN';
  grade: string;
  fileUrl: string; // Direct PDF/document link or data URL
  fileSize?: string;
  description: string;
  uploadedAt: string;
  author: string;
}

export interface ClassMinutes {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  agenda: string;
  content: string; // Ringkasan hasil rapat / berita acara
  leader: string; // Pimpinan rapat
  notetaker: string; // Notulis
  attendeesCount?: number;
  decisions?: string[];
  createdAt: string;
}

export interface WaliKelasInfo {
  name: string;
  nip: string;
  subject: string;
  avatarUrl: string;
  greetingTitle?: string;
  greetingText?: string;
}

export interface ClassSettings {
  name: string;
  school: string;
  motto: string;
  waliKelas: string;
  waliKelasSubject: string;
  waliKelasAvatarUrl?: string;
}

export interface ClassConfig {
  name: string;
  waliKelas: string;
  waliKelasSubject: string;
  waliKelasAvatarUrl?: string;
  motto: string;
  adminPin: string;
  kasPin: string;
  examDate?: string; // YYYY-MM-DD
  graduationDate?: string; // YYYY-MM-DD
  countdownEvents?: CountdownEvent[];
  updatedAt?: string;
  createdAt?: string;
}

export type NavTab = 'home' | 'absensi' | 'jadwal' | 'kas' | 'tka' | 'materi' | 'game' | 'galeri';
