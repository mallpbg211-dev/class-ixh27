import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Clock,
  X,
  User,
  Trash2,
  Crown,
  Layers,
} from 'lucide-react';
import { StudyMaterial, UserRole } from '../types';
import { BelajarTkaMainView } from './tka/BelajarTkaMainView';
import { TkaMateriView } from './tka/TkaMateriView';

interface MaterialsViewProps {
  materials: StudyMaterial[];
  currentRole: UserRole;
  onOpenAdminUpload?: () => void;
  onNavigateToPractice?: () => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  currentRole,
  onOpenAdminUpload,
  onNavigateToPractice,
}) => {
  const [activeSection, setActiveSection] = useState<'TKA_MATERI' | 'TKA_TOBK' | 'PERPUS'>('TKA_MATERI');
  const [search, setSearch] = useState('');
  const [focusedPracticeState, setFocusedPracticeState] = useState<{
    subject: any;
    chapterId?: string;
  } | null>(null);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BUKU_PAKET' | 'TUGAS' | 'MODUL' | 'CATATAN'>('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [readingMaterial, setReadingMaterial] = useState<StudyMaterial | null>(null);

  // Extract distinct subjects
  const subjects = Array.from(new Set(materials.map((m) => m.subject)));

  const filtered = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.author.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || m.type === typeFilter;
    const matchesSubject = subjectFilter === 'ALL' || m.subject === subjectFilter;

    return matchesSearch && matchesType && matchesSubject;
  });

  const getBadgeColor = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'BUKU_PAKET':
        return 'bg-blue-500/15 text-blue-600 border-blue-200';
      case 'TUGAS':
        return 'bg-rose-500/15 text-rose-600 border-rose-200';
      case 'MODUL':
        return 'bg-emerald-500/15 text-emerald-600 border-emerald-200';
      case 'CATATAN':
        return 'bg-amber-500/15 text-amber-600 border-amber-200';
      default:
        return 'bg-gray-500/15 text-gray-600';
    }
  };

  const getTypeLabel = (type: StudyMaterial['type']) => {
    switch (type) {
      case 'BUKU_PAKET':
        return 'Buku Paket';
      case 'TUGAS':
        return 'Tugas & Projek';
      case 'MODUL':
        return 'Modul Belajar';
      case 'CATATAN':
        return 'Rangkuman / Catatan';
    }
  };

  const handleDownload = (mat: StudyMaterial) => {
    // If it's a data URL or direct link, trigger direct download
    const link = document.createElement('a');
    link.href = mat.fileUrl;
    link.download = `${mat.title.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 pt-2 space-y-5">
      {/* Sub-navigation Switcher: Materi TKA SMP (Gambar 1) vs TOBK TKA (Gambar 2) vs Perpustakaan Modul */}
      <div className="neu-flat rounded-2xl p-1.5 bg-[#E7EBF5] border border-white/80 flex items-center gap-1.5">
        <button
          onClick={() => setActiveSection('TKA_MATERI')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
            activeSection === 'TKA_MATERI'
              ? 'bg-[#1C5FE0] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Materi TKA SMP</span>
        </button>

        <button
          onClick={() => setActiveSection('TKA_TOBK')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
            activeSection === 'TKA_TOBK'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>TOBK &amp; Simulasi</span>
        </button>

        <button
          onClick={() => setActiveSection('PERPUS')}
          className={`flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
            activeSection === 'PERPUS'
              ? 'bg-[#1F3A5F] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Buku BSE &amp; Modul</span>
        </button>
      </div>

      {/* Conditionally Render Materi TKA (Gambar 1), BelajarTkaMainView (TOBK Gambar 2), or Standard BSE library */}
      {activeSection === 'TKA_MATERI' ? (
        <TkaMateriView
          materials={materials}
          currentRole={currentRole}
          onOpenAdminUpload={onOpenAdminUpload}
          onSelectSubjectPractice={(subject, chapterId) => {
            setFocusedPracticeState({ subject, chapterId });
            setActiveSection('TKA_TOBK');
          }}
        />
      ) : activeSection === 'TKA_TOBK' ? (
        <BelajarTkaMainView
          currentRole={currentRole}
          initialSubTab={focusedPracticeState ? 'LATIHAN' : 'TRY_OUT'}
        />
      ) : (
        <>
          {/* Header Banner */}
          <div className="neu-flat rounded-3xl p-6 bg-[#E7EBF5] border border-white/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1C5FE0]/15 text-[#1C5FE0]">
                    Perpustakaan Digital
                  </span>
                  <span className="text-xs text-[#5C6F84] font-semibold">
                    SMP Negeri 1 Bojongsari
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-[#1F3A5F]">
                  Buku Paket &amp; Materi Pelajaran
                </h3>
                <p className="text-xs text-[#5C6F84] max-w-xl">
                  Unduh buku sekolah elektronik (BSE), modul tugas, dan baca materi langsung di aplikasi tanpa perlu keluar halaman.
                </p>
              </div>

              {currentRole === 'ADMIN' && onOpenAdminUpload && (
                <button
                  onClick={onOpenAdminUpload}
                  className="neu-accent-btn px-4 py-2.5 rounded-2xl text-xs font-heading font-bold flex items-center gap-2 self-start sm:self-auto shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Kelola di Admin</span>
                </button>
              )}
            </div>
          </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1 neu-inset rounded-2xl p-2.5 flex items-center gap-2 border border-white/60">
          <Search className="w-4 h-4 text-[#5C6F84] ml-1.5 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari buku paket, tugas, atau nama guru pengampu..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#1F3A5F] focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {(
            [
              { id: 'ALL', label: 'Semua' },
              { id: 'BUKU_PAKET', label: 'Buku Paket' },
              { id: 'TUGAS', label: 'Tugas' },
              { id: 'MODUL', label: 'Modul' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all ${
                typeFilter === t.id
                  ? 'neu-btn-active bg-[#1C5FE0] text-white'
                  : 'neu-btn text-[#5C6F84] hover:text-[#1F3A5F]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mat) => (
          <motion.div
            key={mat.id}
            whileHover={{ y: -2 }}
            className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 flex flex-col justify-between gap-4 relative"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-heading font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getBadgeColor(
                    mat.type
                  )}`}
                >
                  {getTypeLabel(mat.type)}
                </span>
                <span className="text-[11px] font-semibold text-[#5C6F84]">
                  {mat.fileSize || 'PDF Document'}
                </span>
              </div>

              <h4 className="font-heading font-bold text-base text-[#1F3A5F] leading-snug mb-1">
                {mat.title}
              </h4>

              <div className="flex items-center gap-2 text-xs text-[#1C5FE0] font-semibold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{mat.subject}</span>
                <span>&bull;</span>
                <span className="text-[#5C6F84]">{mat.grade}</span>
              </div>

              <p className="text-xs text-[#5C6F84] line-clamp-2 leading-relaxed mb-3">
                {mat.description}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-[#5C6F84] pt-2 border-t border-[#C4CAE0]/40">
                <User className="w-3 h-3 text-[#1C5FE0]" />
                <span className="truncate">Pengampu: {mat.author}</span>
              </div>
            </div>

            {/* Actions: Baca Langsung & Unduh */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => setReadingMaterial(mat)}
                className="flex-1 neu-btn py-2 px-3 rounded-2xl text-xs font-heading font-bold text-[#1C5FE0] flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>Baca Langsung</span>
              </button>

              <button
                onClick={() => handleDownload(mat)}
                className="flex-1 neu-btn-active bg-[#1C5FE0] text-white py-2 px-3 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File</span>
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full neu-flat rounded-3xl p-10 text-center text-[#5C6F84] space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-[#8C9BAE]" />
            <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
              Belum ada materi pelajaran yang cocok
            </h4>
            <p className="text-xs">
              Coba kata kunci lain atau hubungi admin untuk menambahkan buku paket.
            </p>
          </div>
        )}
      </div>

      {/* Reader Modal (In-App Preview) */}
      <AnimatePresence>
        {readingMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#1F3A5F]/60 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setReadingMaterial(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl h-[90vh] neu-flat-lg rounded-3xl bg-[#E7EBF5] border border-white/80 flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Reader Header */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-[#1F3A5F] to-[#1C5FE0] text-white flex items-center justify-between flex-shrink-0 shadow-md">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20">
                      {getTypeLabel(readingMaterial.type)}
                    </span>
                    <span className="text-xs text-blue-200">
                      {readingMaterial.subject}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate mt-0.5">
                    {readingMaterial.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(readingMaterial)}
                    className="neu-btn px-3 py-1.5 rounded-xl bg-white/15 text-white hover:bg-white/25 text-xs font-heading font-bold flex items-center gap-1.5"
                    title="Unduh file ke perangkat"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Unduh</span>
                  </button>
                  <button
                    onClick={() => setReadingMaterial(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors text-lg"
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Reader Body: Direct preview frame / document viewer */}
              <div className="flex-1 bg-white relative flex flex-col">
                {readingMaterial.fileUrl.startsWith('data:application/pdf') ||
                readingMaterial.fileUrl.endsWith('.pdf') ? (
                  <iframe
                    src={readingMaterial.fileUrl}
                    title={readingMaterial.title}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#F8FAFC]">
                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="neu-flat rounded-2xl p-5 bg-white border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C5FE0]">
                            {readingMaterial.subject} - {readingMaterial.grade}
                          </span>
                          <span className="text-xs text-gray-400">
                            Diunggah {readingMaterial.uploadedAt}
                          </span>
                        </div>
                        <h2 className="font-heading font-bold text-xl text-[#1F3A5F]">
                          {readingMaterial.title}
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {readingMaterial.description}
                        </p>
                        <div className="p-3 rounded-xl bg-blue-50 text-xs text-blue-800 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>
                            Dokumen materi ini disediakan oleh <strong>{readingMaterial.author}</strong> untuk seluruh siswa kelas IX-H SMP Negeri 1 Bojongsari.
                          </span>
                        </div>
                      </div>

                      <div className="neu-flat rounded-2xl p-6 bg-white border border-gray-200 text-center space-y-4">
                        <FileText className="w-12 h-12 text-[#1C5FE0] mx-auto" />
                        <h4 className="font-heading font-bold text-base text-[#1F3A5F]">
                          Buka Dokumen / Buku Lengkap
                        </h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                          File siap diakses secara langsung atau diunduh ke penyimpanan perangkat Anda.
                        </p>
                        <div className="flex justify-center gap-3">
                          <a
                            href={readingMaterial.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="neu-btn px-5 py-2 rounded-xl text-xs font-heading font-bold text-[#1C5FE0] inline-flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Buka di Tab Baru</span>
                          </a>
                          <button
                            onClick={() => handleDownload(readingMaterial)}
                            className="neu-accent-btn px-5 py-2 rounded-xl text-xs font-heading font-bold inline-flex items-center gap-1.5"
                          >
                            <Download className="w-4 h-4" />
                            <span>Unduh Sekarang</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
};
