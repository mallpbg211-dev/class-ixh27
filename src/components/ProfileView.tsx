import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Target,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  School,
  Search,
  Filter,
  CheckCircle,
  Coins,
  FileText,
  Shield,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Info,
  BookOpen,
  Wallet,
  Lock,
  Camera,
  Crown,
  Zap,
  UserCheck,
} from 'lucide-react';
import { Student, UserRole, GalleryPhoto, NavTab, CountdownEvent, StudyMaterial, WaliKelasInfo, ClassConfig } from '../types';
import { CLASS_METADATA, ORG_STRUCTURE, GALLERY_PHOTOS, INITIAL_MATERIALS } from '../data/classData';
import { SambutanModal } from './SambutanModal';
import { VisiMisiModal } from './VisiMisiModal';
import { CountdownWidget } from './CountdownWidget';
import { EditWaliPhotoModal } from './EditWaliPhotoModal';
import { saveClassSettings, DEFAULT_CLASS_CONFIG } from '../lib/firebase';

interface ProfileViewProps {
  students: Student[];
  currentRole: UserRole;
  onSelectStudent: (student: Student) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenAdmin?: () => void;
  onChangeRole?: () => void;
  countdownEvents?: CountdownEvent[];
  isKasUnlocked?: boolean;
  materials?: StudyMaterial[];
  waliKelasInfo?: WaliKelasInfo;
  classConfig?: ClassConfig;
  onUpdateClassConfig?: (updated: ClassConfig) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  students,
  currentRole,
  onSelectStudent,
  onNavigateTab,
  onOpenAdmin,
  onChangeRole,
  countdownEvents,
  isKasUnlocked = false,
  materials,
  waliKelasInfo,
  classConfig,
  onUpdateClassConfig,
}) => {
  const waliName = classConfig?.waliKelas || waliKelasInfo?.name || ORG_STRUCTURE.waliKelas.name;
  const waliSubject = classConfig?.waliKelasSubject || waliKelasInfo?.subject || ORG_STRUCTURE.waliKelas.subject;
  const waliAvatar = classConfig?.waliKelasAvatarUrl || waliKelasInfo?.avatarUrl || ORG_STRUCTURE.waliKelas.avatarUrl;
  const classMotto = classConfig?.motto || CLASS_METADATA.motto;

  const [showSambutan, setShowSambutan] = useState(false);
  const [showVisiMisi, setShowVisiMisi] = useState(false);
  const [showEditWaliPhoto, setShowEditWaliPhoto] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'OFFICER' | 'MALE' | 'FEMALE'>('ALL');
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<GalleryPhoto | null>(null);

  const handleSaveWaliPhoto = async (newUrl: string) => {
    const updated: ClassConfig = {
      ...(classConfig || DEFAULT_CLASS_CONFIG),
      waliKelasAvatarUrl: newUrl,
    };
    onUpdateClassConfig?.(updated);
    try {
      await saveClassSettings({ waliKelasAvatarUrl: newUrl });
    } catch (e) {
      console.warn('Gagal simpan ke Firestore:', e);
    }
  };

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Helper to find student by name for click modal
  const handleOfficerClick = (name: string) => {
    const student = students.find((s) => s.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
    if (student) {
      onSelectStudent(student);
    }
  };

  // Filter 32 students
  const filteredStudents = students.filter((student) => {
    const matchesQuery =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.dreamSchool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toString() === searchQuery.trim();

    if (!matchesQuery) return false;

    if (activeFilter === 'OFFICER') return student.role !== 'Anggota';
    if (activeFilter === 'MALE') return student.gender === 'L';
    if (activeFilter === 'FEMALE') return student.gender === 'P';
    return true;
  });

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* ========================================================================= */}
      {/* 2. HERO — SAMBUTAN WALI KELAS (Navy Gradient Card as requested in Teks 2) */}
      {/* ========================================================================= */}
      <section className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-4xl mx-auto neu-hero rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden transition-transform"
        >
          {/* Subtle background crest / circle decoration */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-heading font-semibold uppercase tracking-wider text-white">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{CLASS_METADATA.sambutanWaliKelas.label}</span>
                </div>
                {onChangeRole && (
                  <button
                    type="button"
                    onClick={onChangeRole}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/25 hover:bg-white/35 text-white text-[11px] font-heading font-bold transition-all cursor-pointer border border-white/30"
                    title="Ganti Peran Pengguna"
                  >
                    <UserCheck className="w-3 h-3" />
                    <span>Peran: {currentRole} (Ganti)</span>
                  </button>
                )}
              </div>

              <h2 className="font-heading font-bold text-xl sm:text-2xl leading-tight text-white drop-shadow-sm">
                {CLASS_METADATA.sambutanWaliKelas.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-2">
                "{CLASS_METADATA.sambutanWaliKelas.quote}"
              </p>

              <div className="pt-2 flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setShowSambutan(true)}
                  className="px-5 py-2 rounded-2xl bg-white text-[#1C5FE0] font-heading font-bold text-xs shadow-md hover:bg-white/95 transition-all flex items-center gap-1.5"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.button>
                <span className="text-[11px] text-white/80 font-medium">
                  {CLASS_METADATA.sambutanWaliKelas.date}
                </span>
              </div>
            </div>

            {/* Wali Kelas Avatar Badge with Edit Photo Feature */}
            <div className="flex items-center gap-3.5 bg-black/35 p-3 rounded-2xl border border-white/20 self-start md:self-auto group relative">
              <div
                onClick={() => {
                  if (currentRole !== 'SISWA') {
                    setShowEditWaliPhoto(true);
                  } else {
                    setShowSambutan(true);
                  }
                }}
                className="w-14 h-14 rounded-2xl overflow-hidden p-0.5 bg-white/30 flex-shrink-0 relative cursor-pointer group/avatar hover:scale-105 transition-transform"
                title={currentRole !== 'SISWA' ? 'Klik untuk ubah foto profil wali kelas' : 'Lihat Sambutan Wali Kelas'}
              >
                <img
                  src={waliAvatar}
                  alt={waliName}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {currentRole !== 'SISWA' && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                    <Camera className="w-5 h-5 text-white drop-shadow" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    Wali Kelas
                  </div>
                  {currentRole !== 'SISWA' && (
                    <button
                      type="button"
                      onClick={() => setShowEditWaliPhoto(true)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 transition-all cursor-pointer"
                      title="Ubah Foto Profil"
                    >
                      <Camera className="w-2.5 h-2.5" />
                      <span>Ubah Foto</span>
                    </button>
                  )}
                </div>
                <div className="font-heading font-bold text-sm text-white leading-tight">
                  {waliName}
                </div>
                <div className="text-[11px] text-white/80">
                  {waliSubject}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 2.5 HITUNG MUNDUR (Countdown Target Kelulusan & Ujian Sekolah) */}
      {/* ========================================================================= */}
      {countdownEvents && countdownEvents.length > 0 && (
        <section className="px-4">
          <div className="max-w-4xl mx-auto">
            <CountdownWidget
              events={countdownEvents}
              currentRole={currentRole}
              onOpenAdmin={onOpenAdmin}
            />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. INFO CEPAT (Bento Grid 4 Kolom: Siswa, Visi Misi, Buku Paket, Uang Kas) */}
      {/* ========================================================================= */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Jumlah Siswa (32 Siswa) */}
          <motion.div
            whileHover={{ y: -3, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const el = document.getElementById('daftar-siswa-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="neu-flat rounded-3xl p-4 sm:p-5 cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl neu-flat-sm flex items-center justify-center text-[#1C5FE0] group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C5FE0]" />
                </div>
                <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#1C5FE0]/10 text-[#1C5FE0]">
                  32 Siswa
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold text-[#5C6F84]">
                  Total Anggota
                </div>
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1F3A5F] leading-tight">
                  {CLASS_METADATA.totalStudents}
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#C4CAE0]/40 flex items-center justify-between text-[10px] sm:text-[11px] text-[#5C6F84]">
              <span className="font-medium">18 L &bull; 14 P</span>
              <span className="font-bold text-[#10B981]">100% Lulus</span>
            </div>
          </motion.div>

          {/* Card 2: Visi & Misi */}
          <motion.div
            whileHover={{ y: -3, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowVisiMisi(true)}
            className="neu-flat rounded-3xl p-4 sm:p-5 cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl neu-flat-sm flex items-center justify-center text-[#1C5FE0] group-hover:scale-110 transition-transform">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#1C5FE0]" />
                </div>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F]">
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1C5FE0]" />
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold text-[#5C6F84]">
                  Pedoman
                </div>
                <div className="font-heading font-bold text-sm sm:text-base text-[#1F3A5F] line-clamp-1">
                  Visi &amp; Misi
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#C4CAE0]/40 text-[10px] sm:text-[11px] text-[#5C6F84] line-clamp-1">
              {classMotto}
            </div>
          </motion.div>

          {/* Card 3: Buku Paket & Materi Digital */}
          <motion.div
            whileHover={{ y: -3, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateTab('materi')}
            className="neu-flat rounded-3xl p-4 sm:p-5 cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl neu-flat-sm flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                </div>
                <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
                  {(materials || INITIAL_MATERIALS).length} Modul
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold text-[#5C6F84]">
                  Belajar Digital
                </div>
                <div className="font-heading font-bold text-sm sm:text-base text-[#1F3A5F] line-clamp-1">
                  Buku &amp; Materi
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#C4CAE0]/40 flex items-center justify-between text-[10px] sm:text-[11px] text-amber-600 font-bold">
              <span>Buka E-Book</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>

          {/* Card 4: Uang Kas Kelas (Protected by PIN) */}
          <motion.div
            whileHover={{ y: -3, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigateTab('kas')}
            className="neu-flat rounded-3xl p-4 sm:p-5 cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl neu-flat-sm flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                </div>
                <span className={`text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isKasUnlocked ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-600'
                }`}>
                  {isKasUnlocked ? 'Terbuka' : <><Lock className="w-2.5 h-2.5" /> PIN</>}
                </span>
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold text-[#5C6F84]">
                  Iuran Harian
                </div>
                <div className="font-heading font-bold text-sm sm:text-base text-[#1F3A5F] line-clamp-1">
                  Rp 1.000 / hari
                </div>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#C4CAE0]/40 flex items-center justify-between text-[10px] sm:text-[11px] text-emerald-600 font-bold">
              <span>{isKasUnlocked ? 'Lihat Kas' : 'Buka PIN (1234)'}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3.5 TKA & TOBK THE KING SPOTLIGHT BANNER (Persiapan Masuk SMA/SMK)       */}
      {/* ========================================================================= */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onNavigateTab('tka')}
            className="neu-flat rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-[#E7EBF5] via-[#EAEFFB] to-[#FFF8EC] border border-amber-300/60 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <Crown className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-300/70">
                    Metode The King
                  </span>
                  <span className="text-[11px] text-[#5C6F84] font-medium">
                    Belajar TKA &amp; TOBK
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-gray-900">
                  Modul Belajar TKA: Try Out &amp; Latihan Soal
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600">
                  Simulasi 4 sesi blocking time, latihan santai per bab, trik The King 15 detik, dan grafik progress.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span className="text-xs font-heading font-bold text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Buka Belajar TKA</span>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STRUKTUR KELAS (Org Chart — 12 Pengurus with Connecting Lines)        */}
      {/* ========================================================================= */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#1F3A5F]">
                Struktur Organisasi Kelas
              </h3>
              <p className="text-xs text-[#5C6F84]">
                Bagan hierarki 12 pengurus resmi kelas IX-H
              </p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full neu-flat-sm text-[#1C5FE0]">
              12 Pengurus
            </span>
          </div>

          {/* Inset Neumorphic Frame as specified in Teks 2 */}
          <div className="neu-inset-deep rounded-3xl p-5 sm:p-7 border border-white/60 relative">
            {/* ---------------- LEVEL 1: WALI KELAS (Center Top) ---------------- */}
            <div className="flex flex-col items-center relative z-10">
              <div className="neu-flat rounded-2xl p-3.5 flex items-center gap-3 bg-[#E7EBF5] max-w-xs border border-white/80 group relative">
                {/* Avatar with initials or photo & edit trigger */}
                <div
                  onClick={() => {
                    if (currentRole !== 'SISWA') {
                      setShowEditWaliPhoto(true);
                    } else {
                      setShowSambutan(true);
                    }
                  }}
                  className="w-12 h-12 rounded-2xl neu-hero p-0.5 flex-shrink-0 relative cursor-pointer group/avatar hover:scale-105 transition-transform"
                  title={currentRole !== 'SISWA' ? 'Klik untuk ubah foto profil wali kelas' : 'Lihat Sambutan Wali Kelas'}
                >
                  <img
                    src={waliAvatar}
                    alt={waliName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {currentRole !== 'SISWA' && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div
                  onClick={() => setShowSambutan(true)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#1C5FE0] block">
                      Wali Kelas
                    </span>
                    {currentRole !== 'SISWA' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditWaliPhoto(true);
                        }}
                        className="text-[9.5px] font-bold text-[#1C5FE0] hover:underline flex items-center gap-0.5 cursor-pointer"
                        title="Ubah Foto Profil"
                      >
                        <Camera className="w-2.5 h-2.5" />
                        <span>Ubah Foto</span>
                      </button>
                    )}
                  </div>
                  <div className="font-heading font-bold text-sm text-[#1F3A5F] leading-tight">
                    {waliName}
                  </div>
                  <span className="text-[11px] text-[#5C6F84]">
                    {waliSubject}
                  </span>
                </div>
              </div>

              {/* Vertical connector from Level 1 */}
              <div className="w-[2px] h-6 bg-[#B9C4DA]" />
            </div>

            {/* ---------------- CONNECTOR BAR: Split to Level 2 ---------------- */}
            <div className="relative flex justify-center">
              {/* Horizontal line spanning between Ketua and Wakil */}
              <div className="w-[50%] sm:w-[45%] h-[2px] bg-[#B9C4DA]" />
            </div>

            {/* Vertical drops to Ketua & Wakil */}
            <div className="flex justify-around px-8 sm:px-16">
              <div className="w-[2px] h-4 bg-[#B9C4DA]" />
              <div className="w-[2px] h-4 bg-[#B9C4DA]" />
            </div>

            {/* ---------------- LEVEL 2: KETUA & WAKIL KETUA (2 side-by-side) ---------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 relative z-10 mb-4">
              {/* Ketua Kelas: Hikmal Syukri Febriyanto */}
              <div
                onClick={() => handleOfficerClick(ORG_STRUCTURE.ketua.name)}
                className="neu-flat rounded-2xl p-3 sm:p-3.5 bg-[#E7EBF5] cursor-pointer hover:scale-[1.02] transition-transform border border-white/70"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl neu-flat-sm flex items-center justify-center font-heading font-extrabold text-xs sm:text-sm text-[#1C5FE0] bg-gradient-to-br from-blue-100 to-white flex-shrink-0">
                    HS
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-600 block leading-none mb-1">
                      Ketua Kelas
                    </span>
                    <div className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] truncate leading-tight">
                      {ORG_STRUCTURE.ketua.name}
                    </div>
                    <span className="text-[10px] text-[#5C6F84] block mt-0.5 truncate leading-normal">
                      Panggilan: {ORG_STRUCTURE.ketua.nickname}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wakil Ketua: Rafi Azka Zaidan */}
              <div
                onClick={() => handleOfficerClick(ORG_STRUCTURE.wakilKetua.name)}
                className="neu-flat rounded-2xl p-3 sm:p-3.5 bg-[#E7EBF5] cursor-pointer hover:scale-[1.02] transition-transform border border-white/70"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl neu-flat-sm flex items-center justify-center font-heading font-extrabold text-xs sm:text-sm text-[#1C5FE0] bg-gradient-to-br from-blue-100 to-white flex-shrink-0">
                    RA
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-blue-600 block leading-none mb-1">
                      Wakil Ketua
                    </span>
                    <div className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] truncate leading-tight">
                      {ORG_STRUCTURE.wakilKetua.name}
                    </div>
                    <span className="text-[10px] text-[#5C6F84] block mt-0.5 truncate leading-normal">
                      Panggilan: {ORG_STRUCTURE.wakilKetua.nickname}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Central connector down to Section Grid (Level 3) */}
            <div className="flex flex-col items-center">
              <div className="w-[2px] h-5 bg-[#B9C4DA]" />
              <div className="w-[85%] sm:w-[80%] h-[2px] bg-[#B9C4DA]" />
              <div className="grid grid-cols-2 w-full px-12 sm:px-20 justify-items-center">
                <div className="w-[2px] h-4 bg-[#B9C4DA]" />
                <div className="w-[2px] h-4 bg-[#B9C4DA]" />
              </div>
            </div>

            {/* ---------------- LEVEL 3: 2x2 GRID SEKSI (Bendahara, Sekretaris, Kebersihan, Keamanan) ---------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              {/* Section 1: Bendahara */}
              <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#C4CAE0]/40">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl neu-flat-sm flex items-center justify-center text-[#10B981]">
                      <Coins className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                      Bendahara
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-[#5C6F84]">
                    2 Siswi
                  </span>
                </div>

                <div className="space-y-2">
                  {ORG_STRUCTURE.sections[0].members.map((member, i) => (
                    <div
                      key={i}
                      onClick={() => handleOfficerClick(member.name)}
                      className="neu-flat-sm rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-white/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white font-heading font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        {member.nickname.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-heading font-bold text-xs text-[#1F3A5F] truncate leading-tight">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-[#5C6F84] truncate leading-normal mt-0.5">
                          {member.role} &bull; "{member.nickname}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Sekretaris */}
              <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#C4CAE0]/40">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl neu-flat-sm flex items-center justify-center text-[#1C5FE0]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                      Sekretaris
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-[#5C6F84]">
                    2 Siswi
                  </span>
                </div>

                <div className="space-y-2">
                  {ORG_STRUCTURE.sections[1].members.map((member, i) => (
                    <div
                      key={i}
                      onClick={() => handleOfficerClick(member.name)}
                      className="neu-flat-sm rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-white/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white font-heading font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        {member.nickname.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-heading font-bold text-xs text-[#1F3A5F] truncate leading-tight">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-[#5C6F84] truncate leading-normal mt-0.5">
                          {member.role} &bull; "{member.nickname}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Seksi Kebersihan */}
              <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#C4CAE0]/40">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl neu-flat-sm flex items-center justify-center text-teal-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                      Seksi Kebersihan
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-[#5C6F84]">
                    2 Siswi
                  </span>
                </div>

                <div className="space-y-2">
                  {ORG_STRUCTURE.sections[2].members.map((member, i) => (
                    <div
                      key={i}
                      onClick={() => handleOfficerClick(member.name)}
                      className="neu-flat-sm rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-white/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-white font-heading font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        {member.nickname.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-heading font-bold text-xs text-[#1F3A5F] truncate leading-tight">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-[#5C6F84] truncate leading-normal mt-0.5">
                          {member.role} &bull; "{member.nickname}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Seksi Keamanan */}
              <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/70">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#C4CAE0]/40">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl neu-flat-sm flex items-center justify-center text-rose-600">
                      <Shield className="w-4 h-4" />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#1F3A5F]">
                      Seksi Keamanan
                    </h4>
                  </div>
                  <span className="text-[10px] font-semibold text-[#5C6F84]">
                    3 Siswa
                  </span>
                </div>

                <div className="space-y-2">
                  {ORG_STRUCTURE.sections[3].members.map((member, i) => (
                    <div
                      key={i}
                      onClick={() => handleOfficerClick(member.name)}
                      className="neu-flat-sm rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-white/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-heading font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        {member.nickname.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-heading font-bold text-xs text-[#1F3A5F] truncate leading-tight">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-[#5C6F84] truncate leading-normal mt-0.5">
                          {member.role} &bull; "{member.nickname}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. GALERI KELAS — CAROUSEL HORIZONTAL (Scrollable Rounded Square Cards)  */}
      {/* ========================================================================= */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#1F3A5F]">
                Galeri Kelas
              </h3>
              <p className="text-xs text-[#5C6F84]">
                Arsip momen, prestasi, dan proyek bersama keluarga besar IX-H
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95"
                aria-label="Geser ke kiri"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95"
                aria-label="Geser ke kanan"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x"
          >
            {GALLERY_PHOTOS.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedGalleryPhoto(photo)}
                className="neu-flat rounded-3xl p-3 flex-shrink-0 w-[240px] sm:w-[260px] snap-start cursor-pointer hover:translate-y-[-2px] transition-all group bg-[#E7EBF5] border border-white/70"
              >
                {/* Rounded Square Photo Frame */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-3 relative neu-inset-sm">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#1F3A5F]/75 backdrop-blur-md text-white text-[10px] font-heading font-bold tracking-wider">
                    {photo.category}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                    {photo.date}
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <h4 className="font-heading font-bold text-xs text-[#1F3A5F] line-clamp-2 leading-snug group-hover:text-[#1C5FE0] transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-[#5C6F84] line-clamp-2 leading-normal">
                    {photo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. DAFTAR 32 SISWA KELAS IX-H (Lengkap dengan Foto & Detail)             */}
      {/* ========================================================================= */}
      <section id="daftar-siswa-section" className="px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-[#1F3A5F]">
                  Daftar 32 Siswa IX-H
                </h3>
                <span className="text-[10px] font-heading font-extrabold px-2.5 py-0.5 rounded-full bg-[#1C5FE0]/15 text-[#1C5FE0]">
                  {filteredStudents.length} Siswa
                </span>
              </div>
              <p className="text-xs text-[#5C6F84]">
                Ketuk salah satu siswa untuk melihat Kartu Pelajar Digital &amp; target cita-cita
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {[
                { id: 'ALL', label: `Semua (${students.length})` },
                { id: 'OFFICER', label: `Pengurus (${students.filter(s => s.role !== 'Anggota').length})` },
                { id: 'MALE', label: `Putra (${students.filter(s => s.gender === 'L').length})` },
                { id: 'FEMALE', label: `Putri (${students.filter(s => s.gender === 'P').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                    activeFilter === f.id
                      ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-inner'
                      : 'neu-btn text-[#1F3A5F]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Neumorphic Search Bar (neu-inset) */}
          <div className="neu-inset rounded-2xl p-2.5 flex items-center gap-2 mb-4 border border-white/50">
            <Search className="w-4 h-4 text-[#5C6F84] ml-1.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, absen, panggilan, atau target sekolah..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#1F3A5F] placeholder-[#8B9BB0] focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#5C6F84] px-2 py-0.5 rounded-full hover:bg-white/40 font-bold"
              >
                &times;
              </button>
            )}
          </div>

          {/* Admin Quick Action Banner */}
          {onOpenAdmin && (
            <div className="neu-flat rounded-2xl p-3.5 mb-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-white/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl neu-flat-sm flex items-center justify-center text-[#1C5FE0] flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-heading font-bold text-xs text-[#1F3A5F] truncate">
                    Panel Admin Kelas IX-H
                  </div>
                  <p className="text-[10px] text-[#5C6F84] truncate">
                    Kelola data 32 siswa, uang kas, jadwal pelajaran, dan piket
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenAdmin}
                className="neu-btn px-3 py-1.5 rounded-xl text-xs font-heading font-bold text-[#1C5FE0] hover:bg-blue-100 flex-shrink-0 active:scale-95 flex items-center gap-1"
              >
                <span>Buka Panel</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Grid of 32 Students */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredStudents.map((student) => {
              const initials = student.name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0].toUpperCase())
                .join('');
              const isOfficer = student.role !== 'Anggota';

              return (
                <motion.div
                  key={student.id}
                  onClick={() => onSelectStudent(student)}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="neu-flat rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer transition-all group bg-[#E7EBF5] border border-white/60"
                >
                  {/* Avatar / Photo with Soft 3D rim */}
                  <div className="w-12 h-12 rounded-2xl neu-flat-sm p-0.5 flex-shrink-0 relative overflow-hidden">
                    {student.photoUrl ? (
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className={`w-full h-full rounded-xl flex items-center justify-center font-heading font-extrabold text-sm text-white ${
                          student.gender === 'L'
                            ? 'bg-gradient-to-br from-[#1C5FE0] to-[#1F3A5F]'
                            : 'bg-gradient-to-br from-pink-500 to-rose-600'
                        }`}
                      >
                        {initials}
                      </div>
                    )}

                    {isOfficer && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-white font-bold text-[9px] flex items-center justify-center shadow-sm">
                        &#9733;
                      </span>
                    )}
                  </div>

                  {/* Student Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-heading font-extrabold px-1.5 py-0.5 rounded-md bg-[#1C5FE0]/15 text-[#1C5FE0] flex-shrink-0">
                        #{student.id}
                      </span>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] truncate group-hover:text-[#1C5FE0] transition-colors leading-tight">
                        {student.name}
                      </h4>
                    </div>

                    <div className="text-[11px] text-[#5C6F84] flex items-center gap-1.5 mt-0.5 truncate leading-normal">
                      <span className="flex-shrink-0 font-medium">"{student.nickname}"</span>
                      {isOfficer && (
                        <>
                          <span className="text-[#8B9BB0]">&bull;</span>
                          <span className="text-[#1C5FE0] font-semibold truncate">{student.role}</span>
                        </>
                      )}
                    </div>

                    <div className="text-[10px] text-[#5C6F84] flex items-center gap-1 mt-1 truncate leading-normal">
                      <School className="w-3 h-3 text-[#1C5FE0] flex-shrink-0" />
                      <span className="truncate">{student.dreamSchool}</span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="w-6 h-6 rounded-full neu-flat-sm flex items-center justify-center text-[#5C6F84] group-hover:text-[#1C5FE0] flex-shrink-0">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="neu-inset rounded-2xl p-8 text-center text-[#5C6F84]">
              <p className="text-sm font-semibold">Tidak ada siswa yang cocok dengan pencarian.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('ALL');
                }}
                className="mt-2 text-xs font-bold text-[#1C5FE0] underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <SambutanModal
        isOpen={showSambutan}
        onClose={() => setShowSambutan(false)}
        waliKelasInfo={waliKelasInfo}
        classConfig={classConfig}
        onOpenEditPhoto={currentRole !== 'SISWA' ? () => setShowEditWaliPhoto(true) : undefined}
      />
      <VisiMisiModal isOpen={showVisiMisi} onClose={() => setShowVisiMisi(false)} />

      {/* Modal Ubah Foto Profil Wali Kelas */}
      <EditWaliPhotoModal
        isOpen={showEditWaliPhoto}
        onClose={() => setShowEditWaliPhoto(false)}
        currentPhotoUrl={waliAvatar}
        waliName={waliName}
        waliSubject={waliSubject}
        onSave={handleSaveWaliPhoto}
      />

      {/* Gallery Zoom Modal */}
      {selectedGalleryPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A5F]/50 backdrop-blur-sm animate-fadeIn">
          <div className="neu-flat-lg rounded-3xl p-5 bg-[#E7EBF5] max-w-lg w-full border border-white/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#1C5FE0] px-2.5 py-0.5 rounded-full bg-[#1C5FE0]/10">
                {selectedGalleryPhoto.category} &bull; {selectedGalleryPhoto.date}
              </span>
              <button
                onClick={() => setSelectedGalleryPhoto(null)}
                className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F]"
              >
                &times;
              </button>
            </div>
            <div className="w-full h-64 rounded-2xl overflow-hidden neu-inset-sm mb-3">
              <img
                src={selectedGalleryPhoto.imageUrl}
                alt={selectedGalleryPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-heading font-bold text-base text-[#1F3A5F] mb-1">
              {selectedGalleryPhoto.title}
            </h4>
            <p className="text-xs text-[#5C6F84] leading-relaxed">
              {selectedGalleryPhoto.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
