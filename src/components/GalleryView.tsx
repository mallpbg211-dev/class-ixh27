import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Calendar,
  Filter,
  ZoomIn,
  FileText,
  Download,
  Plus,
  X,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  Search,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryPhoto, ClassMinutes, UserRole, ClassConfig } from '../types';
import { GALLERY_PHOTOS, INITIAL_MINUTES, CLASS_METADATA } from '../data/classData';
import { exportMinutesToPDF } from '../utils/exportUtils';
import { fireConfetti } from '../utils/confettiHelper';

interface GalleryViewProps {
  currentRole?: UserRole;
  classConfig?: ClassConfig;
}

type SubTab = 'berita_acara' | 'dokumentasi';

const STORAGE_KEY_MINUTES = 'ixh_class_minutes_v1';

export const GalleryView: React.FC<GalleryViewProps> = ({
  currentRole = 'SISWA',
  classConfig,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('berita_acara');

  // Minutes state (loaded from initial data + local storage)
  const [minutesList, setMinutesList] = useState<ClassMinutes[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MINUTES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_MINUTES;
  });

  const [searchMinutes, setSearchMinutes] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState<ClassMinutes | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Modal tambah berita acara
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMinutesForm, setNewMinutesForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    time: '13:00 - 14:30 WIB',
    location: 'Ruang Kelas IX-H',
    agenda: '',
    content: '',
    leader: 'Hikmal Syukri Febriyanto',
    notetaker: 'Sabrina Nur Salsabila',
    attendeesCount: 32,
    decisionsStr: '',
  });

  // Photo gallery state
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const photoCategories = ['Semua', 'Prestasi', 'Kegiatan', 'Rapat', 'Dokumentasi'];

  const filteredPhotos =
    selectedCategory === 'Semua'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === selectedCategory);

  const filteredMinutes = minutesList.filter((m) => {
    const q = searchMinutes.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.agenda.toLowerCase().includes(q) ||
      m.content.toLowerCase().includes(q) ||
      m.date.includes(q)
    );
  });

  const handleExportMinutesPdf = async (minutes: ClassMinutes) => {
    setIsExportingPdf(true);
    try {
      const className = classConfig?.name || CLASS_METADATA.name;
      const waliKelas = classConfig?.waliKelas || CLASS_METADATA.waliKelas;
      await exportMinutesToPDF(
        minutes,
        'SMP NEGERI 1 BOJONGSARI',
        className,
        waliKelas,
        CLASS_METADATA.waliKelasNip
      );
      fireConfetti({ particleCount: 25 });
    } catch (err: unknown) {
      console.error('Gagal export Berita Acara PDF:', err);
      alert('Gagal mengunduh Berita Acara PDF: ' + ((err as Error).message || String(err)));
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveNewMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinutesForm.title.trim() || !newMinutesForm.agenda.trim()) {
      alert('Judul dan agenda musyawarah/rapat wajib diisi!');
      return;
    }

    const decisions = newMinutesForm.decisionsStr
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const createdMinutes: ClassMinutes = {
      id: `ba-${Date.now()}`,
      title: newMinutesForm.title.trim(),
      date: newMinutesForm.date,
      time: newMinutesForm.time.trim() || '13:00 - 14:30 WIB',
      location: newMinutesForm.location.trim() || 'Ruang Kelas IX-H',
      agenda: newMinutesForm.agenda.trim(),
      content: newMinutesForm.content.trim() || newMinutesForm.agenda.trim(),
      leader: newMinutesForm.leader.trim() || 'Ketua Kelas IX-H',
      notetaker: newMinutesForm.notetaker.trim() || 'Sekretaris Kelas IX-H',
      attendeesCount: Number(newMinutesForm.attendeesCount) || 32,
      decisions: decisions.length > 0 ? decisions : ['Musyawarah berjalan lancar dengan persetujuan bersama.'],
      createdAt: new Date().toISOString(),
    };

    const updated = [createdMinutes, ...minutesList];
    setMinutesList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_MINUTES, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setShowAddModal(false);
    setNewMinutesForm({
      title: '',
      date: new Date().toISOString().slice(0, 10),
      time: '13:00 - 14:30 WIB',
      location: 'Ruang Kelas IX-H',
      agenda: '',
      content: '',
      leader: 'Hikmal Syukri Febriyanto',
      notetaker: 'Sabrina Nur Salsabila',
      attendeesCount: 32,
      decisionsStr: '',
    });

    fireConfetti({ particleCount: 30 });
    setSelectedMinutes(createdMinutes);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 pt-2 space-y-5">
      {/* Header Banner & Sub-Tabs Navigation */}
      <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl neu-hero flex items-center justify-center text-white flex-shrink-0">
              {activeSubTab === 'berita_acara' ? (
                <FileText className="w-6 h-6" />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#1C5FE0]">
                Arsip &amp; Dokumentasi Kelas
              </span>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#1F3A5F]">
                {activeSubTab === 'berita_acara'
                  ? 'Arsip Berita Acara & Rapat'
                  : 'Dokumentasi Galeri Foto'}
              </h2>
            </div>
          </div>

          {/* Sub-Tab Switcher Pills */}
          <div className="flex items-center p-1 rounded-2xl neu-inset bg-[#E7EBF5] gap-1 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('berita_acara')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'berita_acara'
                  ? 'bg-[#1C5FE0] text-white shadow-sm'
                  : 'text-[#5C6F84] hover:text-[#1F3A5F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Berita Acara</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeSubTab === 'berita_acara'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#C4CAE0]/50 text-[#5C6F84]'
                }`}
              >
                {minutesList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('dokumentasi')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'dokumentasi'
                  ? 'bg-[#1C5FE0] text-white shadow-sm'
                  : 'text-[#5C6F84] hover:text-[#1F3A5F]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Dokumentasi</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeSubTab === 'dokumentasi'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#C4CAE0]/50 text-[#5C6F84]'
                }`}
              >
                {GALLERY_PHOTOS.length}
              </span>
            </button>
          </div>
        </div>

        <p className="text-xs text-[#5C6F84] leading-relaxed">
          {activeSubTab === 'berita_acara'
            ? 'Kumpulan catatan resmi hasil rapat, musyawarah pengurus, dan ketetapan mufakat kelas IX-H yang dapat dibaca dan diunduh dalam format PDF resmi.'
            : 'Arsip potret dokumentasi kegiatan pembelajaran, perlombaan classmeeting, proyek penguatan profil pelajar, dan kebersamaan keluarga IX-H.'}
        </p>

        {/* Action / Filter Row based on Active Sub-Tab */}
        {activeSubTab === 'berita_acara' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-[#C4CAE0]/50">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6F84]" />
              <input
                type="text"
                value={searchMinutes}
                onChange={(e) => setSearchMinutes(e.target.value)}
                placeholder="Cari berita acara atau agenda rapat..."
                className="w-full pl-9 pr-3 py-2 rounded-xl neu-inset text-xs text-[#1F3A5F] placeholder-[#8B9BB0] focus:outline-none"
              />
            </div>

            {currentRole !== 'SISWA' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#1C5FE0] hover:bg-[#154bb3] text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Berita Acara</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pt-4 no-scrollbar border-t border-[#C4CAE0]/50 mt-4">
            {photoCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'neu-btn-active bg-[#1C5FE0] text-white shadow-inner'
                    : 'neu-btn text-[#1F3A5F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- SUB-TAB 1: BERITA ACARA ---------------- */}
      {activeSubTab === 'berita_acara' && (
        <div className="space-y-3.5">
          {filteredMinutes.length === 0 ? (
            <div className="neu-flat rounded-3xl p-8 bg-[#E7EBF5] text-center text-[#5C6F84]">
              <FileText className="w-10 h-10 mx-auto text-[#C4CAE0] mb-2" />
              <p className="font-heading font-bold text-sm text-[#1F3A5F]">
                Tidak ada Berita Acara ditemukan
              </p>
              <p className="text-xs text-[#5C6F84] mt-1">
                {searchMinutes
                  ? `Tidak ada hasil pencarian untuk "${searchMinutes}"`
                  : 'Belum ada arsip musyawarah atau rapat yang dicatat.'}
              </p>
            </div>
          ) : (
            filteredMinutes.map((item, index) => (
              <div
                key={item.id}
                className="neu-flat rounded-3xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/80 hover:translate-y-[-2px] transition-transform duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-heading font-extrabold px-2 py-0.5 rounded-full bg-[#1C5FE0]/10 text-[#1C5FE0]">
                          No. BA-{item.id.replace(/\D/g, '') || index + 1}
                        </span>
                        <span className="text-xs text-[#5C6F84] font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#1C5FE0]" />
                          {new Date(item.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-[#1F3A5F] leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                    <button
                      onClick={() => setSelectedMinutes(item)}
                      className="px-3 py-1.5 rounded-xl neu-btn text-xs font-heading font-bold text-[#1F3A5F] hover:text-[#1C5FE0] flex items-center gap-1 active:scale-95"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#1C5FE0]" />
                      <span>Baca</span>
                    </button>
                    <button
                      onClick={() => handleExportMinutesPdf(item)}
                      disabled={isExportingPdf}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                      title="Unduh Berita Acara format PDF Resmi"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh PDF</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl neu-inset text-xs text-[#5C6F84] mb-3 leading-relaxed">
                  <div className="font-bold text-[#1F3A5F] mb-0.5">Agenda Pokok:</div>
                  <p>{item.agenda}</p>
                </div>

                {/* Metadata badges footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#C4CAE0]/40 text-[11px] text-[#5C6F84]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#1C5FE0]" />
                      {item.location || 'Ruang Kelas IX-H'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-600" />
                      {item.attendeesCount || 32} Peserta Hadir
                    </span>
                    <span className="text-[11px]">
                      Pimpinan: <strong>{item.leader}</strong>
                    </span>
                  </div>

                  {item.decisions && item.decisions.length > 0 && (
                    <span className="text-emerald-700 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
                      {item.decisions.length} Poin Kesepakatan
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------------- SUB-TAB 2: DOKUMENTASI FOTO ---------------- */}
      {activeSubTab === 'dokumentasi' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="neu-flat rounded-3xl p-3.5 bg-[#E7EBF5] flex flex-col justify-between cursor-pointer hover:translate-y-[-2px] transition-all group border border-white/70"
            >
              <div>
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-3 relative neu-inset-sm">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#1F3A5F]/85 text-white text-[10px] font-heading font-bold shadow">
                    {photo.category}
                  </div>
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="p-2.5 rounded-full bg-white/25">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1F3A5F] line-clamp-2 leading-snug group-hover:text-[#1C5FE0] transition-colors">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-[#5C6F84] mt-1 line-clamp-2 leading-normal">
                  {photo.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#C4CAE0]/40 flex items-center justify-between text-[10px] text-[#8B9BB0]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#1C5FE0]" />
                  {photo.date}
                </span>
                <span className="font-bold text-[#1C5FE0]">IX-H Official</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- MODAL DETAIL BERITA ACARA ---------------- */}
      <AnimatePresence>
        {selectedMinutes && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedMinutes(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="neu-flat-lg rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] max-w-xl w-full border border-white/80 max-h-[90vh] overflow-y-auto space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 border-b border-[#C4CAE0]/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl neu-hero flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#1C5FE0]">
                      Dokumen Resmi Musyawarah Kelas
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#1F3A5F] leading-tight">
                      {selectedMinutes.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMinutes(null)}
                  className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#5C6F84] active:scale-95 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Info Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="neu-inset p-2.5 rounded-xl">
                  <span className="text-[10px] text-[#5C6F84] block font-bold">Tanggal</span>
                  <strong className="text-[#1F3A5F]">{selectedMinutes.date}</strong>
                </div>
                <div className="neu-inset p-2.5 rounded-xl">
                  <span className="text-[10px] text-[#5C6F84] block font-bold">Waktu &amp; Tempat</span>
                  <strong className="text-[#1F3A5F] truncate block">
                    {selectedMinutes.time || '13:00'} &bull; {selectedMinutes.location || 'Kelas IX-H'}
                  </strong>
                </div>
                <div className="neu-inset p-2.5 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#5C6F84] block font-bold">Kehadiran</span>
                  <strong className="text-emerald-600">
                    {selectedMinutes.attendeesCount || 32} Peserta Hadir
                  </strong>
                </div>
              </div>

              {/* Agenda Box */}
              <div className="p-3.5 rounded-2xl neu-inset text-xs space-y-1">
                <div className="font-heading font-bold text-[#1F3A5F]">Agenda Acara:</div>
                <p className="text-[#5C6F84] leading-relaxed">{selectedMinutes.agenda}</p>
              </div>

              {/* Content / Summary */}
              <div className="text-xs space-y-1.5">
                <div className="font-heading font-bold text-[#1F3A5F]">Ringkasan Jalannya Musyawarah:</div>
                <div className="p-3.5 rounded-2xl bg-white/60 text-[#1F3A5F] leading-relaxed border border-[#C4CAE0]/40 whitespace-pre-line">
                  {selectedMinutes.content}
                </div>
              </div>

              {/* Decisions list */}
              {selectedMinutes.decisions && selectedMinutes.decisions.length > 0 && (
                <div className="text-xs space-y-2">
                  <div className="font-heading font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Keputusan Bersama yang Disepakati:</span>
                  </div>
                  <div className="space-y-1.5 pl-1">
                    {selectedMinutes.decisions.map((dec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#1F3A5F]"
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{dec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#C4CAE0]/40 text-xs">
                <div className="neu-flat p-3 rounded-2xl text-center bg-[#E7EBF5]">
                  <span className="text-[10px] text-[#5C6F84] block mb-4">Pimpinan Rapat</span>
                  <strong className="text-[#1F3A5F] block">{selectedMinutes.leader}</strong>
                  <span className="text-[10px] text-[#5C6F84]">Ketua Kelas IX-H</span>
                </div>
                <div className="neu-flat p-3 rounded-2xl text-center bg-[#E7EBF5]">
                  <span className="text-[10px] text-[#5C6F84] block mb-4">Notulis Rapat</span>
                  <strong className="text-[#1F3A5F] block">{selectedMinutes.notetaker}</strong>
                  <span className="text-[10px] text-[#5C6F84]">Sekretaris IX-H</span>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMinutes(null)}
                  className="px-4 py-2 rounded-xl neu-btn text-xs font-heading font-bold text-[#5C6F84]"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleExportMinutesPdf(selectedMinutes)}
                  disabled={isExportingPdf}
                  className="px-4 py-2 rounded-xl bg-[#1C5FE0] hover:bg-[#154bb3] text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- MODAL TAMBAH BERITA ACARA (ADMIN ONLY) ---------------- */}
      <AnimatePresence>
        {showAddModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="neu-flat-lg rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] max-w-lg w-full border border-white/80 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#C4CAE0]/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl neu-hero flex items-center justify-center text-white">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#1F3A5F]">
                      Buat Berita Acara Baru
                    </h3>
                    <span className="text-[10px] text-[#5C6F84]">
                      Pencatatan resmi musyawarah &amp; rapat kelas
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#5C6F84] active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveNewMinutes} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#1F3A5F] block mb-1">
                    Judul Acara / Rapat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMinutesForm.title}
                    onChange={(e) =>
                      setNewMinutesForm({ ...newMinutesForm, title: e.target.value })
                    }
                    placeholder="Contoh: Rapat Koordinasi Persiapan Asesmen Akhir"
                    className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#5C6F84] block mb-1">Tanggal</label>
                    <input
                      type="date"
                      required
                      value={newMinutesForm.date}
                      onChange={(e) =>
                        setNewMinutesForm({ ...newMinutesForm, date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#5C6F84] block mb-1">Waktu</label>
                    <input
                      type="text"
                      value={newMinutesForm.time}
                      onChange={(e) =>
                        setNewMinutesForm({ ...newMinutesForm, time: e.target.value })
                      }
                      placeholder="13:00 - 14:30 WIB"
                      className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#5C6F84] block mb-1">Tempat</label>
                    <input
                      type="text"
                      value={newMinutesForm.location}
                      onChange={(e) =>
                        setNewMinutesForm({ ...newMinutesForm, location: e.target.value })
                      }
                      placeholder="Ruang Kelas IX-H"
                      className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#5C6F84] block mb-1">Jumlah Peserta</label>
                    <input
                      type="number"
                      value={newMinutesForm.attendeesCount}
                      onChange={(e) =>
                        setNewMinutesForm({
                          ...newMinutesForm,
                          attendeesCount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#1F3A5F] block mb-1">
                    Agenda Rapat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newMinutesForm.agenda}
                    onChange={(e) =>
                      setNewMinutesForm({ ...newMinutesForm, agenda: e.target.value })
                    }
                    placeholder="Tuliskan pokok agenda pembahasan..."
                    className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1F3A5F] block mb-1">
                    Ringkasan Hasil Pembahasan
                  </label>
                  <textarea
                    rows={3}
                    value={newMinutesForm.content}
                    onChange={(e) =>
                      setNewMinutesForm({ ...newMinutesForm, content: e.target.value })
                    }
                    placeholder="Uraian ringkas jalannya rapat dan aspirasi siswa..."
                    className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1F3A5F] block mb-1">
                    Poin Keputusan Bersama (Satu per baris)
                  </label>
                  <textarea
                    rows={3}
                    value={newMinutesForm.decisionsStr}
                    onChange={(e) =>
                      setNewMinutesForm({ ...newMinutesForm, decisionsStr: e.target.value })
                    }
                    placeholder="Contoh:&#10;1. Disetujui iuran tambahan study tour Rp 15.000&#10;2. Penugasan seksi perlengkapan"
                    className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#5C6F84] block mb-1">Pimpinan Rapat</label>
                    <input
                      type="text"
                      value={newMinutesForm.leader}
                      onChange={(e) =>
                        setNewMinutesForm({ ...newMinutesForm, leader: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#5C6F84] block mb-1">Notulis</label>
                    <input
                      type="text"
                      value={newMinutesForm.notetaker}
                      onChange={(e) =>
                        setNewMinutesForm({ ...newMinutesForm, notetaker: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl neu-inset text-xs font-semibold text-[#1F3A5F]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#C4CAE0]/50 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl neu-btn text-xs font-heading font-bold text-[#5C6F84]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#1C5FE0] hover:bg-[#154bb3] text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simpan Berita Acara</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- LIGHTBOX FOTO DOKUMENTASI ---------------- */}
      <AnimatePresence>
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActivePhoto(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="neu-flat-lg rounded-3xl p-5 bg-[#E7EBF5] max-w-lg w-full border border-white/80 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#1C5FE0] px-3 py-0.5 rounded-full bg-[#1C5FE0]/10">
                  {activePhoto.category} &bull; {activePhoto.date}
                </span>
                <button
                  onClick={() => setActivePhoto(null)}
                  className="w-8 h-8 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full h-72 rounded-2xl overflow-hidden neu-inset-sm mb-3.5">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-heading font-bold text-base text-[#1F3A5F] mb-1.5">
                {activePhoto.title}
              </h4>
              <p className="text-xs text-[#5C6F84] leading-relaxed">
                {activePhoto.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#C4CAE0]/50 flex items-center justify-between text-xs text-[#5C6F84]">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#1C5FE0]" />
                  {activePhoto.date}
                </span>
                <span className="font-heading font-bold text-[#1C5FE0]">
                  Kelas IX-H SMPN 1 Bojongsari
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
