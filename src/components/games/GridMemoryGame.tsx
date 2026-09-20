import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  RotateCw,
} from 'lucide-react';
import { soundManager } from '../../lib/gameAudio';

interface GridMemoryGameProps {
  onFinish: (score: number) => void;
}

type ChallengeMode = 'normal' | 'shift' | 'rotate';

interface SessionData {
  gridSize: number;
  initialLit: number[];
  targetLit: number[];
  shiftDesc?: string;
  shiftArrow?: 'up' | 'down' | 'left' | 'right';
  rotDeg?: 90;
}

export const GridMemoryGame: React.FC<GridMemoryGameProps> = ({ onFinish }) => {
  // Settings
  const [chalMode, setChalMode] = useState<ChallengeMode>('normal');
  const [totalSessions, setTotalSessions] = useState<number>(5);

  // Flow: 'CONFIG' | 'MEMORIZE' | 'TRANSFORM' | 'RECALL' | 'RESULT'
  const [phase, setPhase] = useState<'CONFIG' | 'MEMORIZE' | 'TRANSFORM' | 'RECALL' | 'RESULT'>('CONFIG');

  const [currentSessionIdx, setCurrentSessionIdx] = useState<number>(0);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  // Selected cells by user
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [revealMistakes, setRevealMistakes] = useState<boolean>(false);

  // Scores
  const [sessionScores, setSessionScores] = useState<number[]>([]);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const createSession = (idx: number): SessionData => {
    // Grid size starts at 3x3 for rounds 1-2, 4x4 for rounds 3+
    const size = idx < 2 ? 3 : idx < 4 ? 4 : 4;
    const totalCells = size * size;
    const litCount = idx < 2 ? 3 : idx < 4 ? 4 : 5;

    // Pick random cells
    const allIndices = Array.from({ length: totalCells }, (_, i) => i);
    // Shuffle
    allIndices.sort(() => Math.random() - 0.5);
    const lit = allIndices.slice(0, litCount);

    if (chalMode === 'normal') {
      return {
        gridSize: size,
        initialLit: lit,
        targetLit: lit,
      };
    }

    if (chalMode === 'shift') {
      // Shift 1 step
      const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      let dr = 0;
      let dc = 0;
      if (dir === 'up') dr = -1;
      if (dir === 'down') dr = 1;
      if (dir === 'left') dc = -1;
      if (dir === 'right') dc = 1;

      const shiftedTarget = lit.map((idx) => {
        const r = Math.floor(idx / size);
        const c = idx % size;
        const newR = (r + dr + size) % size;
        const newC = (c + dc + size) % size;
        return newR * size + newC;
      });

      const labelDir = dir === 'up' ? 'Geser 1 Kotak ke Atas ⬆️' : dir === 'down' ? 'Geser 1 Kotak ke Bawah ⬇️' : dir === 'left' ? 'Geser 1 Kotak ke Kiri ⬅️' : 'Geser 1 Kotak ke Kanan ➡️';

      return {
        gridSize: size,
        initialLit: lit,
        targetLit: shiftedTarget,
        shiftDesc: labelDir,
        shiftArrow: dir,
      };
    }

    // Rotate 90 deg clockwise
    const rotatedTarget = lit.map((idx) => {
      const r = Math.floor(idx / size);
      const c = idx % size;
      // 90 deg clockwise: newR = c, newC = size - 1 - r
      const newR = c;
      const newC = size - 1 - r;
      return newR * size + newC;
    });

    return {
      gridSize: size,
      initialLit: lit,
      targetLit: rotatedTarget,
      rotDeg: 90,
      shiftDesc: 'Putar Pola 90° Searah Jarum Jam ↻',
    };
  };

  const handleStart = () => {
    soundManager.playClick();
    setSessionScores([]);
    setCurrentSessionIdx(0);
    startRound(0);
  };

  const startRound = (roundIdx: number) => {
    const sData = createSession(roundIdx);
    setSessionData(sData);
    setSelectedCells([]);
    setRevealMistakes(false);
    setPhase('MEMORIZE');
    soundManager.playTone(520, 'sine', 0.15);

    // Memorize for 2.2 seconds
    timerRef.current = setTimeout(() => {
      if (chalMode !== 'normal') {
        // Show transform instruction
        setPhase('TRANSFORM');
        soundManager.playTone(660, 'triangle', 0.15);
        timerRef.current = setTimeout(() => {
          setPhase('RECALL');
          soundManager.playTone(780, 'sine', 0.15);
        }, 1600);
      } else {
        setPhase('RECALL');
        soundManager.playTone(780, 'sine', 0.15);
      }
    }, 2400);
  };

  const handleCellClick = (cellIdx: number) => {
    if (phase !== 'RECALL' || !sessionData) return;
    soundManager.playClick();

    if (selectedCells.includes(cellIdx)) {
      setSelectedCells(selectedCells.filter((c) => c !== cellIdx));
    } else {
      if (selectedCells.length < sessionData.targetLit.length) {
        setSelectedCells([...selectedCells, cellIdx]);
      }
    }
  };

  const handleVerifyRound = () => {
    if (!sessionData) return;
    setRevealMistakes(true);

    // Calculate match
    const correctCount = selectedCells.filter((c) => sessionData.targetLit.includes(c)).length;
    const isPerfect = correctCount === sessionData.targetLit.length && selectedCells.length === sessionData.targetLit.length;

    let roundPoints = isPerfect ? 20 : Math.round((correctCount / sessionData.targetLit.length) * 15);
    if (chalMode !== 'normal' && isPerfect) roundPoints += 5; // bonus difficulty

    if (isPerfect) soundManager.playCorrect();
    else soundManager.playWrong();

    const newScores = [...sessionScores, roundPoints];
    setSessionScores(newScores);

    // Wait 1.6s then next round or finish
    timerRef.current = setTimeout(() => {
      if (currentSessionIdx + 1 < totalSessions) {
        const nextIdx = currentSessionIdx + 1;
        setCurrentSessionIdx(nextIdx);
        startRound(nextIdx);
      } else {
        setPhase('RESULT');
        const total = newScores.reduce((a, b) => a + b, 0);
        onFinish(total);
      }
    }, 1800);
  };

  // Config View
  if (phase === 'CONFIG') {
    return (
      <div className="space-y-5 max-w-md mx-auto py-2">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
            Matriks Visual & Logika Spasial
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-white">Grid Memory</h2>
          <p className="text-xs text-slate-400">
            Ingat letak kotak yang menyala. Tantang otakmu dengan mode rotasi dan pergeseran koordinat!
          </p>
        </div>

        <div className="space-y-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl">
          {/* Challenge Mode */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">
              Mode Tantangan Spasial:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal' as ChallengeMode, label: 'Normal', icon: '🧠', desc: 'Hafal Pola Asli' },
                { id: 'shift' as ChallengeMode, label: 'Shift / Geser', icon: '⇄', desc: 'Geser 1 Langkah' },
                { id: 'rotate' as ChallengeMode, label: 'Rotasi 90°', icon: '↻', desc: 'Putar Jarum Jam' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setChalMode(item.id);
                  }}
                  className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer border ${
                    chalMode === item.id
                      ? 'bg-purple-600 border-purple-400 text-white shadow-md scale-102 font-bold'
                      : 'bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <span className="text-xl block mb-0.5">{item.icon}</span>
                  <span className="font-heading font-extrabold text-xs block">{item.label}</span>
                  <span className="text-[9px] text-slate-400 block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sesi Ronde */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">Jumlah Babak (Ronde):</label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setTotalSessions(num);
                  }}
                  className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                    totalSessions === num
                      ? 'bg-purple-600 text-white font-extrabold shadow-md scale-102'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {num} Babak
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-98 text-white font-heading font-extrabold text-base tracking-wide shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Mulai Grid Memory</span>
        </button>
      </div>
    );
  }

  // Active Game Screens
  if (!sessionData) return null;
  const { gridSize, initialLit, targetLit, shiftDesc, shiftArrow, rotDeg } = sessionData;
  const totalCells = gridSize * gridSize;

  return (
    <div className="space-y-4 max-w-sm mx-auto py-2 select-none">
      {/* Round HUD */}
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800">
        <span className="text-xs font-bold text-slate-400">
          Babak <strong className="text-purple-400 font-extrabold text-sm">{currentSessionIdx + 1}</strong> / {totalSessions}
        </span>

        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
          Mode {chalMode}
        </span>
      </div>

      {/* Instruction banner */}
      <div className="text-center min-h-[48px] flex flex-col items-center justify-center">
        {phase === 'MEMORIZE' && (
          <div className="animate-pulse flex items-center gap-1.5 text-amber-300 font-heading font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Hafalkan posisi kotak yang menyala!</span>
          </div>
        )}

        {phase === 'TRANSFORM' && (
          <div className="animate-bounce bg-purple-950/80 border border-purple-500/60 text-purple-200 px-4 py-2 rounded-2xl text-xs font-heading font-extrabold flex items-center gap-2">
            {rotDeg ? <RotateCw className="w-4 h-4 text-purple-300" /> : <ArrowRight className="w-4 h-4 text-purple-300" />}
            <span>{shiftDesc}</span>
          </div>
        )}

        {phase === 'RECALL' && (
          <div className="text-slate-300 text-xs font-medium">
            {chalMode === 'normal' ? (
              <span>Pilih kembali <strong>{targetLit.length} kotak</strong> yang tadi menyala:</span>
            ) : (
              <span className="text-purple-300 font-bold">
                Tebak posisi kotak setelah: <em>{shiftDesc}</em>!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid Matrix */}
      <div className="bg-[#0B111E] p-3 sm:p-4 rounded-3xl border-2 border-slate-800 shadow-2xl">
        <div
          className="grid gap-2 sm:gap-2.5"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: totalCells }, (_, cellIdx) => {
            const isInitialLit = initialLit.includes(cellIdx);
            const isTargetLit = targetLit.includes(cellIdx);
            const isSelected = selectedCells.includes(cellIdx);

            let cellStyle = 'bg-slate-900 border-slate-750 text-slate-700';

            if (phase === 'MEMORIZE' && isInitialLit) {
              cellStyle = 'bg-purple-500 border-purple-300 text-white shadow-lg shadow-purple-500/50 scale-98';
            } else if (phase === 'RECALL') {
              if (revealMistakes) {
                if (isSelected && isTargetLit) {
                  cellStyle = 'bg-emerald-500 border-emerald-300 text-white shadow-md';
                } else if (isSelected && !isTargetLit) {
                  cellStyle = 'bg-rose-500 border-rose-300 text-white shadow-md';
                } else if (!isSelected && isTargetLit) {
                  cellStyle = 'bg-amber-500/50 border-amber-400 text-amber-200 border-dashed';
                }
              } else if (isSelected) {
                cellStyle = 'bg-purple-500 border-purple-400 text-white shadow-md';
              }
            }

            return (
              <button
                key={cellIdx}
                type="button"
                disabled={phase !== 'RECALL' || revealMistakes}
                onClick={() => handleCellClick(cellIdx)}
                className={`aspect-square rounded-2xl border-2 font-heading font-extrabold text-base transition-all flex items-center justify-center cursor-pointer ${cellStyle}`}
              >
                {phase === 'MEMORIZE' && isInitialLit && '★'}
                {phase === 'RECALL' && isSelected && !revealMistakes && '✓'}
                {revealMistakes && isSelected && isTargetLit && '✓'}
                {revealMistakes && isSelected && !isTargetLit && '✕'}
                {revealMistakes && !isSelected && isTargetLit && '○'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Button in Recall Phase */}
      {phase === 'RECALL' && (
        <div className="pt-2">
          <button
            type="button"
            disabled={selectedCells.length === 0 || revealMistakes}
            onClick={handleVerifyRound}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-98 disabled:opacity-40 disabled:pointer-events-none text-white font-heading font-extrabold text-sm tracking-wide shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Periksa Jawaban ({selectedCells.length}/{targetLit.length})</span>
          </button>
        </div>
      )}

      {/* Result Screen */}
      {phase === 'RESULT' && (
        <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/20 text-purple-400 border border-purple-400/40 flex items-center justify-center shadow-xl">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h3 className="font-heading font-extrabold text-2xl text-white">
              Selesai Seluruh Babak! 🎉
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Skor Total: <strong>{sessionScores.reduce((a, b) => a + b, 0)} Poin</strong>
            </p>
          </div>

          <div className="w-full bg-slate-900/90 p-4 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold block">REKAP PER BABAK:</span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {sessionScores.map((sc, i) => (
                <div key={i} className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-purple-300 border border-slate-700">
                  R{i + 1}: +{sc}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 w-full pt-1">
            <button
              type="button"
              onClick={handleStart}
              className="flex-1 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
              <span>Setelan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
