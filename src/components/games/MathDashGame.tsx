import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Trophy,
  Zap,
  Flag,
  Users,
  Bot,
  Flame,
} from 'lucide-react';
import { soundManager } from '../../lib/gameAudio';

interface MathDashGameProps {
  onFinish: (score: number) => void;
}

interface Question {
  text: string;
  answer: number;
  options: number[];
}

interface Racer {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isBot: boolean;
  progress: number; // 0 to 100%
  speedFactor: number;
}

export const MathDashGame: React.FC<MathDashGameProps> = ({ onFinish }) => {
  const TARGET_GOAL = 8; // 8 correct answers to reach finish line

  // Difficulty & settings
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

  // Game flow: 'CONFIG' | 'RACE' | 'FINISHED'
  const [phase, setPhase] = useState<'CONFIG' | 'RACE' | 'FINISHED'>('CONFIG');

  // Racers
  const [racers, setRacers] = useState<Racer[]>([
    { id: 'p1', name: 'Kamu (IX-H)', avatar: '🏎️', color: 'from-amber-400 to-orange-500', isBot: false, progress: 0, speedFactor: 1 },
    { id: 'b1', name: 'BOT-Alpha', avatar: '🤖', color: 'from-cyan-400 to-blue-500', isBot: true, progress: 0, speedFactor: 0.8 },
    { id: 'b2', name: 'BOT-Beta', avatar: '🚀', color: 'from-purple-400 to-pink-500', isBot: true, progress: 0, speedFactor: 0.9 },
    { id: 'b3', name: 'BOT-Gamma', avatar: '⚡', color: 'from-emerald-400 to-teal-500', isBot: true, progress: 0, speedFactor: 1.0 },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [winner, setWinner] = useState<Racer | null>(null);

  const botIntervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    };
  }, []);

  const generateQuestion = (): Question => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0;
    let b = 0;
    let ans = 0;

    if (op === '+') {
      a = Math.floor(Math.random() * 40) + 5;
      b = Math.floor(Math.random() * 40) + 5;
      ans = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * (a - 5)) + 5;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 11) + 2;
      b = Math.floor(Math.random() * 11) + 2;
      ans = a * b;
    }

    // Generate 3 wrong options
    const options = new Set<number>([ans]);
    while (options.size < 4) {
      const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = Math.max(1, ans + offset);
      options.add(wrong);
    }

    const optsArray = Array.from(options).sort(() => Math.random() - 0.5);
    return {
      text: `${a} ${op} ${b}`,
      answer: ans,
      options: optsArray,
    };
  };

  const startRace = () => {
    soundManager.playClick();
    const initialRacers: Racer[] = [
      { id: 'p1', name: 'Kamu (IX-H)', avatar: '🏎️', color: 'from-amber-400 to-orange-500', isBot: false, progress: 0, speedFactor: 1 },
      { id: 'b1', name: 'BOT-Alpha', avatar: '🤖', color: 'from-cyan-400 to-blue-500', isBot: true, progress: 0, speedFactor: difficulty === 'easy' ? 0.6 : difficulty === 'normal' ? 0.8 : 0.95 },
      { id: 'b2', name: 'BOT-Beta', avatar: '🚀', color: 'from-purple-400 to-pink-500', isBot: true, progress: 0, speedFactor: difficulty === 'easy' ? 0.7 : difficulty === 'normal' ? 0.85 : 1.05 },
      { id: 'b3', name: 'BOT-Gamma', avatar: '⚡', color: 'from-emerald-400 to-teal-500', isBot: true, progress: 0, speedFactor: difficulty === 'easy' ? 0.75 : difficulty === 'normal' ? 0.9 : 1.15 },
    ];
    setRacers(initialRacers);
    setPlayerScore(0);
    setStreak(0);
    setWinner(null);
    setCurrentQuestion(generateQuestion());
    setPhase('RACE');

    // Bot loop
    const tickInterval = 1200;
    botIntervalRef.current = setInterval(() => {
      setRacers((prevRacers) => {
        let reachedFinish: Racer | null = null;

        const updated = prevRacers.map((r) => {
          if (!r.isBot) return r;
          // Bot has chance to step
          const chance = 0.55 * r.speedFactor;
          if (Math.random() < chance) {
            const nextProg = Math.min(100, r.progress + Math.round(100 / TARGET_GOAL));
            if (nextProg >= 100 && !reachedFinish) {
              reachedFinish = { ...r, progress: nextProg };
            }
            return { ...r, progress: nextProg };
          }
          return r;
        });

        if (reachedFinish) {
          clearInterval(botIntervalRef.current);
          handleFinish(reachedFinish);
        }

        return updated;
      });
    }, tickInterval);
  };

  const handlePlayerAnswer = (chosen: number) => {
    if (!currentQuestion || phase !== 'RACE') return;

    if (chosen === currentQuestion.answer) {
      soundManager.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);

      setRacers((prevRacers) => {
        let reachedFinish: Racer | null = null;
        const updated = prevRacers.map((r) => {
          if (r.id === 'p1') {
            const nextProg = Math.min(100, r.progress + Math.round(100 / TARGET_GOAL));
            if (nextProg >= 100) {
              reachedFinish = { ...r, progress: 100 };
            }
            return { ...r, progress: nextProg };
          }
          return r;
        });

        if (reachedFinish) {
          clearInterval(botIntervalRef.current);
          handleFinish(reachedFinish);
        }

        return updated;
      });

      setPlayerScore((prev) => prev + 15 + newStreak * 3);
      setCurrentQuestion(generateQuestion());
    } else {
      soundManager.playWrong();
      setStreak(0);
      // Small penalty shake, new question
      setCurrentQuestion(generateQuestion());
    }
  };

  const handleFinish = (winRacer: Racer) => {
    setWinner(winRacer);
    setPhase('FINISHED');
    if (!winRacer.isBot) {
      soundManager.playFanfare();
      onFinish(playerScore + 50); // Winner bonus
    } else {
      soundManager.playWrong();
      onFinish(playerScore);
    }
  };

  // Config View
  if (phase === 'CONFIG') {
    return (
      <div className="space-y-5 max-w-md mx-auto py-2">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
            Race Track Arithmetic
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-white">Math Dash</h2>
          <p className="text-xs text-slate-400">
            Jawab soal matematika kilat untuk memacu avatarmu melesat ke garis finish melawan 3 BOT AI!
          </p>
        </div>

        <div className="space-y-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl">
          {/* Difficulty */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">Tingkat Kecepatan Lawan:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'easy' as const, label: 'Santai', desc: 'Bot Pemula' },
                { id: 'normal' as const, label: 'Seimbang', desc: 'Bot Standar' },
                { id: 'hard' as const, label: 'Kencang ⚡', desc: 'Bot Master' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setDifficulty(item.id);
                  }}
                  className={`py-3 px-2 rounded-xl text-center transition-all cursor-pointer border ${
                    difficulty === item.id
                      ? 'bg-amber-500 border-amber-300 text-slate-950 font-extrabold shadow-md scale-102'
                      : 'bg-slate-800 border-slate-750 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <span className="font-heading font-extrabold text-xs block">{item.label}</span>
                  <span className={`text-[9px] block ${difficulty === item.id ? 'text-amber-950' : 'text-slate-400'}`}>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-750 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Flag className="w-4 h-4" />
              <span>Target: 8 Soal Benar Menuju Garis Finish</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Setiap jawaban benar mendorong avatarmu maju 1 langkah. Raih kombo beruntun untuk poin maksimal!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={startRace}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-slate-950 font-heading font-extrabold text-base tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Mulai Balapan Math Dash</span>
        </button>
      </div>
    );
  }

  // Active Race View
  if (phase === 'RACE') {
    return (
      <div className="space-y-4 max-w-md mx-auto py-1 select-none">
        {/* Race Track Header */}
        <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">Skor:</span>
            <span className="font-heading font-extrabold text-amber-400 text-sm">{playerScore}</span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 text-xs font-bold text-orange-400 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>Kombo {streak}x</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>Finish 100%</span>
          </div>
        </div>

        {/* The Visual 4-Lane Race Track */}
        <div className="bg-[#0B111E] p-3 rounded-3xl border-2 border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
          {racers.map((racer) => (
            <div key={racer.id} className="relative py-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1 px-1">
                <span className={racer.id === 'p1' ? 'text-amber-400 font-extrabold' : ''}>
                  {racer.name}
                </span>
                <span>{racer.progress}%</span>
              </div>

              {/* Lane track bar */}
              <div className="h-6 sm:h-7 bg-slate-900 rounded-xl relative border border-slate-800 overflow-hidden flex items-center">
                {/* Finish Checker Flag line */}
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-repeating-linear-gradient(45deg, #fff, #fff 4px, #000 4px, #000 8px) opacity-70 z-10" />

                {/* Racer Fill progress */}
                <div
                  className={`h-full bg-gradient-to-r ${racer.color} rounded-xl transition-all duration-300 opacity-25`}
                  style={{ width: `${racer.progress}%` }}
                />

                {/* Avatar moving */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 text-xl sm:text-2xl transition-all duration-300 drop-shadow-md z-20"
                  style={{
                    left: `calc(${Math.min(92, Math.max(2, racer.progress))}% - 14px)`,
                  }}
                >
                  {racer.avatar}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Question Box */}
        {currentQuestion && (
          <div className="space-y-3 pt-1">
            <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 text-center shadow-lg">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                PACU AVATAR DENGAN JAWABAN TEPAT!
              </span>
              <div className="font-heading font-black text-3xl sm:text-4xl text-white tracking-wider">
                {currentQuestion.text} = ?
              </div>
            </div>

            {/* 4 Fast-Action Option Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePlayerAnswer(opt)}
                  className="py-3.5 sm:py-4 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 active:scale-95 text-white font-heading font-extrabold text-2xl border border-slate-700/80 shadow-md transition-all cursor-pointer text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Finish View
  const isPlayerWinner = winner?.id === 'p1';
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center max-w-sm mx-auto">
      <div
        className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl text-4xl border ${
          isPlayerWinner
            ? 'bg-amber-500/20 border-amber-400/50 text-amber-400'
            : 'bg-rose-500/20 border-rose-400/50 text-rose-400'
        }`}
      >
        {isPlayerWinner ? '👑' : '🏁'}
      </div>

      <div>
        <h3 className="font-heading font-extrabold text-2xl text-white">
          {isPlayerWinner ? 'Kamu Juara 1! 🏆' : `${winner?.name} Memenangkan Balapan!`}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {isPlayerWinner
            ? 'Refleks hitunganmu mengalahkan seluruh bot lawan!'
            : 'Asah kecepatanmu lagi dan rebut podium utama!'}
        </p>
      </div>

      <div className="w-full bg-slate-900/90 p-4 rounded-3xl border border-slate-800 text-left space-y-2">
        <span className="text-[10px] text-slate-400 font-bold block text-center">
          HASIL POSISI BALAPAN
        </span>
        {racers
          .slice()
          .sort((a, b) => b.progress - a.progress)
          .map((r, rank) => (
            <div
              key={r.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold ${
                r.id === 'p1'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/50 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 text-center font-extrabold">{rank + 1}.</span>
                <span>{r.avatar}</span>
                <span>{r.name}</span>
              </div>
              <span>{r.progress}%</span>
            </div>
          ))}
      </div>

      <div className="flex gap-2 w-full pt-1">
        <button
          type="button"
          onClick={startRace}
          className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Balapan Lagi</span>
        </button>
        <button
          type="button"
          onClick={() => setPhase('CONFIG')}
          className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-heading font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Pilih Level</span>
        </button>
      </div>
    </div>
  );
};
