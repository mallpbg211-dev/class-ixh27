import React from 'react';
import { X, Target, Compass, CheckCircle2 } from 'lucide-react';
import { CLASS_METADATA } from '../data/classData';

interface VisiMisiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisiMisiModal: React.FC<VisiMisiModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-fadeIn">
      <div className="relative w-full max-w-lg neu-flat-lg rounded-3xl p-6 bg-[#E7EBF5] border border-white/80 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full neu-btn flex items-center justify-center text-[#1F3A5F] active:scale-95"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl neu-hero flex items-center justify-center text-white">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#1F3A5F]">
              Visi & Misi Kelas IX-H
            </h3>
            <p className="text-xs text-[#5C6F84]">
              Tahun Ajaran {CLASS_METADATA.academicYear} &bull; SMP Negeri 1
            </p>
          </div>
        </div>

        {/* Visi Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-[#1C5FE0]">
            <Compass className="w-4 h-4" />
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider">
              Visi Kelas
            </h4>
          </div>
          <div className="neu-inset rounded-2xl p-4 border border-white/50">
            <p className="text-xs text-[#1F3A5F] font-medium leading-relaxed italic">
              "{CLASS_METADATA.vision}"
            </p>
          </div>
        </div>

        {/* Misi Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-[#1C5FE0]">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider">
              4 Pilar Misi Utama
            </h4>
          </div>
          <div className="space-y-3">
            {CLASS_METADATA.missions.map((mission, index) => (
              <div
                key={index}
                className="neu-flat-sm rounded-2xl p-3.5 flex items-start gap-3 bg-[#E7EBF5]"
              >
                <div className="w-6 h-6 rounded-full bg-[#1C5FE0]/10 text-[#1C5FE0] font-heading font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-xs text-[#2C3E55] leading-relaxed font-medium">
                  {mission}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Motto Badge */}
        <div className="mt-6 neu-inset-sm rounded-2xl p-3 text-center bg-[#E7EBF5]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6F84] block mb-0.5">
            Semboyan Angkatan
          </span>
          <span className="text-xs font-heading font-bold text-[#1C5FE0]">
            "{CLASS_METADATA.motto}"
          </span>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="neu-btn px-6 py-2 rounded-2xl font-heading font-semibold text-xs text-[#1F3A5F] active:scale-95"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};
