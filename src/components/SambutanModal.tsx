import React from 'react';
import { X, Sparkles, Heart, Quote, Camera } from 'lucide-react';
import { CLASS_METADATA, DEFAULT_WALI_KELAS } from '../data/classData';
import { WaliKelasInfo, ClassConfig } from '../types';

interface SambutanModalProps {
  isOpen: boolean;
  onClose: () => void;
  waliKelasInfo?: WaliKelasInfo;
  classConfig?: ClassConfig;
  onOpenEditPhoto?: () => void;
}

export const SambutanModal: React.FC<SambutanModalProps> = ({
  isOpen,
  onClose,
  waliKelasInfo,
  classConfig,
  onOpenEditPhoto,
}) => {
  if (!isOpen) return null;

  const name = classConfig?.waliKelas || waliKelasInfo?.name || CLASS_METADATA.waliKelas;
  const nip = waliKelasInfo?.nip || CLASS_METADATA.waliKelasNip;
  const subject = classConfig?.waliKelasSubject || waliKelasInfo?.subject || CLASS_METADATA.waliKelasSubject;
  const avatarUrl = classConfig?.waliKelasAvatarUrl || waliKelasInfo?.avatarUrl || DEFAULT_WALI_KELAS.avatarUrl;
  const title = waliKelasInfo?.greetingTitle || CLASS_METADATA.sambutanWaliKelas.title;
  const greetingText = waliKelasInfo?.greetingText || CLASS_METADATA.sambutanWaliKelas.quote;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-fadeIn">
      <div className="relative w-full max-w-lg neu-flat-lg rounded-3xl p-6 bg-[#E7EBF5] border border-white/80 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95 cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Teacher Header */}
        <div className="flex items-center gap-4 mb-5 pr-8">
          <div className="relative group/avatar flex-shrink-0">
            <div
              onClick={() => onOpenEditPhoto?.()}
              className="w-16 h-16 rounded-2xl neu-hero p-1 cursor-pointer overflow-hidden relative group"
              title="Klik untuk ganti foto profil"
            >
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover rounded-xl"
              />
              {onOpenEditPhoto && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            {onOpenEditPhoto && (
              <button
                type="button"
                onClick={() => onOpenEditPhoto()}
                className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-[#1C5FE0] text-white shadow-sm hover:bg-blue-600 transition-colors cursor-pointer"
                title="Ubah Foto Profil"
              >
                <Camera className="w-3 h-3" />
              </button>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1C5FE0]/15 text-[#1C5FE0]">
                Wali Kelas IX-H
              </span>
              {onOpenEditPhoto && (
                <button
                  type="button"
                  onClick={() => onOpenEditPhoto()}
                  className="text-[10px] font-bold text-[#1C5FE0] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Camera className="w-2.5 h-2.5" />
                  <span>Ubah Foto</span>
                </button>
              )}
            </div>
            <h3 className="font-heading font-bold text-lg text-[#1F3A5F] mt-1">
              {name}
            </h3>
            <p className="text-xs text-[#5C6F84]">
              {subject} &bull; NIP: {nip}
            </p>
          </div>
        </div>

        {/* Highlight Card */}
        <div className="neu-inset rounded-2xl p-4 mb-5 border border-white/40">
          <div className="flex items-start gap-2 text-[#1C5FE0] mb-1">
            <Quote className="w-5 h-5 flex-shrink-0" />
            <span className="font-heading font-bold text-sm">
              "{title}"
            </span>
          </div>
          <p className="text-xs text-[#334D6E] leading-relaxed italic pl-7 whitespace-pre-line">
            {greetingText}
          </p>
        </div>

        {/* Detailed message */}
        <div className="space-y-3 text-xs text-[#2A4365] leading-relaxed">
          <p>
            Anak-anakku yang dibanggakan, tidak terasa perjalanan kita di kelas IX sudah mencapai puncaknya. Waktu berlari begitu cepat, dan di depan mata telah menanti asesmen sekolah, ujian kelulusan, dan gerbang seleksi SMA/SMK impian.
          </p>
          <p>
            Ibu berpesan 3 hal pokok untuk 32 siswa kelas IX-H tercinta:
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full neu-flat-sm flex items-center justify-center font-bold text-[#1C5FE0] text-[10px] flex-shrink-0">1</span>
              <span><strong>Jaga Kedisiplinan &amp; Kejujuran</strong>: Datang tepat waktu, ikuti jadwal piket dengan tuntas, dan kerjakan evaluasi dengan hati yang jujur.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full neu-flat-sm flex items-center justify-center font-bold text-[#1C5FE0] text-[10px] flex-shrink-0">2</span>
              <span><strong>Tolong-Menolong Tanpa Pilih Kasih</strong>: Apabila ada kawan yang kesulitan memahami materi matematika atau sains, mari belajar kelompok bersama.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full neu-flat-sm flex items-center justify-center font-bold text-[#1C5FE0] text-[10px] flex-shrink-0">3</span>
              <span><strong>Jaga Nama Baik Kelas IX-H</strong>: Ruang kelas adalah rumah kita kedua. Kebersihan dan ketertiban adalah cermin martabat keluarga besar kita.</span>
            </li>
          </ul>
          <p className="pt-2 text-[#5C6F84]">
            Mari kita buktikan bersama bahwa seluruh 32 siswa kelas IX-H akan lulus 100% dengan senyum kemenangan dan siap melangkah ke jenjang masa depan emas!
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="neu-accent-btn px-6 py-2.5 rounded-2xl font-heading font-semibold text-xs active:scale-95"
          >
            Tutup Pesan
          </button>
        </div>
      </div>
    </div>
  );
};
