import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { soundManager } from '../../lib/gameAudio';
import { GameNumpad } from './GameNumpad';

interface MentalCalculationGameProps {
  onFinish: (score: number) => void;
}

type SpeedMode = 1200 | 800 | 500 | 350;

interface StepItem {
  op: '+' | '-' | '×';
  num: number;
}

export const MentalCalculationGame: React.FC<MentalCalculationGameProps> = ({ onFinish }) => {
  // Settings
  const [count, setCount] = useState<number>(6); // 6 numbers
  const [speed, setSpeed] = useState<SpeedMode>(800); // 0.8s default
  const [digits, setDigits] = useState<'1' | '2' | 'mix'>('mix');
  const [allowMinus, setAllowMinus] = useState<boolean>(true);

  // Game flow states: 'CONFIG' | 'COUNTDOWN' | 'STREAM' | 'INPUT' | 'RESULT'
  const [phase, setPhase] = useState<'CONFIG' | 'COUNTDOWN' | 'STREAM' | 'INPUT' | 'RESULT'>('CONFIG');
  const [countdown, setCountdown] = useState<number>(3);

  // Stream data
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [actualTotal, setActualTotal] = useState<number>(0);

  // Input data
  const [playerInput, setPlayerInput] = useState<string>('');
  const [inputStartTime, setInputStartTime] = useState<number>(0);
  const [timeTakenSec, setTimeTakenSec] = useState<number>(0);

  const streamTimerRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearTimeout(streamTimerRef.current);
    };
  }, []);

  // Generate sequence
  const generateSequence = () => {
    const list: StepItem[] = [];
    let runningTotal = 0;

    for (let i = 0; i < count; i++) {
      let num = 0;
      if (digits === '1') {
        num = Math.floor(Math.random() * 9) + 1;
      } else if (digits === '2') {
        num = Math.floor(Math.random() * 85) + 10;
      } else {
        num = Math.random() > 0.4 ? Math.floor(Math.random() * 45) + 5 : Math.floor(Math.random() * 9) + 1;
      }

      if (i === 0) {
        list.push({ op: '+', num });
        runningTotal = num;
      } else {
        // Can be - if allowed and won't go negative
        const canMinus = allowMinus && runningTotal > num;
        const op: '+' | '-' = canMinus && Math.random() > 0.5 ? '-' : '+';
        list.push({ op, num });
        if (op === '+') runningTotal += num;
        else runningTotal -= num;
      }
    }

    setSteps(list);
    setActualTotal(runningTotal);
    return list;
  };

  const handleStart = () => {
    soundManager.playClick();
    generateSequence();
    setPhase('COUNTDOWN');
    setCountdown(3);
    setPlayerInput('');
  };

  // Countdown 3, 2, 1
  useEffect(() => {
    if (phase !== 'COUNTDOWN') return;
    soundManager.playTone(440, 'sine', 0.1);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startStreaming();
          return 0;
        }
        soundManager.playTone(440, 'sine', 0.1);
        return prev - 1;
      });
    }, 850);
    return () => clearInterval(timer);
  }, [phase]);

  const startStreaming = () => {
    setPhase('STREAM');
    setCurrentStepIdx(0);
    soundManager.playTone(660, 'triangle', 0.12, 0.15);
  };

  // Stepping through stream
  useEffect(() => {
    if (phase !== 'STREAM') return;

    streamTimerRef.current = setTimeout(() => {
      if (currentStepIdx + 1 < steps.length) {
        const nextIdx = currentStepIdx + 1;
        setCurrentStepIdx(nextIdx);
        soundManager.playTone(550 + nextIdx * 40, 'triangle', 0.08, 0.12);
      } else {
        // Finished streaming, go to input
        setPhase('INPUT');
        setInputStartTime(Date.now());
        soundManager.playTone(880, 'sine', 0.2, 0.15);
      }
    }, speed);

    return () => clearTimeout(streamTimerRef.current);
  }, [phase, currentStepIdx, steps.length, speed]);

  const handleSubmitAnswer = () => {
    const timeTaken = Math.max(0.5, (Date.now() - inputStartTime) / 1000);
    setTimeTakenSec(timeTaken);

    const userVal = parseInt(playerInput, 10);
    const isCorrect = userVal === actualTotal;

    let earnedScore = 0;
    if (isCorrect) {
      soundManager.playCorrect();
      // Base score per count + speed bonus
      const speedMultiplier = speed <= 500 ? 1.5 : speed <= 800 ? 1.2 : 1.0;
      earnedScore = Math.round(count * 20 * speedMultiplier);
    } else {
      soundManager.playWrong();
      const diff = Math.abs(userVal - actualTotal);
      if (diff <= 3) earnedScore = Math.max(10, Math.round(count * 5));
    }

    setPhase('RESULT');
    onFinish(earnedScore);
  };

  // Render 1: Configuration Menu (inspired by Christ's Game Hub)
  if (phase === 'CONFIG') {
    return (
      <div className="space-y-5 max-w-md mx-auto py-2">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            Flash Anzan IQ Game
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-white">Mental Calculation</h2>
          <p className="text-xs text-slate-400">
            Hitung angka yang muncul bergantian di layar secara kilat, lalu masukkan total akhirnya!
          </p>
        </div>

        <div className="space-y-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl">
          {/* Jumlah Angka */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">
              Banyak Angka yang Berkedip:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[4, 6, 8, 12].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setCount(n);
                  }}
                  className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                    count === n
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md scale-102'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {n} Angka
                </button>
              ))}
            </div>
          </div>

          {/* Kecepatan Interval */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">
              Kecepatan Kilat (Interval):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Santai', ms: 1200 as SpeedMode },
                { label: 'Sedang', ms: 800 as SpeedMode },
                { label: 'Cepat', ms: 500 as SpeedMode },
                { label: 'Kilat ⚡', ms: 350 as SpeedMode },
              ].map((item) => (
                <button
                  key={item.ms}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSpeed(item.ms);
                  }}
                  className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                    speed === item.ms
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md scale-102'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Digit & Minus */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1.5">Digit Angka:</label>
              <select
                value={digits}
                onChange={(e) => setDigits(e.target.value as any)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 font-heading font-bold text-xs outline-none focus:border-cyan-400"
              >
                <option value="1">1 Digit (1 - 9)</option>
                <option value="2">2 Digit (10 - 99)</option>
                <option value="mix">Campuran (Mudah - Sedang)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1.5">Operasi:</label>
              <button
                type="button"
                onClick={() => setAllowMinus(!allowMinus)}
                className={`w-full py-2 px-3 rounded-xl font-heading font-bold text-xs border transition-colors flex items-center justify-center gap-1.5 ${
                  allowMinus
                    ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {allowMinus ? '+ Tambah & - Kurang' : '+ Hanya Penjumlahan'}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-slate-950 font-heading font-extrabold text-base tracking-wide shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Mulai Flash Anzan</span>
        </button>
      </div>
    );
  }

  // Render 2: Countdown 3, 2, 1
  if (phase === 'COUNTDOWN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[380px] space-y-4">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest animate-pulse">
          Fokuskan Pandangan pada Layar!
        </span>
        <div className="font-heading font-black text-8xl text-white animate-bounce tracking-tighter">
          {countdown > 0 ? countdown : 'GO!'}
        </div>
        <p className="text-xs text-slate-400">Siap-siap berhitung dalam pikiran...</p>
      </div>
    );
  }

  // Render 3: Stream screen (Numbers flash rapidly one by one!)
  if (phase === 'STREAM') {
    const current = steps[currentStepIdx] || { op: '+', num: 0 };
    return (
      <div className="flex flex-col items-center justify-between min-h-[400px] py-6 select-none">
        {/* Top Progress */}
        <div className="flex items-center justify-between w-full max-w-sm text-xs text-slate-400 px-2">
          <span>Angka {currentStepIdx + 1} dari {steps.length}</span>
          <span className="text-cyan-400 font-bold">{speed}ms</span>
        </div>

        {/* Big Flash Number & Operator */}
        <div className="my-auto flex items-center justify-center gap-3">
          {currentStepIdx > 0 && (
            <span
              className={`font-heading font-black text-6xl sm:text-7xl ${
                current.op === '+' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {current.op}
            </span>
          )}
          <span className="font-heading font-black text-7xl sm:text-9xl text-white tracking-tight animate-scaleIn">
            {current.num}
          </span>
        </div>

        {/* Progress Dots at bottom */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i <= currentStepIdx
                  ? 'w-4 bg-cyan-400'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Render 4: Input Answer screen with Sleek Numpad
  if (phase === 'INPUT') {
    return (
      <div className="space-y-4 max-w-sm mx-auto py-2">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
            STREAM SELESAI
          </span>
          <h3 className="font-heading font-extrabold text-xl text-white">
            Berapa Hasil Akhirnya?
          </h3>
        </div>

        {/* Display Answer Input */}
        <div className="bg-[#0D1424] border-2 border-cyan-500/50 rounded-2xl p-4 text-center shadow-inner min-h-[64px] flex items-center justify-center">
          <span className="font-heading font-black text-4xl text-white tracking-wider">
            {playerInput !== '' ? playerInput : <span className="text-slate-600">?</span>}
          </span>
        </div>

        {/* Custom Numpad */}
        <GameNumpad
          value={playerInput}
          onChange={setPlayerInput}
          onSubmit={handleSubmitAnswer}
          allowNegative={allowMinus}
        />
      </div>
    );
  }

  // Render 5: Result Screen with comparison and stats
  const userNum = parseInt(playerInput, 10);
  const isCorrect = userNum === actualTotal;
  const diff = Math.abs(userNum - actualTotal);

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
          {isCorrect ? 'Tepat Sekali! 🎉' : 'Kurang Tepat!'}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {isCorrect
            ? 'Kalkulasi mentalmu sangat akurat dan cepat!'
            : `Selisih hitunganmu: ${diff}`}
        </p>
      </div>

      {/* Comparison Box */}
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
          <span className="text-[10px] text-slate-400 block font-bold">JAWABAN ASLI</span>
          <span className="font-heading font-black text-2xl text-cyan-300">
            {actualTotal}
          </span>
        </div>

        <div className="col-span-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 px-1">
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            Waktu Jawab: <strong className="text-white">{timeTakenSec.toFixed(1)} detik</strong>
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            {speed}ms &bull; {count} angka
          </span>
        </div>
      </div>

      <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={handleStart}
          className="flex-1 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
          <span>Ubah Setelan</span>
        </button>
      </div>
    </div>
  );
};
