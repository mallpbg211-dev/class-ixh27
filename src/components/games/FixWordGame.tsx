import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Search,
  Clock,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../../lib/gameAudio';

interface FixWordGameProps {
  onFinish: (score: number) => void;
}

interface StoryWord {
  id: number;
  word: string;
  isError: boolean;
  correction?: string;
  found?: boolean;
  wrongClick?: boolean;
}

interface StoryItem {
  title: string;
  text: string;
  errors: { wrong: string; right: string }[];
}

const STORIES: StoryItem[] = [
  {
    title: 'Misi Eksperimen Laboratorium IPA IX-H',
    text: 'Pagi ini di ruang laboratorium sekolah, siswa kelas sembilan H sedang antri untuk mengambil tabung reaksi kimia. Mereka sangat antusias melakukan analisa terhadap cairan berwarna ungu. Namun, ada siswa yang tidak memakai sarung tangan padahal itu resiko besar saat memegang cairan reaktif. Guru pembimbing segera menasehati agar selalu taat pada jadual dan prosedur keselamatan kerja.',
    errors: [
      { wrong: 'antri', right: 'antre' },
      { wrong: 'analisa', right: 'analisis' },
      { wrong: 'resiko', right: 'risiko' },
      { wrong: 'menasehati', right: 'menasihati' },
      { wrong: 'jadual', right: 'jadwal' },
    ],
  },
  {
    title: 'Festival Kreativitas dan Budaya Siswa',
    text: 'Saat perayaan pekan seni di aula, panitia menyusun stand pameran dengan penuh kreatifitas tinggi. Banyak karya inovatif dipajang seperti robot mini dan lukisan siluet. Beberapa anggota OSIS tampak mondar-mandir mengecek sistim tata suara agar tidak berdengung. Di sudut ruangan, aroma coklat hangat dari stan kuliner menggugah selera semua pengunjung.',
    errors: [
      { wrong: 'kreatifitas', right: 'kreativitas' },
      { wrong: 'sistim', right: 'sistem' },
      { wrong: 'coklat', right: 'cokelat' },
      { wrong: 'stand', right: 'stan' },
    ],
  },
  {
    title: 'Rapat Organisasi Kelas IX-H',
    text: 'Ketua kelas memimpin musyawarah untuk menentukan anggaran kas bulanan. Sekretaris bertugas mencatat notulen rapat dengan teliti di buku agenda. Salah satu usulan yang diajukan adalah membeli perlengkapan aputik mini untuk kotak P3K kelas. Semua siswa sepakat bahwa menjaga kesehatan bersama adalah hal yang sangat kongkrit dan penting.',
    errors: [
      { wrong: 'notulen', right: 'notula' },
      { wrong: 'aputik', right: 'apotek' },
      { wrong: 'kongkrit', right: 'konkret' },
    ],
  },
];

export const FixWordGame: React.FC<FixWordGameProps> = ({ onFinish }) => {
  // Settings & story selection
  const [selectedStoryIdx, setSelectedStoryIdx] = useState<number>(0);
  const [timeLimit, setTimeLimit] = useState<number>(40);

  // Flow: 'CONFIG' | 'PLAYING' | 'RESULT'
  const [phase, setPhase] = useState<'CONFIG' | 'PLAYING' | 'RESULT'>('CONFIG');

  const [words, setWords] = useState<StoryWord[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(40);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [foundCount, setFoundCount] = useState<number>(0);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const prepareStory = (storyIndex: number) => {
    const story = STORIES[storyIndex];
    const rawWords = story.text.split(' ');
    let errorCounter = 0;

    const parsed: StoryWord[] = rawWords.map((raw, idx) => {
      // Strip punctuation to match
      const clean = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matched = story.errors.find((e) => e.wrong.toLowerCase() === clean);

      if (matched) {
        errorCounter++;
        return {
          id: idx,
          word: raw,
          isError: true,
          correction: matched.right,
          found: false,
        };
      }

      return {
        id: idx,
        word: raw,
        isError: false,
      };
    });

    setWords(parsed);
    setTotalErrors(errorCounter);
    setFoundCount(0);
  };

  const handleStart = () => {
    soundManager.playClick();
    prepareStory(selectedStoryIdx);
    setTimeLeft(timeLimit);
    setPhase('PLAYING');

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeEnd = () => {
    soundManager.playTone(400, 'sawtooth', 0.2);
    setPhase('RESULT');
    const score = foundCount * 25;
    onFinish(score);
  };

  const handleWordClick = (item: StoryWord) => {
    if (phase !== 'PLAYING' || item.found) return;

    if (item.isError) {
      soundManager.playCorrect();
      const updated = words.map((w) =>
        w.id === item.id ? { ...w, found: true } : w
      );
      setWords(updated);
      const newFound = foundCount + 1;
      setFoundCount(newFound);

      // Check if all errors found!
      if (newFound >= totalErrors) {
        if (timerRef.current) clearInterval(timerRef.current);
        soundManager.playFanfare();
        setPhase('RESULT');
        const score = totalErrors * 25 + Math.max(10, timeLeft * 2);
        onFinish(score);
      }
    } else {
      // Wrong word clicked
      soundManager.playWrong();
      const updated = words.map((w) =>
        w.id === item.id ? { ...w, wrongClick: true } : w
      );
      setWords(updated);
      setTimeout(() => {
        setWords((prev) =>
          prev.map((w) => (w.id === item.id ? { ...w, wrongClick: false } : w))
        );
      }, 500);
    }
  };

  // Config View
  if (phase === 'CONFIG') {
    return (
      <div className="space-y-5 max-w-md mx-auto py-2">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            Detektif Ejaan & Typo Hunter
          </span>
          <h2 className="font-heading font-extrabold text-2xl text-white">FixWord</h2>
          <p className="text-xs text-slate-400">
            Temukan kata yang salah ketik (typo baku) di dalam paragraf cerita sebelum waktu habis!
          </p>
        </div>

        <div className="space-y-4 bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">Pilih Naskah Cerita:</label>
            <div className="space-y-2">
              {STORIES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedStoryIdx(idx);
                  }}
                  className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    selectedStoryIdx === idx
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-750 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <div>
                    <span className="font-heading font-extrabold text-xs block text-emerald-300">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Target: {s.errors.length} kata salah tersembunyi
                    </span>
                  </div>
                  {selectedStoryIdx === idx && (
                    <span className="text-emerald-400 text-sm font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-2">Batas Waktu Berburu:</label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setTimeLimit(sec);
                  }}
                  className={`py-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                    timeLimit === sec
                      ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md scale-102'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {sec} Detik
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-98 text-slate-950 font-heading font-extrabold text-base tracking-wide shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          <span>Mulai Berburu Typo (FixWord)</span>
        </button>
      </div>
    );
  }

  // Active Reading & Hunting View
  if (phase === 'PLAYING') {
    return (
      <div className="space-y-4 max-w-md mx-auto py-2 select-none">
        {/* HUD Bar */}
        <div className="flex items-center justify-between bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-slate-400 font-bold">Waktu:</span>
            <span className={`font-heading font-black text-sm ${timeLeft <= 5 ? 'text-rose-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Search className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-bold">Ditemukan:</span>
            <span className="font-heading font-black text-emerald-300 text-sm">
              {foundCount} / {totalErrors}
            </span>
          </div>
        </div>

        {/* Story Text Box with Interactive Words */}
        <div className="bg-[#0B111E] p-5 rounded-3xl border-2 border-slate-800 shadow-xl space-y-3">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Klik pada kata yang salah / tidak baku:</span>
          </div>

          <div className="text-slate-200 text-sm sm:text-base leading-relaxed flex flex-wrap gap-1.5 font-medium">
            {words.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleWordClick(item)}
                className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                  item.found
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                    : item.wrongClick
                    ? 'bg-rose-500 text-white animate-shake'
                    : 'hover:bg-slate-800 active:scale-95'
                }`}
              >
                {item.found && item.correction ? (
                  <span>
                    <del className="opacity-60 text-[10px] mr-1">{item.word}</del>
                    {item.correction}
                  </span>
                ) : (
                  item.word
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-400 font-medium">
          💡 Baca dengan cermat. Begitu menemukan kata typo atau salah eja, sentuh kata tersebut!
        </p>
      </div>
    );
  }

  // Result View
  const isPerfect = foundCount >= totalErrors;
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center max-w-sm mx-auto">
      <div
        className={`w-18 h-18 rounded-3xl flex items-center justify-center shadow-xl ${
          isPerfect
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
            : 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
        }`}
      >
        {isPerfect ? <CheckCircle2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
      </div>

      <div>
        <h3 className="font-heading font-extrabold text-2xl text-white">
          {isPerfect ? 'Semua Typo Terbongkar! 🔍' : 'Waktu Berburu Habis!'}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Berhasil menemukan <strong>{foundCount} dari {totalErrors}</strong> kata salah eja.
        </p>
      </div>

      {/* Corrections List */}
      <div className="w-full bg-slate-900/90 p-4 rounded-3xl border border-slate-800 text-left space-y-2">
        <span className="text-[10px] text-slate-400 font-bold block text-center">
          KATA BAKU YANG DIPERBAIKI
        </span>
        <div className="space-y-1.5">
          {STORIES[selectedStoryIdx].errors.map((err, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-750 text-xs font-bold"
            >
              <span className="text-rose-400 line-through">{err.wrong}</span>
              <span className="text-slate-400">&rarr;</span>
              <span className="text-emerald-300">{err.right} (Baku)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 w-full pt-1">
        <button
          type="button"
          onClick={handleStart}
          className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
          <span>Ganti Cerita</span>
        </button>
      </div>
    </div>
  );
};
