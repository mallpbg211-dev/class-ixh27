import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Star,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { fireConfetti } from '../utils/confettiHelper';
import { soundManager } from '../lib/gameAudio';
import { MentalCalculationGame } from './games/MentalCalculationGame';
import { ExtremeAdditionGame } from './games/ExtremeAdditionGame';
import { GridMemoryGame } from './games/GridMemoryGame';
import { MathDashGame } from './games/MathDashGame';
import { FixWordGame } from './games/FixWordGame';
import { GhostReflexGame } from './games/GhostReflexGame';
import { OracleSequenceGame } from './games/OracleSequenceGame';

const HIGHSCORE_KEY = 'ixh_game_highscores';
const XP_KEY = 'ixh_game_xp';

const DEFAULT_HIGHSCORES: Record<string, number> = {
  calc: 85,
  extreme: 120,
  grid: 70,
  dash: 95,
  word: 80,
  reflex: 185,
  oracle: 8,
};

interface GameCardMeta {
  id: string;
  name: string;
  desc: string;
  icon: string;
  accentClass: string;
  borderClass: string;
  iconBg: string;
  badgeBg: string;
  badgeText: string;
}

const IQ_GAMES: GameCardMeta[] = [
  {
    id: 'calc',
    name: 'Mental Calculation',
    desc: 'Uji akurasi & kecepatan berhitung. Hitung angka yang muncul bergantian di layar (Flash Anzan)!',
    icon: '🔢',
    accentClass: 'text-sky-400',
    borderClass: 'border-l-sky-500 hover:border-sky-400',
    iconBg: 'bg-sky-500/15 text-sky-400',
    badgeBg: 'bg-sky-500/15 text-sky-300',
    badgeText: '▶ Main',
  },
  {
    id: 'extreme',
    name: 'Extreme Addition',
    desc: 'Jumlahkan semua angka dalam tabel matriks sebelum batas waktu hitung mundur habis!',
    icon: '⚡',
    accentClass: 'text-rose-400',
    borderClass: 'border-l-rose-500 hover:border-rose-400',
    iconBg: 'bg-rose-500/15 text-rose-400',
    badgeBg: 'bg-rose-500/15 text-rose-300',
    badgeText: '▶ Main',
  },
  {
    id: 'grid',
    name: 'Grid Memory',
    desc: 'Ingat posisi kotak dalam grid dan cocokkan jawaban (Normal, Shift 1 Kotak, atau Rotasi 90°)!',
    icon: '🧠',
    accentClass: 'text-purple-400',
    borderClass: 'border-l-purple-500 hover:border-purple-400',
    iconBg: 'bg-purple-500/15 text-purple-400',
    badgeBg: 'bg-purple-500/15 text-purple-300',
    badgeText: '▶ Main',
  },
  {
    id: 'dash',
    name: 'Math Dash',
    desc: 'Jawab soal matematika kilat, pacu avatarmu ke garis finish melawan 3 BOT AI di lintasan balap!',
    icon: '🏎️',
    accentClass: 'text-amber-400',
    borderClass: 'border-l-amber-500 hover:border-amber-400',
    iconBg: 'bg-amber-500/15 text-amber-400',
    badgeBg: 'bg-amber-500/15 text-amber-300',
    badgeText: '▶ Main',
  },
  {
    id: 'word',
    name: 'FixWord (Error Hunter)',
    desc: 'Temukan kata yang salah ketik atau ejaan typo di dalam cerita sebelum waktu membaca habis!',
    icon: '🔍',
    accentClass: 'text-emerald-400',
    borderClass: 'border-l-emerald-500 hover:border-emerald-400',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    badgeBg: 'bg-emerald-500/15 text-emerald-300',
    badgeText: '▶ Main',
  },
  {
    id: 'reflex',
    name: 'Ghost Reflex',
    desc: 'Tunggu sinyal berubah hijau, lalu sentuh layar secepat kilat untuk uji kecepatan reaksi milidetik (ms)!',
    icon: '⏱️',
    accentClass: 'text-indigo-400',
    borderClass: 'border-l-indigo-500 hover:border-indigo-400',
    iconBg: 'bg-indigo-500/15 text-indigo-400',
    badgeBg: 'bg-indigo-500/15 text-indigo-300',
    badgeText: '▶ Main',
  },
  {
    id: 'oracle',
    name: 'Oracle Sequence',
    desc: 'Hafal dan ulangi urutan rune cahaya mistis yang kian bertambah panjang setiap babak!',
    icon: '✨',
    accentClass: 'text-blue-400',
    borderClass: 'border-l-blue-500 hover:border-blue-400',
    iconBg: 'bg-blue-500/15 text-blue-400',
    badgeBg: 'bg-blue-500/15 text-blue-300',
    badgeText: '▶ Main',
  },
];

export const GameHubView: React.FC = () => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(HIGHSCORE_KEY);
      if (saved) return { ...DEFAULT_HIGHSCORES, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_HIGHSCORES;
  });

  const [totalXp, setTotalXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(XP_KEY);
      if (saved) return parseInt(saved, 10) || 450;
    } catch {}
    return 450;
  });

  const [isMuted, setIsMuted] = useState(() => soundManager.getIsMuted());

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleFinishGame = (gameId: string, score: number) => {
    soundManager.playFanfare();
    fireConfetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });

    setHighScores((prev) => {
      const current = prev[gameId] || 0;
      const isBetter = gameId === 'reflex' ? (current === 0 || score < current) : score > current;
      const updated = isBetter ? { ...prev, [gameId]: score } : prev;
      try {
        localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const gainedXp = Math.max(15, Math.floor(score / 4));
    setTotalXp((prev) => {
      const next = prev + gainedXp;
      try {
        localStorage.setItem(XP_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const getRankInfo = (xp: number) => {
    if (xp < 300) return { title: 'Siswa Pemula IX-H', badge: 'Tier 1', nextThreshold: 300, progress: (xp / 300) * 100 };
    if (xp < 600) return { title: 'Detektif Madya IX-H', badge: 'Tier 2', nextThreshold: 600, progress: ((xp - 300) / 300) * 100 };
    if (xp < 1000) return { title: 'Ahli Logika IX-H', badge: 'Tier 3', nextThreshold: 1000, progress: ((xp - 600) / 400) * 100 };
    return { title: 'Grandmaster IX-H', badge: 'Tier Max', nextThreshold: 1000, progress: 100 };
  };

  const rank = getRankInfo(totalXp);
  const activeGame = IQ_GAMES.find((g) => g.id === activeGameId);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-1 space-y-5">
      {activeGameId ? (
        /* ================= ACTIVE GAMEPLAY SCREEN ================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveGameId(null);
              }}
              className="neu-btn px-4 py-2.5 rounded-2xl text-xs font-heading font-extrabold text-[#1F3A5F] flex items-center gap-2 active:scale-95 transition-all cursor-pointer bg-white/80 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Menu Game Hub</span>
            </button>

            <button
              onClick={handleToggleMute}
              className="neu-btn px-3 py-2 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-1.5 cursor-pointer bg-white/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
              <span className="hidden sm:inline">{isMuted ? 'Mute' : 'Audio On'}</span>
            </button>
          </div>

          <div className="neu-flat-lg rounded-3xl p-4 sm:p-6 bg-[#0B0F19] text-white border border-slate-800 shadow-2xl relative overflow-hidden min-h-[440px]">
            {activeGame && (
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{activeGame.icon}</span>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm sm:text-base text-white">
                      {activeGame.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Permainan Asah Otak &amp; Penambah IQ
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9.5px] text-slate-400 block font-semibold">REKOR PRIBADI</span>
                  <span className="font-heading font-black text-xs sm:text-sm text-amber-300">
                    {activeGame.id === 'reflex'
                      ? `${highScores[activeGame.id] || 0} ms`
                      : `${highScores[activeGame.id] || 0} pts`}
                  </span>
                </div>
              </div>
            )}

            {/* Render Game by ID */}
            {activeGameId === 'calc' && (
              <MentalCalculationGame onFinish={(s) => handleFinishGame('calc', s)} />
            )}
            {activeGameId === 'extreme' && (
              <ExtremeAdditionGame onFinish={(s) => handleFinishGame('extreme', s)} />
            )}
            {activeGameId === 'grid' && (
              <GridMemoryGame onFinish={(s) => handleFinishGame('grid', s)} />
            )}
            {activeGameId === 'dash' && (
              <MathDashGame onFinish={(s) => handleFinishGame('dash', s)} />
            )}
            {activeGameId === 'word' && (
              <FixWordGame onFinish={(s) => handleFinishGame('word', s)} />
            )}
            {activeGameId === 'reflex' && (
              <GhostReflexGame onFinish={(s) => handleFinishGame('reflex', s)} />
            )}
            {activeGameId === 'oracle' && (
              <OracleSequenceGame onFinish={(s) => handleFinishGame('oracle', s)} />
            )}
          </div>
        </div>
      ) : (
        /* ================= MAIN HUB MENU (Inspired by game-penambah-iq.vercel.app) ================= */
        <div className="space-y-5">
          {/* Top Rank & XP Pill */}
          <div className="neu-flat rounded-2xl p-3.5 bg-gradient-to-r from-slate-900 via-[#0E1726] to-slate-900 border border-slate-800 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm border border-purple-500/30">
                🏆
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {rank.badge}
                  </span>
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300" />
                    {totalXp} XP
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-xs sm:text-sm text-white mt-0.5">
                  {rank.title}
                </h4>
              </div>
            </div>

            <button
              onClick={handleToggleMute}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] font-bold text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isMuted ? 'Muted' : 'Sound'}</span>
            </button>
          </div>

          {/* HUB HEADER (Matching Christ's Game Hub structure) */}
          <div className="text-center space-y-2 py-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-rose-500/20 border border-slate-700/60 shadow-md flex items-center justify-center text-3xl mx-auto">
              🎮
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#1F3A5F] dark:text-white tracking-tight">
              IX-H <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Game Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Selamat datang di <strong>IX-H Game Hub</strong>! Kumpulan permainan yang mengasah otak, daya ingat, kalkulasi kilat, dan logika berpikir. Silakan pilih game di bawah.
            </p>
          </div>

          {/* STATS STRIP (5 Games | 1-4 Pemain | ∞ Fun) */}
          <div className="flex gap-2.5 justify-center">
            <div className="flex-1 max-w-[130px] p-2.5 rounded-2xl bg-[#E7EBF5] dark:bg-slate-900 border border-white/60 dark:border-slate-800 text-center shadow-sm">
              <div className="font-heading font-extrabold text-lg sm:text-xl text-[#1F3A5F] dark:text-white">
                {IQ_GAMES.length}
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Games
              </div>
            </div>

            <div className="flex-1 max-w-[130px] p-2.5 rounded-2xl bg-[#E7EBF5] dark:bg-slate-900 border border-white/60 dark:border-slate-800 text-center shadow-sm">
              <div className="font-heading font-extrabold text-lg sm:text-xl text-[#1F3A5F] dark:text-white">
                1–4
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pemain / Bot
              </div>
            </div>

            <div className="flex-1 max-w-[130px] p-2.5 rounded-2xl bg-[#E7EBF5] dark:bg-slate-900 border border-white/60 dark:border-slate-800 text-center shadow-sm">
              <div className="font-heading font-extrabold text-lg sm:text-xl text-sky-600 dark:text-sky-400">
                ∞
              </div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                IQ Boost
              </div>
            </div>
          </div>

          {/* DIVIDER: Pilih Game */}
          <div className="flex items-center gap-3 py-1">
            <div className="h-[1px] flex-1 bg-slate-300 dark:bg-slate-800" />
            <span className="text-[11px] font-heading font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pilih Game Penambah IQ
            </span>
            <div className="h-[1px] flex-1 bg-slate-300 dark:bg-slate-800" />
          </div>

          {/* GAME CARDS LIST (Custom styled with left accent border, soft tint badge, arrow) */}
          <div className="space-y-3">
            {IQ_GAMES.map((game) => {
              const currentHs = highScores[game.id] || 0;
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveGameId(game.id);
                  }}
                  className={`group relative flex items-center gap-3.5 p-4 rounded-2xl bg-[#E7EBF5] dark:bg-slate-900 border-l-[3.5px] ${game.borderClass} border-t border-r border-b border-white/70 dark:border-slate-800/80 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer`}
                >
                  {/* Icon wrap */}
                  <div
                    className={`w-13 h-13 rounded-2xl ${game.iconBg} flex items-center justify-center text-2xl flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform`}
                  >
                    {game.icon}
                  </div>

                  {/* Body text */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-heading font-extrabold text-sm sm:text-base ${game.accentClass} group-hover:underline`}>
                        {game.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${game.badgeBg}`}>
                        {game.badgeText}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-1 line-clamp-2">
                      {game.desc}
                    </p>

                    <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                      <span>Rekor Terbaik:</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {game.id === 'reflex' ? `${currentHs}ms` : `${currentHs} pts`}
                      </strong>
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <div className="absolute right-3.5 bottom-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 text-xl font-bold transition-all">
                    ›
                  </div>
                </div>
              );
            })}
          </div>

          {/* STICKY / SLEEK FOOTER (Inspired by game-penambah-iq.vercel.app TikTok Support strip) */}
          <div className="mt-8 pt-4 border-t border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 text-center sm:text-left">
              <span>Terinspirasi dari</span>
              <a
                href="https://game-penambah-iq.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-sky-500 hover:underline font-bold inline-flex items-center gap-0.5"
              >
                game-penambah-iq.vercel.app
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>🙏</span>
            </div>

            <a
              href="https://www.tiktok.com/@christlikephysics"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white font-heading font-bold text-[11px] shadow-sm transition-all active:scale-95 border border-slate-700"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
              </svg>
              <span>TikTok @christlikephysics</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
