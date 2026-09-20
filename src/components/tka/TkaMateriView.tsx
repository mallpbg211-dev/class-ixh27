import React, { useState } from 'react';
import {
  Radical,
  BookOpen,
  Atom,
  MessageSquare,
  ChevronRight,
  BookMarked,
  FileText,
  Eye,
  X,
  Sparkles,
  Search,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudyMaterial, UserRole } from '../../types';
import { TKA_CHAPTERS } from './tkaChaptersData';
import { TkaSubject } from './tkaTypes';
import { soundManager } from '../../lib/gameAudio';
import {
  TkaMateriLesson,
  TKA_DETAILED_LESSONS,
} from './tkaMateriLessonsData';
import { TkaMateriDetailModal } from './TkaMateriDetailModal';

interface TkaMateriViewProps {
  materials: StudyMaterial[];
  currentRole: UserRole;
  onOpenAdminUpload?: () => void;
  onSelectSubjectPractice?: (subject: TkaSubject, chapterId?: string) => void;
}

interface SubjectCardConfig {
  id: TkaSubject;
  name: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  borderHover: string;
  badgeCount: number;
}

export const TkaMateriView: React.FC<TkaMateriViewProps> = ({
  materials,
  currentRole,
  onOpenAdminUpload,
  onSelectSubjectPractice,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<TkaSubject | null>(null);
  const [activeLesson, setActiveLesson] = useState<TkaMateriLesson | null>(null);
  const [readingMaterial, setReadingMaterial] = useState<StudyMaterial | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<'BAB' | 'MODUL'>('BAB');
  const [searchQuery, setSearchQuery] = useState('');

  const subjectsConfig: SubjectCardConfig[] = [
    {
      id: 'MATEMATIKA',
      name: 'Matematika',
      subtitle: '5 Bab Lengkap • Bangun Ruang, Populasi, Peluang, Eksponen & Akar',
      icon: Radical,
      iconBg: 'bg-[#D97706]/15 text-[#B45309]',
      iconColor: 'text-[#B45309]',
      borderHover: 'hover:border-amber-400',
      badgeCount: TKA_CHAPTERS.filter((c) => c.subject === 'MATEMATIKA').length,
    },
    {
      id: 'B_INDO',
      name: 'Bahasa Indonesia',
      subtitle: '3 Bab Lengkap • Teks Deskripsi, Prosedur, Rekon & Fabel',
      icon: BookOpen,
      iconBg: 'bg-[#E11D48]/15 text-[#BE123C]',
      iconColor: 'text-[#BE123C]',
      borderHover: 'hover:border-rose-400',
      badgeCount: TKA_CHAPTERS.filter((c) => c.subject === 'B_INDO').length,
    },
    {
      id: 'IPA',
      name: 'Ilmu Pengetahuan Alam',
      subtitle: '4 Bab Lengkap • Biologi Manusia, Tekanan, Listrik & Magnet',
      icon: Atom,
      iconBg: 'bg-[#0D9488]/15 text-[#0F766E]',
      iconColor: 'text-[#0F766E]',
      borderHover: 'hover:border-teal-400',
      badgeCount: TKA_CHAPTERS.filter((c) => c.subject === 'IPA').length,
    },
    {
      id: 'B_INGGRIS',
      name: 'Bahasa Inggris',
      subtitle: '4 Unit Lengkap • Listening, Reading Comprehension & Writing',
      icon: MessageSquare,
      iconBg: 'bg-[#7C3AED]/15 text-[#6D28D9]',
      iconColor: 'text-[#6D28D9]',
      borderHover: 'hover:border-purple-400',
      badgeCount: TKA_CHAPTERS.filter((c) => c.subject === 'B_INGGRIS').length,
    },
  ];

  const activeSubjectChapters = selectedSubject
    ? TKA_CHAPTERS.filter((c) => c.subject === selectedSubject)
    : [];

  const activeSubjectMaterials = selectedSubject
    ? materials.filter((m) => {
        const sub = m.subject.toUpperCase();
        if (selectedSubject === 'MATEMATIKA') return sub.includes('MAT') || sub.includes('HITUNG');
        if (selectedSubject === 'B_INDO') return sub.includes('INDO');
        if (selectedSubject === 'B_INGGRIS') return sub.includes('INGGRIS') || sub.includes('ENG');
        if (selectedSubject === 'IPA') return sub.includes('IPA') || sub.includes('SAINS') || sub.includes('BIOLOGI') || sub.includes('FISIKA');
        return false;
      })
    : [];

  // Helper: Open detailed interactive lesson for a chapter
  const handleOpenChapterLesson = (chapterId: string, chapterTitle: string, chapterNumber: string) => {
    soundManager.playClick();
    const found = TKA_DETAILED_LESSONS.find((l) => l.chapterId === chapterId);
    if (found) {
      setActiveLesson(found);
    } else {
      // Dynamic fallback lesson if exact curated lesson not yet mapped
      setActiveLesson({
        id: `DYNAMIC_${chapterId}`,
        subject: selectedSubject || 'MATEMATIKA',
        chapterId,
        chapterNumber,
        chapterTitle,
        overview: `Panduan ringkas materi ${chapterTitle} kurikulum standar TKA SMP. Pelajari konsep dasar, rumus, serta trik pengerjaan cepat The King.`,
        keyPoints: [
          {
            title: `Konsep Inti ${chapterTitle}`,
            description: `Pelajari definisi, karakteristik utama, dan langkah pemecahan masalah yang sering diujikan dalam tes TKA.`,
            formulaOrConcept: `Fokus: Pahami pola soal standar, hindari jebakan konseptual, dan gunakan rumus efisien.`,
          },
          {
            title: 'Strategi Penyelesaian Efisien',
            description: `Gunakan penalaran logis serta eliminasi opsi jawaban yang tidak masuk akal sebelum menghitung.`,
          },
        ],
        exampleProblems: [
          {
            question: `Contoh penerapan konsep ${chapterTitle} pada soal ujian asesmen TKA:`,
            stepByStep: [
              '1. Baca instruksi soal dan identifikasi besaran/informasi yang diketahui.',
              '2. Tentukan rumus atau konsep pokok yang relevan.',
              '3. Lakukan penyederhanaan langkah perhitungan.',
            ],
            theKingTip: 'THE KING: Eliminasi terlebih dahulu jawaban yang jelas salah untuk memperbesar peluang menjawab benar dalam waktu singkat.',
            answer: 'Gunakan metode penalaran langsung dan eliminasi opsi.',
          },
        ],
        summary: `Kuasai materi pokok ${chapterTitle} secara bertahap dan lanjutkan dengan simulasi latihan soal untuk memantapkan pemahaman.`,
      });
    }
  };

  return (
    <div className="w-full space-y-5 pb-24">
      {/* Top Hero Banner - Matches Gambar 1 Structure with Consistent IX-H Royal Theme */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1C5FE0] via-[#1A54C7] to-[#1644A6] text-white shadow-lg border border-blue-400/30">
        {/* Subtle decorative geometric overlay */}
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-40 h-40 rounded-full bg-blue-300/10 blur-xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white drop-shadow-xs">
            Materi
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
            Pelajari dan kuasai setiap topik
          </p>
        </div>

        {/* Circular Level Badge - TKA SMP ONLY (Per User Directive) */}
        <div className="mt-5 flex items-center justify-center">
          <div className="inline-flex flex-col items-center gap-1.5 p-1">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-md">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0F3A78] flex items-center justify-center text-emerald-300 border-2 border-white/60">
                <BookMarked className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                ✓
              </span>
            </div>
            <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-white drop-shadow-xs">
              TKA SMP
            </span>
          </div>
        </div>
      </div>

      {/* Section Header: "Daftar Materi" - Api Icon Removed as Requested */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <h2 className="text-base sm:text-lg font-heading font-bold text-[#1F3A5F]">
            Daftar Materi
          </h2>
          <p className="text-xs text-[#5C6F84]">
            Pilih mata pelajaran untuk mempelajari bab dan membaca modul
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C5FE0]/10 border border-[#1C5FE0]/20 text-[#1C5FE0] text-xs font-heading font-bold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>4 Mata Pelajaran</span>
        </div>
      </div>

      {/* Subject List Cards (Matematika, Bahasa Indonesia, IPA, Bahasa Inggris) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {subjectsConfig.map((sub) => {
          const Icon = sub.icon;
          return (
            <motion.div
              key={sub.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                soundManager.playClick();
                setSelectedSubject(sub.id);
              }}
              className={`neu-flat rounded-3xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/80 cursor-pointer transition-all flex items-center justify-between gap-3 group ${sub.borderHover}`}
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                {/* Rounded Icon Box with Subject Color Accent */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 neu-inset-sm ${sub.iconBg}`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#1F3A5F] group-hover:text-[#1C5FE0] transition-colors truncate">
                    {sub.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#5C6F84] font-medium truncate mt-0.5">
                    {sub.subtitle}
                  </p>
                </div>
              </div>

              {/* Arrow Chevron Action */}
              <div className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-[#5C6F84] group-hover:text-[#1C5FE0] shrink-0">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Subject Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.96 }}
              className="w-full max-w-2xl max-h-[88vh] bg-[#E7EBF5] rounded-3xl border border-white/90 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200/80 bg-white/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center font-bold text-xs shrink-0">
                    TKA
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1F3A5F]">
                      {subjectsConfig.find((s) => s.id === selectedSubject)?.name}
                    </h3>
                    <p className="text-xs text-[#5C6F84]">
                      Klik bab materi di bawah untuk membaca dan mempelajari konsepnya
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSubject(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm cursor-pointer transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sub Tab Switcher inside Modal */}
              <div className="px-4 pt-3 flex items-center gap-2 bg-[#E7EBF5]">
                <button
                  onClick={() => setActiveTabFilter('BAB')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                    activeTabFilter === 'BAB'
                      ? 'bg-[#1C5FE0] text-white shadow-xs'
                      : 'bg-white/60 text-[#5C6F84] hover:bg-white'
                  }`}
                >
                  Bab &amp; Pembelajaran ({activeSubjectChapters.length})
                </button>
                <button
                  onClick={() => setActiveTabFilter('MODUL')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
                    activeTabFilter === 'MODUL'
                      ? 'bg-[#1C5FE0] text-white shadow-xs'
                      : 'bg-white/60 text-[#5C6F84] hover:bg-white'
                  }`}
                >
                  Modul &amp; Dokumen ({activeSubjectMaterials.length})
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
                {activeTabFilter === 'BAB' ? (
                  <>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-[#1F3A5F]">
                        Pilih Bab untuk Dipelajari (Dilengkapi Konsep &amp; The King)
                      </span>
                      {onSelectSubjectPractice && (
                        <button
                          onClick={() => {
                            const sub = selectedSubject;
                            setSelectedSubject(null);
                            onSelectSubjectPractice(sub);
                          }}
                          className="text-xs font-heading font-bold text-[#1C5FE0] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Latihan Soal Mapel Ini</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {activeSubjectChapters.map((ch, idx) => (
                        <div
                          key={ch.id}
                          onClick={() => handleOpenChapterLesson(ch.id, ch.title, String(ch.number))}
                          className="neu-flat rounded-2xl p-4 bg-white border border-gray-200/90 hover:border-[#1C5FE0] hover:shadow-md cursor-pointer transition-all space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-[#1C5FE0] group-hover:bg-[#1C5FE0] group-hover:text-white transition-colors">
                                {ch.number}
                              </span>
                              <span className="text-[11px] font-semibold text-gray-400">
                                Topik #{idx + 1}
                              </span>
                            </div>

                            <span className="text-xs font-heading font-bold text-[#1C5FE0] flex items-center gap-1 opacity-90 group-hover:translate-x-0.5 transition-all">
                              <span>Pelajari Bab</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>

                          <div>
                            <h4 className="font-heading font-bold text-sm text-[#1F3A5F] group-hover:text-[#1C5FE0] transition-colors">
                              {ch.title}
                            </h4>
                            <p className="text-xs text-[#5C6F84] leading-relaxed mt-0.5">
                              {ch.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {activeSubjectMaterials.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#5C6F84] space-y-2">
                        <FileText className="w-8 h-8 text-gray-300 mx-auto" />
                        <p>Belum ada modul PDF khusus untuk mata pelajaran ini.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {activeSubjectMaterials.map((mat) => (
                          <div
                            key={mat.id}
                            className="neu-flat rounded-2xl p-3.5 bg-white border border-gray-200/80 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-[#1C5FE0] uppercase">
                                {mat.type}
                              </span>
                              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] truncate">
                                {mat.title}
                              </h4>
                              <p className="text-[11px] text-[#5C6F84] truncate">
                                Pengampu: {mat.author}
                              </p>
                            </div>

                            <button
                              onClick={() => setReadingMaterial(mat)}
                              className="px-3 py-1.5 rounded-xl bg-[#1C5FE0] hover:bg-[#1A54C7] text-white text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Baca</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Lesson Reading Modal (Konsep, Poin Kunci, The King, Contoh Soal) */}
      <AnimatePresence>
        {activeLesson && (
          <TkaMateriDetailModal
            lesson={activeLesson}
            onClose={() => setActiveLesson(null)}
            onPracticeLesson={() => {
              const currentSub = activeLesson.subject;
              const chapterId = activeLesson.chapterId;
              setActiveLesson(null);
              setSelectedSubject(null);
              if (onSelectSubjectPractice) {
                onSelectSubjectPractice(currentSub, chapterId);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Reader Modal for Material PDF */}
      <AnimatePresence>
        {readingMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            >
              <div className="p-4 bg-[#1C5FE0] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base">
                    {readingMaterial.title}
                  </h3>
                  <p className="text-xs text-blue-100">{readingMaterial.subject}</p>
                </div>
                <button
                  onClick={() => setReadingMaterial(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 bg-[#F8FAFC]">
                {readingMaterial.fileUrl.startsWith('data:application/pdf') ||
                readingMaterial.fileUrl.endsWith('.pdf') ? (
                  <iframe
                    src={readingMaterial.fileUrl}
                    title={readingMaterial.title}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <FileText className="w-12 h-12 text-[#1C5FE0] mx-auto" />
                    <h4 className="font-heading font-bold text-base text-[#1F3A5F]">
                      Dokumen Tersedia
                    </h4>
                    <p className="text-xs text-gray-500">{readingMaterial.description}</p>
                    <a
                      href={readingMaterial.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#1C5FE0] text-white text-xs font-bold inline-block"
                    >
                      Buka di Tab Baru
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
