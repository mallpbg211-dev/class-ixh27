import React, { useState, useEffect } from 'react';
import { Timer, RotateCcw, AlertCircle, Zap } from 'lucide-react';
import { soundManager } from '../../lib/gameAudio';

interface GhostReflexGameProps {
  onFinish: (ms: number) => void;
}

export const GhostReflexGame: React.FC<GhostReflexGameProps> = ({ onFinish }) => {
  const [state, setState] = useState<'WAIT' | 'READY' | 'FALSE_START' | 'GO' | 'RESULT'>('WAIT');
  const [ms, setMs] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    let timeout: any;
    if (state === 'READY') {
      const wait = Math.floor(Math.random() * 2200) + 1600;
      timeout = setTimeout(() => {
        setStartTime(Date.now());
        setState('GO');
        soundManager.playTone(880, 'sine', 0.1, 0.15);
      }, wait);
    }
    return () => clearTimeout(timeout);
  }, [state]);

  const handleClick = () => {
    if (state === 'WAIT') {
      soundManager.playClick();
      setState('READY');
    } else if (state === 'READY') {
      soundManager.playWrong();
      setState('FALSE_START');
    } else if (state === 'GO') {
      const elapsed = Date.now() - startTime;
      soundManager.playCorrect();
      setMs(elapsed);
      setState('RESULT');
      onFinish(elapsed);
    } else if (state === 'FALSE_START' || state === 'RESULT') {
      soundManager.playClick();
      setState('READY');
    }
  };

  const getVerdict = (timeMs: number) => {
    if (timeMs < 200) return { label: '⚡ Dewa Refleks! Kecepatan luar biasa!', color: 'text-amber-300' };
    if (timeMs < 270) return { label: '🏃 Sangat Cepat & Tanggap!', color: 'text-emerald-400' };
    if (timeMs < 350) return { label: '👍 Refleks Normal Siswa SMP', color: 'text-cyan-400' };
    return { label: '☕ Agak Mengantuk, Kurang Fokus', color: 'text-slate-400' };
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full min-h-[380px] rounded-3xl flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-all duration-200 border ${
        state === 'READY'
          ? 'bg-rose-950/90 border-rose-800'
          : state === 'FALSE_START'
          ? 'bg-amber-950/90 border-amber-800'
          : state === 'GO'
          ? 'bg-emerald-600 border-emerald-400 shadow-2xl scale-[1.01]'
          : 'bg-slate-900 border-slate-800'
      }`}
    >
      {state === 'WAIT' && (
        <div className="space-y-4 max-w-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Timer className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-white">Ghost Reflex</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ketuk layar untuk bersiap, tahan jarimu, lalu sentuh layar secepat kilat tepat saat warna berubah <strong className="text-emerald-400">HIJAU</strong>!
          </p>
          <span className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
            Ketuk Layar untuk Mulai
          </span>
        </div>
      )}

      {state === 'READY' && (
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-3xl text-rose-300 animate-pulse">
            BERSIAP...
          </h3>
          <p className="text-xs text-rose-200 font-semibold">
            Tunggu warna hijau! Jangan sentuh dahulu!
          </p>
        </div>
      )}

      {state === 'FALSE_START' && (
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-amber-300">
            Terlalu Cepat!
          </h3>
          <p className="text-xs text-amber-200">
            Kamu menyentuh layar sebelum sinyal hijau muncul.
          </p>
          <span className="inline-block px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs">
            Ketuk untuk Coba Lagi
          </span>
        </div>
      )}

      {state === 'GO' && (
        <div className="space-y-2">
          <h3 className="font-heading font-black text-4xl text-white tracking-widest animate-bounce">
            SENTUH SEKARANG!
          </h3>
          <p className="text-xs text-emerald-100 font-bold">KLIK CEPAT!</p>
        </div>
      )}

      {state === 'RESULT' && (
        <div className="space-y-4 max-w-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 block font-bold">WAKTU REFLEKS KAMU</span>
            <span className="font-heading font-black text-5xl text-white">
              {ms} <span className="text-lg font-bold text-indigo-400">ms</span>
            </span>
          </div>
          <p className={`text-xs font-bold ${getVerdict(ms).color}`}>
            {getVerdict(ms).label}
          </p>
          <span className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700">
            Ketuk untuk Tes Lagi
          </span>
        </div>
      )}
    </div>
  );
};
