import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link,
  RotateCcw,
  Check,
  Camera,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { fireConfetti } from '../utils/confettiHelper';
import { soundManager } from '../lib/gameAudio';

interface EditWaliPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl: string;
  waliName: string;
  waliSubject: string;
  onSave: (newUrl: string) => Promise<void> | void;
}

export const PRESET_WALI_AVATARS = [
  {
    title: 'Default Resmi',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    desc: 'Formal Pendidik',
  },
  {
    title: 'Guru Berhijab Elegan',
    url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&auto=format&fit=crop&q=80',
    desc: 'Seragam Guru',
  },
  {
    title: 'Pendidik Sains & IPA',
    url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&auto=format&fit=crop&q=80',
    desc: 'Ramah & Berwibawa',
  },
  {
    title: 'Formal Modern',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    desc: 'Studio Potret',
  },
  {
    title: 'Guru Inspiratif',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    desc: 'Hangat & Ceria',
  },
  {
    title: 'Akademisi Berdedikasi',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
    desc: 'Profesional Sekolah',
  },
];

export const EditWaliPhotoModal: React.FC<EditWaliPhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  waliName,
  waliSubject,
  onSave,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(currentPhotoUrl);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'URL' | 'PRESET'>('UPLOAD');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Compress image on client side into high-quality lightweight Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap pilih file gambar (JPG, PNG, atau WebP).');
      return;
    }

    setErrorMessage(null);
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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoUrl(compressedDataUrl);
          soundManager.playClick();
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMessage('Masukkan tautan / URL foto terlebih dahulu.');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      setErrorMessage('URL harus diawali dengan http:// atau https://');
      return;
    }
    setErrorMessage(null);
    setPhotoUrl(trimmed);
    soundManager.playClick();
  };

  const handleResetToDefault = () => {
    soundManager.playClick();
    setPhotoUrl(PRESET_WALI_AVATARS[0].url);
    setErrorMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(photoUrl);
      soundManager.playFanfare();
      fireConfetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal menyimpan foto profil.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-fade-in">
      <div className="w-full max-w-md bg-[#E7EBF5] dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/70 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#C4CAE0]/50 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl neu-hero p-0.5 flex items-center justify-center text-white bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#1F3A5F] dark:text-white">
                Ubah Foto Wali Kelas
              </h3>
              <p className="text-[11px] text-[#5C6F84] dark:text-slate-400">
                {waliName} &bull; {waliSubject}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-white dark:border-slate-700/60 shadow-sm text-center">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg overflow-hidden">
              <img
                src={photoUrl}
                alt={waliName}
                className="w-full h-full object-cover rounded-2xl"
                onError={() => {
                  setErrorMessage('Gagal memuat gambar dari URL tersebut. Coba pilih file atau foto lain.');
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 p-2 rounded-xl bg-[#1C5FE0] text-white shadow-md hover:bg-blue-500 active:scale-90 transition-all cursor-pointer"
              title="Unggah dari perangkat"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2.5">
            <span className="text-[10px] font-heading font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/15 text-[#1C5FE0] dark:text-blue-400">
              Pratinjau Foto Profil
            </span>
            <div className="font-heading font-bold text-sm text-[#1F3A5F] dark:text-white mt-1">
              {waliName}
            </div>
            <div className="text-[11px] text-[#5C6F84] dark:text-slate-400">
              {waliSubject}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Tabs: Upload / URL / Preset */}
        <div className="flex rounded-2xl bg-slate-200/80 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('UPLOAD');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'UPLOAD'
                ? 'bg-white dark:bg-slate-700 text-[#1C5FE0] dark:text-white shadow-sm'
                : 'text-[#5C6F84] dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Foto</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('PRESET');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'PRESET'
                ? 'bg-white dark:bg-slate-700 text-[#1C5FE0] dark:text-white shadow-sm'
                : 'text-[#5C6F84] dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pilihan Guru</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('URL');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'URL'
                ? 'bg-white dark:bg-slate-700 text-[#1C5FE0] dark:text-white shadow-sm'
                : 'text-[#5C6F84] dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Link URL</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'UPLOAD' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-blue-400/60 dark:border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-[#1C5FE0] dark:text-blue-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div className="font-heading font-bold text-xs text-[#1F3A5F] dark:text-white">
                Sentuh untuk Pilih Foto dari Galeri / Kamera
              </div>
              <p className="text-[11px] text-[#5C6F84] dark:text-slate-400">
                Mendukung JPG, PNG, WebP (otomatis dioptimalkan)
              </p>
            </div>
          </div>
        )}

        {activeTab === 'PRESET' && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#5C6F84] dark:text-slate-400 block">
              Pilih dari Koleksi Foto Pendidik Resmi:
            </span>
            <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {PRESET_WALI_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setPhotoUrl(preset.url);
                    setErrorMessage(null);
                  }}
                  className={`p-1.5 rounded-2xl border transition-all text-left flex flex-col items-center gap-1.5 cursor-pointer ${
                    photoUrl === preset.url
                      ? 'border-[#1C5FE0] bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-400/50'
                      : 'border-transparent bg-white/60 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9.5px] font-bold text-center leading-tight line-clamp-1 text-[#1F3A5F] dark:text-slate-200">
                    {preset.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'URL' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#5C6F84] dark:text-slate-400 block mb-1">
                Tautan / URL Gambar Online:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/foto-guru.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl neu-inset text-xs font-medium text-[#1F3A5F] dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2.5 rounded-xl bg-[#1C5FE0] text-white font-heading font-bold text-xs hover:bg-blue-600 transition-all cursor-pointer flex-shrink-0"
                >
                  Tinjau
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#C4CAE0]/50 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="neu-btn px-3 py-2.5 rounded-xl text-xs font-bold text-[#5C6F84] dark:text-slate-400 flex items-center gap-1.5 hover:text-[#1F3A5F] dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1C5FE0] to-blue-600 hover:from-blue-600 hover:to-indigo-600 text-white font-heading font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Terapkan Foto'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
