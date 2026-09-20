import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Flame,
} from 'lucide-react';
import { soundManager } from '../../lib/gameAudio';
import { GameNumpad } from './GameNumpad';

interface ExtremeAdditionGameProps {
  onFinish: (score: number) => void;
}

type GridSize = 3 | 4 | 5;

export const ExtremeAdditionGame: React.FC<ExtremeAdditionGameProps> = ({ onFinish }) => {
  // Settings
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [timeLimit, setTimeLimit] = useState<number>(35);
  const [blinkMode, setBlinkMode] = useState<boolean>(false);

  // Flow: 'CONFIG' | 'PLAY' | 'INPUT' | 'RESULT'
  const [phase, setPhase] = useState<'CONFIG' | 'PLAY' | 'INPUT' | 'RESULT'>('CONFIG');

  // Matrix data
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [realSum, setRealSum] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(35);
  const [blinkVisible, setBlinkVisible] = useState<boolean>(true);

  // Input & result
  const [playerInput, setPlayerInput] = useState<string>('');
  const [timeSpent, setTimeSpent] = useState<number>(0);

  const timerRef = useRef<any>(null);
  const blinkTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
    };
  }, []);

  const generateMatrix = () => {
    const rows: number[][] = [];
    let sum = 0;
    for (let r = 0; r < gridSize; r++) {
      const row: number[] = [];
      for (let c = 0; c < gridSize; c++) {
        // Numbers from 1 to 20 for 3x3, 1 to 15 for 4x4, 1 to 9 for 5x5 to keep it fun
        const maxVal = gridSize === 3 ? 20 : gridSize === 4 ? 15 : 12;
        const val = Math.floor(Math.random() * maxVal) + 1;
        row.push(val);
        sum += val;
      }
      rows.push(row);
    }
    setMatrix(rows);
    setRealSum(sum);
    return { rows, sum };
  };

  const handleStart = () => {
    soundManager.playClick();
    generateMatrix();
    setTimeLeft(timeLimit);
    setPlayerInput('');
    setPhase('PLAY');

    // Start countdown
    const startT = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp(Date.now() - startT);
          return 0;
        }
        if (prev <= 5) {
          soundManager.playTone(350, 'sine', 0.05, 0.08);
        }
        return prev - 1;
      });
    }, 1000);

    // If blink mode is on, toggle visibility every 1.5s
    if (blinkMode) {
      blinkTimerRef.current = setInterval(() => {
        setBlinkVisible((prev) => !prev);
      }, 1200);
    }
  };

  const handleTimeUp = (elapsedMs: number) => {
    if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
    setTimeSpent(Math.round(elapsedMs / 1000));
    setPhase('INPUT');
    soundManager.playTone(600, 'sine', 0.2);
  };

  const handleReadyToAnswer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
    const spent = timeLimit - timeLeft;
    setTimeSpent(spent);
    setPhase('INPUT');
    soundManager.playClick();
  };

  const handleSubmit = () => {
    const userVal = parseInt(playerInput, 10);
    const isCorrect = userVal === realSum;

    let earnedScore = 0;
    if (isCorrect) {
      soundManager.playCorrect();
      const speedBonus = Math.max(10, (timeLimit - timeSpent) * 4);
      earnedScore = gridSize * gridSize * 10 + speedBonus + (blinkMode ? 30 : 0);
    } else {
      soundManager.playWrong();
      const diff = Math.abs(userVal - realSum);
      if (diff <= 5) earnedScore = Math.max(10, Math.round(realSum * 0.2));
    }

    setPhase('RESULT');
    onFinish(earnedScore);
  };

  // Config Screen
  if (phase === 'CONFIG') {
    return (
      <div className="space-y-5 max-w-md mx-auto py-2">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
            Tabel Matriks Penjumlahan
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-white">Extreme Addition</h2>
          <p className="text-xs text-slate-400">
            Jumlahkan seluruh angka dalam tabel matriks sebelum waktu hitung mundur habis!
          </p>
        </div>

        <div className="space-y-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl">
          {/* Grid Size */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">
              Ukuran Tabel Matriks:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 3 as GridSize, label: '3 × 3 (9 Angka)' },
                { size: 4 as GridSize, label: '4 × 4 (16 Angka)' },
                { size: 5 as GridSize, label: '5 × 5 (25 Angka)' },
              ].map((item) => (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setGridSize(item.size);
                  }}
                  className={`py-3 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                    gridSize === item.size
                      ? 'bg-rose-500 text-white shadow-md scale-102 font-extrabold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Batas Waktu */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">Batas Waktu Menghitung:</label>
            <div className="grid grid-cols-3 gap-2">
              {[25, 40, 60].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setTimeLimit(sec);
                  }}
                  className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                    timeLimit === sec
                      ? 'bg-rose-500 text-white font-extrabold shadow-md scale-102'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {sec} Detik
                </button>
              ))}
            </div>
          </div>

          {/* Blink Challenge */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setBlinkMode(!blinkMode)}
              className={`w-full py-3 px-4 rounded-xl border font-heading font-bold text-xs flex items-center justify-between transition-colors ${
                blinkMode
                  ? 'bg-rose-950/60 text-rose-300 border-rose-600/70'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Mode Kedip (Blink Memory Challenge)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-white">
                {blinkMode ? 'AKTIF 🔥' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 active:scale-98 text-white font-heading font-extrabold text-base tracking-wide shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Mulai Extreme Addition</span>
        </button>
      </div>
    );
  }

  // Play Screen (Matrix table)
  if (phase === 'PLAY') {
    return (
      <div className="space-y-4 max-w-md mx-auto py-2">
        {/* Timer Bar */}
        <div className="flex items-center justify-between bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-xs font-bold text-slate-400">Sisa Waktu:</span>
            <span
              className={`font-heading font-black text-xl ${
                timeLeft <= 5 ? 'text-rose-400' : 'text-white'
              }`}
            >
              {timeLeft}s
            </span>
          </div>

          <button
            type="button"
            onClick={handleReadyToAnswer}
            className="py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-heading font-bold cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <span>Selesai & Jawab</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* The Grid Table */}
        <div className="bg-[#0B111E] p-3 sm:p-4 rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden">
          <div
            className={`grid gap-2 sm:gap-2.5 transition-opacity duration-200 ${
              blinkMode && !blinkVisible ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {matrix.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="aspect-square flex items-center justify-center bg-slate-900 border border-slate-750 rounded-2xl text-white font-heading font-black text-xl sm:text-2xl shadow-inner hover:border-rose-400/50 transition-colors"
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-400 font-medium">
          💡 Jumlahkan seluruh angka di kotak. Jika sudah hafal/selesai, klik tombol <strong>"Selesai & Jawab"</strong>!
        </p>
      </div>
    );
  }

  // Input Screen
  if (phase === 'INPUT') {
    return (
      <div className="space-y-4 max-w-sm mx-auto py-2">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
            WAKTU SELESAI
          </span>
          <h3 className="font-heading font-extrabold text-xl text-white">
            Berapa Jumlah Total Seluruh Angka?
          </h3>
        </div>

        <div className="bg-[#0D1424] border-2 border-rose-500/50 rounded-2xl p-4 text-center shadow-inner min-h-[64px] flex items-center justify-center">
          <span className="font-heading font-black text-4xl text-white tracking-wider">
            {playerInput !== '' ? playerInput : <span className="text-slate-600">?</span>}
          </span>
        </div>

        <GameNumpad
          value={playerInput}
          onChange={setPlayerInput}
          onSubmit={handleSubmit}
          allowNegative={false}
        />
      </div>
    );
  }

  // Result Screen
  const userNum = parseInt(playerInput, 10);
  const isCorrect = userNum === realSum;
  const diff = Math.abs(userNum - realSum);

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-5 max-w-sm mx-auto text-center py-6">
      <div
        className={`w-18 h-18 rounded-3xl flex items-center justify-center shadow-xl ${
          isCorrect
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
            : 'bg-rose-500/20 text-rose-400 border border-rose-400/40'
        }`}
      >
        {isCorrect ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
      </div>

      <div>
        <h3 className="font-heading font-extrabold text-2xl text-white">
          {isCorrect ? 'Hebat Sekali! 🔥' : 'Belum Tepat!'}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {isCorrect
            ? 'Ketelitian penjumlahan tabelmu sungguh luar biasa!'
            : `Hasil hitunganmu selisih: ${diff}`}
        </p>
      </div>

      <div className="w-full grid grid-cols-2 gap-3 bg-slate-900/90 p-4 rounded-3xl border border-slate-800">
        <div className="p-3 bg-slate-800/60 rounded-2xl">
          <span className="text-[10px] text-slate-400 block font-bold">JAWABAN KAMU</span>
          <span
            className={`font-heading font-black text-2xl ${
              isCorrect ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isNaN(userNum) ? '-' : userNum}
          </span>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-2xl">
          <span className="text-[10px] text-slate-400 block font-bold">JUMLAH ASLI</span>
          <span className="font-heading font-black text-2xl text-rose-400">
            {realSum}
          </span>
        </div>

        <div className="col-span-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 px-1">
          <span className="text-slate-400">
            Waktu: <strong className="text-white">{timeSpent} detik</strong>
          </span>
          <span className="text-rose-400 font-bold">
            Tabel {gridSize}×{gridSize} ({gridSize * gridSize} kotak)
          </span>
        </div>
      </div>

      <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={handleStart}
          className="flex-1 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-heading font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Main Lagi</span>
        </button>

        <button
          type="button"
          onClick={() => setPhase('CONFIG')}
          className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-heading font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>Ubah Ukuran</span>
        </button>
      </div>
    </div>
  );
};
