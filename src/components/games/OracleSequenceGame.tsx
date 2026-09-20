import React, { useState } from 'react';
import { RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { soundManager } from '../../lib/gameAudio';

interface OracleSequenceGameProps {
  onFinish: (score: number) => void;
}

export const OracleSequenceGame: React.FC<OracleSequenceGameProps> = ({ onFinish }) => {
  const [seq, setSeq] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [activeLight, setActiveLight] = useState<number | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const colors = [
    { bg: '#3B82F6', label: 'Biru' },
    { bg: '#10B981', label: 'Hijau' },
    { bg: '#F59E0B', label: 'Kuning' },
    { bg: '#8B5CF6', label: 'Ungu' },
  ];

  const startNextSeq = (currentSeq: number[]) => {
    setIsPlayingSeq(true);
    setUserStep(0);
    const next = [...currentSeq, Math.floor(Math.random() * 4)];
    setSeq(next);

    next.forEach((colorIdx, i) => {
      setTimeout(() => {
        setActiveLight(colorIdx);
        soundManager.playRune(colorIdx);
        setTimeout(() => setActiveLight(null), 380);

        if (i === next.length - 1) {
          setTimeout(() => setIsPlayingSeq(false), 450);
        }
      }, (i + 1) * 650);
    });
  };

  const handleClick = (idx: number) => {
    if (isPlayingSeq || isGameOver || seq.length === 0) return;

    soundManager.playRune(idx);
    setActiveLight(idx);
    setTimeout(() => setActiveLight(null), 250);

    if (seq[userStep] === idx) {
      if (userStep + 1 === seq.length) {
        soundManager.playCorrect();
        const nextScore = seq.length * 15;
        setScore(nextScore);
        setTimeout(() => startNextSeq(seq), 700);
      } else {
        setUserStep((u) => u + 1);
      }
    } else {
      soundManager.playWrong();
      setIsGameOver(true);
      onFinish(score);
    }
  };

  return (
    <div className="space-y-5 max-w-xs mx-auto text-center py-4">
      <div className="flex justify-between text-xs text-slate-400">
        <span>Ronde: <strong className="text-white">{seq.length}</strong></span>
        <span className="text-indigo-400 font-bold">Skor: {score}</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {colors.map((item, i) => (
          <button
            key={i}
            disabled={isPlayingSeq || isGameOver || seq.length === 0}
            onClick={() => handleClick(i)}
            style={{
              backgroundColor: activeLight === i ? '#FFFFFF' : item.bg,
              boxShadow: activeLight === i ? `0 0 25px ${item.bg}` : undefined,
            }}
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl transition-all duration-150 active:scale-95 ${
              activeLight === i ? 'scale-105' : 'opacity-85 hover:opacity-100'
            }`}
          />
        ))}
      </div>

      <div className="min-h-[30px]">
        {isPlayingSeq && (
          <span className="text-xs text-indigo-300 font-bold animate-pulse">
            👁️ Perhatikan urutan rune mistis...
          </span>
        )}
        {!isPlayingSeq && seq.length > 0 && !isGameOver && (
          <span className="text-xs text-emerald-400 font-bold">
            Giliranmu! Langkah {userStep + 1} dari {seq.length}
          </span>
        )}
      </div>

      {seq.length === 0 && !isGameOver && (
        <button
          onClick={() => {
            soundManager.playClick();
            setScore(0);
            startNextSeq([]);
          }}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-heading font-bold text-xs text-white shadow-lg cursor-pointer active:scale-98 transition-all"
        >
          Mulai Urutan Rune
        </button>
      )}

      {isGameOver && (
        <div className="space-y-3">
          <p className="text-rose-400 font-bold text-xs">Urutan salah!</p>
          <button
            onClick={() => {
              soundManager.playClick();
              setIsGameOver(false);
              setScore(0);
              startNextSeq([]);
            }}
            className="w-full py-2.5 rounded-xl bg-blue-600 font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Urutan Baru</span>
          </button>
        </div>
      )}
    </div>
  );
};
