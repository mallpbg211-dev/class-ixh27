import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  GraduationCap,
  Sparkles,
  KeyRound,
  School,
  Compass,
  ShieldCheck,
  Camera,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Edit3,
} from 'lucide-react';
import { Student, UserRole } from '../types';

interface StudentModalProps {
  student: Student | null;
  currentRole: UserRole;
  onClose: () => void;
  onUpdateDream?: (id: number, newDream: string) => void;
  onUpdatePhoto?: (id: number, newPhotoUrl: string) => void;
  onUpdateBio?: (id: number, newBio: string) => void;
}

// Preset avatars suited for students (Boys & Girls)
const AVATAR_PRESETS = [
  {
    name: 'Putra 1',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
    gender: 'L',
  },
  {
    name: 'Putra 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    gender: 'L',
  },
  {
    name: 'Putra 3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    gender: 'L',
  },
  {
    name: 'Putri 1',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
    gender: 'P',
  },
  {
    name: 'Putri 2',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&auto=format&fit=crop&q=80',
    gender: 'P',
  },
  {
    name: 'Putri 3',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    gender: 'P',
  },
];

export const StudentModal: React.FC<StudentModalProps> = ({
  student,
  currentRole,
  onClose,
  onUpdateDream,
  onUpdatePhoto,
  onUpdateBio,
}) => {
  if (!student) return null;

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoMode, setPhotoMode] = useState<'UPLOAD' | 'PRESET' | 'URL'>('UPLOAD');
  const [urlInput, setUrlInput] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<string>(student.photoUrl || '');
  const [successNotice, setSuccessNotice] = useState('');

  // Editable fields
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [dreamInput, setDreamInput] = useState(student.dreamSchool || '');
  const [bioInput, setBioInput] = useState(student.bio || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = student.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  const isOfficer = student.role !== 'Anggota';

  // Handle image file selection with canvas resize & compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if image
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize & compress onto canvas
        const canvas = document.createElement('canvas');
        const MAX_DIM = 360;
        let width = img.width;
        let height = img.height;

        // Crop to square from center
        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;

        canvas.width = MAX_DIM;
        canvas.height = MAX_DIM;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, MAX_DIM, MAX_DIM);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewPhoto(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = () => {
    let finalUrl = previewPhoto;
    if (photoMode === 'URL') {
      finalUrl = urlInput.trim();
    }
    if (onUpdatePhoto) {
      onUpdatePhoto(student.id, finalUrl);
    }
    setIsEditingPhoto(false);
    setSuccessNotice('Foto profil berhasil disimpan! ✨');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const handleResetPhoto = () => {
    setPreviewPhoto('');
    setUrlInput('');
    if (onUpdatePhoto) {
      onUpdatePhoto(student.id, '');
    }
    setIsEditingPhoto(false);
    setSuccessNotice('Foto profil dikembalikan ke inisial!');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const handleSaveProfile = () => {
    if (onUpdateDream && dreamInput.trim()) {
      onUpdateDream(student.id, dreamInput.trim());
    }
    if (onUpdateBio && bioInput.trim()) {
      onUpdateBio(student.id, bioInput.trim());
    }
    setIsEditingProfile(false);
    setSuccessNotice('Biodata & cita-cita berhasil diperbarui!');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md neu-flat-lg rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/80 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95 z-10"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success toast */}
        {successNotice && (
          <div className="mb-3 px-3.5 py-2 rounded-2xl bg-emerald-500 text-white font-heading font-bold text-xs text-center shadow-md animate-fadeIn flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Card Header Banner */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1C5FE0]/10 text-[#1C5FE0] inline-block mb-3">
            Kartu Pelajar Digital IX-H
          </span>

          {/* Large Avatar / Photo with Interactive Camera Button */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-3">
            <div className="w-full h-full rounded-3xl neu-flat p-1.5 relative overflow-hidden group">
              {student.photoUrl ? (
                <img
                  src={student.photoUrl}
                  alt={student.name}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full rounded-2xl flex items-center justify-center font-heading font-extrabold text-2xl text-white ${
                    student.gender === 'L'
                      ? 'bg-gradient-to-br from-[#1C5FE0] to-[#1F3A5F]'
                      : 'bg-gradient-to-br from-[#EC4899] to-[#9D174D]'
                  }`}
                >
                  {initials}
                </div>
              )}

              {/* Hover overlay hint */}
              {currentRole !== 'SISWA' && (
                <button
                  onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-heading font-bold cursor-pointer"
                  title="Klik untuk ubah foto profil"
                >
                  <Camera className="w-5 h-5" />
                  <span>Ubah Foto</span>
                </button>
              )}
            </div>

            {/* Quick Camera Action Badge */}
            {currentRole !== 'SISWA' && (
              <button
                onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full neu-btn bg-[#E7EBF5] text-[#1C5FE0] flex items-center justify-center shadow-md active:scale-90 hover:text-[#1F3A5F] border border-white"
                title="Ganti Foto Profil Mandiri"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}

            {/* Officer Star Badge */}
            {isOfficer && (
              <span
                className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-md"
                title={`Pengurus Kelas: ${student.role}`}
              >
                &#9733;
              </span>
            )}
          </div>

          <h3 className="font-heading font-bold text-lg text-[#1F3A5F]">
            {student.name}
          </h3>
          <p className="text-xs text-[#5C6F84]">
            Panggilan: <span className="font-semibold text-[#1F3A5F]">"{student.nickname}"</span> &bull; Absen #{student.id} ({student.gender === 'L' ? 'Putra' : 'Putri'})
          </p>

          {isOfficer && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C5FE0]/10 text-[#1C5FE0] text-xs font-heading font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{student.role}</span>
            </div>
          )}

          {/* Quick Button to trigger Photo Changer */}
          {currentRole !== 'SISWA' ? (
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <button
                onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                className="neu-btn px-3 py-1 rounded-xl text-[11px] font-heading font-bold text-[#1C5FE0] hover:text-[#1F3A5F] flex items-center gap-1 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isEditingPhoto ? 'Batal Ganti Foto' : 'Ganti Foto Profil'}</span>
              </button>

              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="neu-btn px-3 py-1 rounded-xl text-[11px] font-heading font-bold text-[#5C6F84] hover:text-[#1F3A5F] flex items-center gap-1 active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Batal Edit' : 'Edit Biodata'}</span>
              </button>
            </div>
          ) : (
            <div className="mt-2 text-[11px] text-[#5C6F84] italic">
              Mode Siswa: Hanya Baca
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SELF-SERVICE PROFILE PHOTO EDITOR DRAWER */}
        {/* ========================================================================= */}
        {currentRole !== 'SISWA' && isEditingPhoto && (
          <div className="neu-inset rounded-2xl p-4 bg-[#E7EBF5]/70 border border-white/60 mb-4 animate-fadeIn space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-[#1F3A5F] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#1C5FE0]" />
                Pilih Metode Foto Profil
              </span>
              {student.photoUrl && (
                <button
                  onClick={handleResetPhoto}
                  className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Hapus Foto
                </button>
              )}
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center gap-1 bg-[#E7EBF5] neu-flat-sm p-1 rounded-xl">
              <button
                onClick={() => setPhotoMode('UPLOAD')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-heading font-bold transition-all ${
                  photoMode === 'UPLOAD' ? 'bg-[#1C5FE0] text-white shadow-xs' : 'text-[#5C6F84]'
                }`}
              >
                Upload File / HP
              </button>
              <button
                onClick={() => setPhotoMode('PRESET')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-heading font-bold transition-all ${
                  photoMode === 'PRESET' ? 'bg-[#1C5FE0] text-white shadow-xs' : 'text-[#5C6F84]'
                }`}
              >
                Karakter Preset
              </button>
              <button
                onClick={() => setPhotoMode('URL')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-heading font-bold transition-all ${
                  photoMode === 'URL' ? 'bg-[#1C5FE0] text-white shadow-xs' : 'text-[#5C6F84]'
                }`}
              >
                Tautan URL
              </button>
            </div>

            {/* Mode 1: Upload from local file / camera */}
            {photoMode === 'UPLOAD' && (
              <div className="space-y-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="neu-flat rounded-xl p-4 text-center cursor-pointer hover:bg-white/40 border border-dashed border-[#1C5FE0]/40 transition-colors"
                >
                  <Upload className="w-6 h-6 text-[#1C5FE0] mx-auto mb-1.5" />
                  <p className="font-heading font-bold text-xs text-[#1F3A5F]">
                    Klik untuk Pilih Foto dari HP / Galeri
                  </p>
                  <p className="text-[10px] text-[#5C6F84] mt-0.5">
                    Mendukung JPG, PNG &amp; WebP (otomatis dipotong pas &amp; dioptimasi)
                  </p>
                </div>

                {previewPhoto && previewPhoto !== student.photoUrl && (
                  <div className="flex items-center gap-3 neu-flat-sm p-2 rounded-xl bg-white/50">
                    <img
                      src={previewPhoto}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-emerald-600 block">
                        Foto baru terpilih!
                      </span>
                      <span className="text-[10px] text-[#5C6F84]">Siap disimpan ke profil</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Presets */}
            {photoMode === 'PRESET' && (
              <div className="space-y-2">
                <span className="text-[10px] text-[#5C6F84] block">
                  Pilih salah satu ilustrasi profil pelajar:
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewPhoto(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        previewPhoto === preset.url
                          ? 'border-[#1C5FE0] scale-105 shadow-md'
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      {previewPhoto === preset.url && (
                        <div className="absolute inset-0 bg-[#1C5FE0]/40 flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 3: URL */}
            {photoMode === 'URL' && (
              <div className="space-y-2">
                <label className="text-[10px] text-[#5C6F84] block font-semibold">
                  Tempel URL Gambar (Direct Link):
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setPreviewPhoto(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F] focus:outline-none"
                />
              </div>
            )}

            {/* Save Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/40">
              <button
                onClick={() => setIsEditingPhoto(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-heading font-semibold text-[#5C6F84] hover:text-[#1F3A5F]"
              >
                Batal
              </button>
              <button
                onClick={handleSavePhoto}
                className="neu-btn px-4 py-1.5 rounded-xl font-heading font-bold text-xs text-[#1C5FE0] hover:bg-[#1C5FE0]/10 flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Terapkan Foto</span>
              </button>
            </div>
          </div>
        )}

        {/* Detailed Information Inset Cards */}
        <div className="space-y-3">
          {/* Edit Profile Section */}
          {currentRole !== 'SISWA' && isEditingProfile ? (
            <div className="neu-inset rounded-2xl p-4 bg-[#E7EBF5]/70 border border-white/60 space-y-3 animate-fadeIn">
              <span className="font-heading font-bold text-xs text-[#1F3A5F] uppercase tracking-wider block">
                Ubah Biodata &amp; Sekolah Impian
              </span>

              <div>
                <label className="text-[10px] font-semibold text-[#5C6F84] block mb-1">
                  Cita-Cita / Bio Singkat:
                </label>
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs text-[#1F3A5F] focus:outline-none"
                  placeholder="Contoh: Menjadi Dokter Spesialis, Peneliti AI..."
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#5C6F84] block mb-1">
                  Target SMA / SMK Favorit:
                </label>
                <input
                  type="text"
                  value={dreamInput}
                  onChange={(e) => setDreamInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs text-[#1F3A5F] focus:outline-none"
                  placeholder="Contoh: SMAN 1 Purbalingga, SMKN 1..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1 text-xs text-[#5C6F84]"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="neu-btn px-4 py-1.5 rounded-xl font-heading font-bold text-xs text-[#10B981] flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Simpan Biodata
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cita-cita & Bio */}
              <div className="neu-inset rounded-2xl p-3.5 border border-white/40">
                <div className="flex items-center gap-2 text-[#1C5FE0] mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[11px] font-heading font-bold uppercase tracking-wider">
                    Cita-Cita &amp; Minat Profesi
                  </span>
                </div>
                <p className="text-xs text-[#1F3A5F] font-semibold pl-6">
                  {student.bio || 'Menjadi pribadi berkarakter dan berprestasi unggul'}
                </p>
              </div>

              {/* Target SMA/SMK Favorit */}
              <div className="neu-flat-sm rounded-2xl p-3.5 bg-[#E7EBF5]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-[#1F3A5F]">
                    <School className="w-4 h-4 text-[#1C5FE0]" />
                    <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-[#5C6F84]">
                      Target Sekolah Lanjutan
                    </span>
                  </div>
                </div>
                <p className="text-xs font-heading font-bold text-[#1F3A5F] pl-6">
                  {student.dreamSchool}
                </p>
              </div>
            </>
          )}

          {/* Status Kas & PIN Presensi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="neu-flat-sm rounded-2xl p-3 bg-[#E7EBF5] text-center">
              <span className="text-[10px] font-medium text-[#5C6F84] block mb-1">
                Iuran Kas Harian
              </span>
              <span className="text-xs font-heading font-bold text-[#10B981]">
                Rp 1.000 / Hari
              </span>
            </div>

            <div className="neu-flat-sm rounded-2xl p-3 bg-[#E7EBF5] text-center">
              <span className="text-[10px] font-medium text-[#5C6F84] block mb-1">
                {currentRole === 'SISWA' ? 'Status Kelas' : 'PIN Verifikasi'}
              </span>
              <span className="text-xs font-heading font-bold text-[#1C5FE0]">
                {currentRole === 'SISWA' ? 'Aktif (IX-H)' : `PIN: ${student.pin}`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#C4CAE0]/50">
          <span className="text-[10px] text-[#5C6F84]">
            ID Siswa: #{student.id} &bull; IX-H 2026/2027
          </span>
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
