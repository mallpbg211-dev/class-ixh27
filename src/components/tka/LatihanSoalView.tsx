import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Crown,
  CheckCircle2,
  CheckSquare,
  XCircle,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { TkaQuestion, TkaSubject } from './tkaTypes';
import { TKA_CHAPTERS } from './tkaChaptersData';
import { getQuestionsForPracticePackage } from './tkaQuestionSelector';
import { soundManager } from '../../lib/gameAudio';
import { ttsHelper } from './ttsHelper';
import { MathRenderer } from './MathFormulaDisplay';

interface LatihanSoalViewProps {
  allQuestions: TkaQuestion[];
  onOpenBankAdmin?: () => void;
  initialSubject?: TkaSubject;
  initialChapterId?: string;
  packageIndex?: number;
  onBack?: () => void;
}

export const LatihanSoalView: React.FC<LatihanSoalViewProps> = ({
  allQuestions,
  initialSubject = 'MATEMATIKA',
  initialChapterId = 'ALL',
  packageIndex,
  onBack,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<TkaSubject>(initialSubject);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(initialChapterId);

  // Sync when initialSubject changes
  useEffect(() => {
    if (initialSubject) setSelectedSubject(initialSubject);
  }, [initialSubject]);

  useEffect(() => {
    if (initialChapterId) setSelectedChapterId(initialChapterId);
  }, [initialChapterId]);

  // Filter chapters matching subject
  const availableChapters = TKA_CHAPTERS.filter((ch) => ch.subject === selectedSubject);

  // Filter questions matching selected subject & chapter
  const filteredQuestions = useMemo(() => {
    const matched = allQuestions.filter((q) => {
      if (q.subject !== selectedSubject) return false;
      if (selectedChapterId !== 'ALL' && q.chapterId !== selectedChapterId) return false;
      return true;
    });

    // Jika masuk dari Grid 12 Paket (packageIndex terisi), gunakan algoritma seleksi deterministik
    if (packageIndex && packageIndex > 0) {
      return getQuestionsForPracticePackage(matched, packageIndex, 30);
    }

    // Jika mode Latihan Bebas tanpa nomor paket, tampilkan semua soal yang cocok
    return matched;
  }, [allQuestions, selectedSubject, selectedChapterId, packageIndex]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null);
  const [chosenMulti, setChosenMulti] = useState<number[]>([]);
  const [isMultiSubmitted, setIsMultiSubmitted] = useState(false);
  const [activeSolutionTab, setActiveSolutionTab] = useState<'THE_KING' | 'CONVENTIONAL'>('THE_KING');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Reset when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setChosenAnswer(null);
    setChosenMulti([]);
    setIsMultiSubmitted(false);
  }, [selectedSubject, selectedChapterId]);

  // Subscribe to TTS
  useEffect(() => {
    const unsub = ttsHelper.subscribeStateChange((speaking) => {
      setIsAudioPlaying(speaking);
    });
    return () => {
      ttsHelper.stop();
      unsub();
    };
  }, []);

  const currentQ = filteredQuestions[currentIndex];
  const isComplex = currentQ?.questionType === 'PGK';
  const targetKeys = (currentQ?.correctAnswers || (currentQ ? [currentQ.correctAnswer] : [])).slice().sort((a, b) => a - b);
  const hasAnswered = isComplex ? isMultiSubmitted : chosenAnswer !== null;

  const isMultiCorrect =
    isComplex &&
    isMultiSubmitted &&
    targetKeys.length === chosenMulti.length &&
    targetKeys.every((v, i) => v === chosenMulti[i]);

  const handleSelectOption = (idx: number) => {
    if (chosenAnswer !== null) return; // already answered
    setChosenAnswer(idx);
    if (currentQ && idx === currentQ.correctAnswer) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleToggleMulti = (optIdx: number) => {
    if (isMultiSubmitted) return;
    soundManager.playClick();
    if (chosenMulti.includes(optIdx)) {
      setChosenMulti(chosenMulti.filter((i) => i !== optIdx));
    } else {
      setChosenMulti([...chosenMulti, optIdx].sort((a, b) => a - b));
    }
  };

  const handleSubmitMulti = () => {
    if (chosenMulti.length === 0 || isMultiSubmitted) return;
    setIsMultiSubmitted(true);
    const isExact =
      targetKeys.length === chosenMulti.length &&
      targetKeys.every((v, i) => v === chosenMulti[i]);
    if (isExact) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handlePlayAudio = (script?: string) => {
    if (!script) return;
    if (isAudioPlaying) {
      ttsHelper.stop();
    } else {
      ttsHelper.speak(script, 'en-US', 0.9);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    ttsHelper.stop();
    setChosenAnswer(null);
    setChosenMulti([]);
    setIsMultiSubmitted(false);
    setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1));
  };

  const handlePrev = () => {
    soundManager.playClick();
    ttsHelper.stop();
    setChosenAnswer(null);
    setChosenMulti([]);
    setIsMultiSubmitted(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const subjectTabs: { id: TkaSubject; label: string }[] = [
    { id: 'IPA', label: 'IPA' },
    { id: 'B_INDO', label: 'B. Indonesia' },
    { id: 'B_INGGRIS', label: 'B. Inggris' },
    { id: 'MATEMATIKA', label: 'Matematika' },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24">
      {/* Subject & Chapter Filter Header */}
      <div className="neu-flat rounded-3xl p-5 bg-[#E7EBF5] border border-white/80 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onBack();
                }}
                className="w-9 h-9 rounded-xl neu-btn flex items-center justify-center text-[#1F3A5F] hover:text-[#1C5FE0] shrink-0"
                title="Kembali ke Grid Paket Soal"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800">
                Mode Belajar Santai {packageIndex ? `• Paket ${packageIndex}` : ''}
              </span>
              <h2 className="text-lg font-heading font-bold text-gray-900 mt-0.5">
                Latihan Soal &amp; Feedback Instan
              </h2>
              <p className="text-xs text-gray-500">
                Pilih mata pelajaran dan bab untuk memperkuat konsep dengan trik The King.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/90 text-[#1F3A5F] self-start sm:self-auto border border-gray-200/90 shadow-2xs font-heading">
            {packageIndex
              ? `${filteredQuestions.length} dari 30 soal tersedia untuk paket ini`
              : `${filteredQuestions.length} Soal Tersedia`}
          </span>
        </div>

        {/* 4 Subject Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {subjectTabs.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedSubject(st.id);
                setSelectedChapterId('ALL');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all shrink-0 cursor-pointer ${
                selectedSubject === st.id
                  ? 'bg-[#1C5FE0] text-white shadow-sm'
                  : 'bg-white/70 text-gray-700 hover:bg-white border border-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Chapter Dropdown / Picker */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-200/80">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <label className="text-xs font-semibold text-gray-600 shrink-0">Pilih Bab:</label>
          <select
            value={selectedChapterId}
            onChange={(e) => {
              soundManager.playClick();
              setSelectedChapterId(e.target.value);
            }}
            className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-[#1C5FE0] focus:outline-hidden"
          >
            <option value="ALL">Semua Bab di {selectedSubject}</option>
            {availableChapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.number}: {ch.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQ ? (
        <div className="neu-flat rounded-3xl p-5 sm:p-7 bg-[#E7EBF5] border border-white/80 space-y-4">
          {/* Question Header */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-[#1C5FE0] text-white font-bold text-xs flex items-center justify-center">
                {currentIndex + 1}
              </span>
              <span className="text-xs font-semibold text-gray-700">
                {currentQ.chapterName}
              </span>
            </div>

            <span className="text-xs text-gray-500 font-medium">
              Soal {currentIndex + 1} dari {filteredQuestions.length}
            </span>
          </div>

          {/* Listening Audio Player (if English Listening) */}
          {currentQ.listeningScript && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-blue-900 text-xs sm:text-sm font-semibold">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Audio Listening Soal</span>
              </div>
              <button
                onClick={() => handlePlayAudio(currentQ.listeningScript)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  isAudioPlaying ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isAudioPlaying ? 'Hentikan' : 'Putar Audio'}</span>
              </button>
            </div>
          )}

          {/* Reading passage */}
          {currentQ.passage && (
            <div className="p-3.5 rounded-2xl bg-white/70 border border-blue-100 text-xs sm:text-sm text-gray-800 leading-relaxed max-h-40 overflow-y-auto italic">
              <p className="font-semibold not-italic text-[11px] text-blue-700 uppercase tracking-wide mb-1">
                Wacana Bacaan:
              </p>
              {currentQ.passage}
            </div>
          )}

          {/* PGK Notice */}
          {isComplex && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs">
              <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                <strong>Pilihan Ganda Kompleks:</strong> Pilihan jawaban benar lebih dari satu. Centang jawaban yang tepat lalu tekan tombol Periksa Jawaban.
              </span>
            </div>
          )}

          {/* Question Text */}
          <div className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed whitespace-pre-line">
            <MathRenderer text={currentQ.question} />
          </div>

          {/* Options */}
          <div className="space-y-2 pt-1">
            {currentQ.options.map((opt, optIdx) => {
              const isChosen = isComplex ? chosenMulti.includes(optIdx) : chosenAnswer === optIdx;
              const isKey = targetKeys.includes(optIdx);

              let style = 'bg-white/70 hover:bg-white text-gray-800 border-gray-200';
              if (hasAnswered) {
                if (isKey) {
                  style = 'bg-emerald-500/15 border-emerald-500 text-emerald-950 font-semibold';
                } else if (isChosen && !isKey) {
                  style = 'bg-rose-500/15 border-rose-400 text-rose-950 font-semibold';
                } else {
                  style = 'opacity-60 bg-white/40 border-gray-200';
                }
              } else if (isComplex && isChosen) {
                style = 'bg-purple-100 border-purple-400 text-purple-950 font-semibold';
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnswered}
                  onClick={() => (isComplex ? handleToggleMulti(optIdx) : handleSelectOption(optIdx))}
                  className={`w-full text-left p-3 rounded-2xl text-xs sm:text-sm border transition-all flex items-start gap-3 cursor-pointer ${style}`}
                >
                  <span
                    className={`w-6 h-6 text-xs font-bold flex items-center justify-center shrink-0 transition-all ${
                      isComplex ? 'rounded-lg' : 'rounded-full'
                    } ${
                      hasAnswered && isKey
                        ? 'bg-emerald-600 text-white'
                        : hasAnswered && isChosen && !isKey
                        ? 'bg-rose-600 text-white'
                        : isComplex && isChosen
                        ? 'bg-purple-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isComplex && isChosen && !hasAnswered ? '✓' : String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="flex-1 pt-0.5">
                    <MathRenderer text={opt} inline={true} />
                    {hasAnswered && isKey && (
                      <span className="ml-2 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Jawaban Benar
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit button for PGK if not answered yet */}
          {isComplex && !hasAnswered && (
            <div className="pt-2">
              <button
                disabled={chosenMulti.length === 0}
                onClick={handleSubmitMulti}
                className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-heading font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  chosenMulti.length > 0
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Periksa Jawaban ({chosenMulti.length} Pilihan Tercentang)</span>
              </button>
            </div>
          )}

          {/* INSTANT FEEDBACK & DUAL SOLUTION (Shown right after answering) */}
          {hasAnswered && (
            <div className="pt-4 border-t border-gray-200 space-y-3 animate-fade-in">
              {/* Feedback badge */}
              <div
                className={`p-3 rounded-2xl text-xs font-heading font-bold flex items-center gap-2 ${
                  (isComplex ? isMultiCorrect : chosenAnswer === currentQ.correctAnswer)
                    ? 'bg-emerald-500/15 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-500/15 text-rose-900 border border-rose-300'
                }`}
              >
                {(isComplex ? isMultiCorrect : chosenAnswer === currentQ.correctAnswer) ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Luar Biasa! Jawaban Anda Benar.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Jawaban Kurang Tepat. Pelajari trik solusinya di bawah!</span>
                  </>
                )}
              </div>

              {/* Solution Tab Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSolutionTab('THE_KING')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    activeSolutionTab === 'THE_KING'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                      : 'bg-white/70 text-gray-700 border border-gray-200 hover:bg-white'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>Metode The King (15 Detik)</span>
                </button>

                <button
                  onClick={() => setActiveSolutionTab('CONVENTIONAL')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    activeSolutionTab === 'CONVENTIONAL'
                      ? 'bg-[#1C5FE0] text-white shadow-sm'
                      : 'bg-white/70 text-gray-700 border border-gray-200 hover:bg-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Cara Konvensional</span>
                </button>
              </div>

              {/* Solution Box Content */}
              {activeSolutionTab === 'THE_KING' ? (
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-300 text-gray-900 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                      <Crown className="w-4 h-4 text-amber-600" />
                      <span>Solusi Kilat The King:</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md font-semibold">
                      Formula Sakti
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-900 leading-relaxed font-mono whitespace-pre-line bg-white/70 p-3 rounded-xl border border-amber-200/80">
                    <MathRenderer text={currentQ.theKingFormula} />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-200 text-gray-900 space-y-2">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wide">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Penjabaran Langkah Konvensional:</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line bg-white/70 p-3 rounded-xl border border-blue-100 font-sans">
                    <MathRenderer text={currentQ.conventionalSolution} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Prev / Next */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl text-xs font-heading font-semibold neu-button flex items-center gap-1.5 disabled:opacity-40 text-gray-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {chosenAnswer !== null && currentIndex < filteredQuestions.length - 1 && (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl text-xs font-heading font-bold neu-button-primary bg-[#1C5FE0] hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Lanjut Soal Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {chosenAnswer === null && currentIndex < filteredQuestions.length - 1 && (
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl text-xs font-heading font-semibold neu-button flex items-center gap-1.5 text-gray-700 cursor-pointer"
              >
                <span>Lewati</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="neu-flat rounded-2xl p-8 text-center text-gray-500 text-xs bg-[#E7EBF5]">
          Belum ada soal untuk kategori ini. Silakan pilih bab lain atau tambah soal lewat Admin Panel.
        </div>
      )}
    </div>
  );
};
