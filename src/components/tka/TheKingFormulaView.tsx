import React, { useState } from 'react';
import { Crown, Sparkles, Zap, Search, BookOpen, CheckCircle } from 'lucide-react';
import { THE_KING_FORMULAS } from './tkaData';
import { MathRenderer } from './MathFormulaDisplay';

export const TheKingFormulaView: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = THE_KING_FORMULAS.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.formula.toLowerCase().includes(search.toLowerCase()) ||
      item.example.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24">
      {/* Banner The King */}
      <div className="neu-flat rounded-3xl p-6 bg-[#E7EBF5] border border-white/80 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800">
                Formula Sakti
              </span>
              <span className="text-xs text-gray-500 font-medium">Metode The King</span>
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-bold text-gray-900">
              Bank Rumus & Solusi Cepat "The King"
            </h2>
          </div>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Kumpulan rumus baku, operasi hitung nyata, pola logika, dan trik cerdas menyelesaikan soal TKA (Matematika &amp; Logika) hanya dalam 15–30 detik tanpa perhitungan berbelit-belit.
        </p>

        {/* Search input */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Cari trik atau rumus The King (misal: pythagoras, deret, diskon, silogisme)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* List of Formulas */}
      <div className="space-y-3.5">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-3 transition-all hover:translate-y-[-2px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </span>
                <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900">
                  {item.title}
                </h3>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600" />
                <span>15 Detik</span>
              </span>
            </div>

            {/* Formula Highlight Box with Authentic Math Layout */}
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-300 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  Formula Sakti The King:
                </span>
                <span className="text-[10px] font-mono font-medium text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                  Rumus Baku
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-amber-950 whitespace-pre-line tracking-wide leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-200/80">
                <MathRenderer text={item.formula} />
              </div>
            </div>

            {/* Example Case */}
            <div className="text-xs text-gray-700 space-y-1">
              <span className="font-semibold text-gray-900">Contoh Soal Nyata:</span>
              <div className="italic bg-white/60 p-2.5 rounded-xl border border-gray-100">
                <MathRenderer text={item.example} />
              </div>
            </div>

            {/* Shortcut Execution with Step-by-Step Mathematical Operations */}
            <div className="p-3 rounded-2xl bg-white/85 border border-emerald-200 text-xs text-gray-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Operasi Hitungan &amp; Solusi Kilat:</span>
              </div>
              <div className="font-medium text-emerald-950 whitespace-pre-line leading-relaxed font-mono text-[11.5px] bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                <MathRenderer text={item.shortcut} />
              </div>
            </div>

            {/* Benefit */}
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{item.benefit}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="neu-flat rounded-2xl p-8 text-center text-gray-500 text-xs bg-[#E7EBF5]">
            Tidak ada rumus The King yang cocok dengan kata kunci pencarian.
          </div>
        )}
      </div>
    </div>
  );
};
