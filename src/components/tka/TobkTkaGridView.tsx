import React, { useState } from 'react';
import {
  ChevronLeft,
  Radical,
  BookOpen,
  Atom,
  MessageSquare,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';
import { TkaSubject, TkaQuestion, TryOutPackage, TryOutHistoryRecord } from './tkaTypes';
import { TKA_CHAPTERS } from './tkaChaptersData';
import { getQuestionsForPracticePackage } from './tkaQuestionSelector';
import { soundManager } from '../../lib/gameAudio';

interface TobkTkaGridViewProps {
  onBack?: () => void;
  onSelectPracticePackage: (subject: TkaSubject, packageIndex: number, chapterId?: string) => void;
  onStartSimulasiTobk?: (pkg: TryOutPackage) => void;
  history: TryOutHistoryRecord[];
  allQuestions: TkaQuestion[];
}

export const TobkTkaGridView: React.FC<TobkTkaGridViewProps> = ({
  onBack,
  onSelectPracticePackage,
  history,
  allQuestions,
}) => {
  const [selectedSubtest, setSelectedSubtest] = useState<TkaSubject>('MATEMATIKA');

  const subtests: {
    id: TkaSubject;
    label: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
    activeBorder: string;
  }[] = [
    {
      id: 'MATEMATIKA',
      label: 'MTK',
      icon: Radical,
      accentColor: 'text-[#B45309]',
      activeBorder: 'border-[#1C5FE0] ring-2 ring-[#1C5FE0]/25 text-[#1C5FE0]',
    },
    {
      id: 'B_INDO',
      label: 'BINDO',
      icon: BookOpen,
      accentColor: 'text-[#BE123C]',
      activeBorder: 'border-[#E11D48] ring-2 ring-[#E11D48]/25 text-[#E11D48]',
    },
    {
      id: 'IPA',
      label: 'IPA',
      icon: Atom,
      accentColor: 'text-[#0F766E]',
      activeBorder: 'border-[#0D9488] ring-2 ring-[#0D9488]/25 text-[#0D9488]',
    },
    {
      id: 'B_INGGRIS',
      label: 'BING',
      icon: MessageSquare,
      accentColor: 'text-[#6D28D9]',
      activeBorder: 'border-[#7C3AED] ring-2 ring-[#7C3AED]/25 text-[#7C3AED]',
    },
  ];

  // Look up highest score for a package in this subtest
  const getPackageScore = (pkgIndex: number): number => {
    try {
      const storageKey = `ixh_tka_pkg_score_${selectedSubtest}_${pkgIndex}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return Number(saved);

      // Or inspect history
      const foundInHistory = history.find((h) => {
        const matchingSession = h.sessionResults.find(
          (s) => s.subject === selectedSubtest
        );
        return matchingSession !== undefined;
      });
      if (foundInHistory && pkgIndex === 1) {
        const sess = foundInHistory.sessionResults.find((s) => s.subject === selectedSubtest);
        if (sess) return Math.round(sess.percentage);
      }
    } catch {}
    return 0;
  };

  // Get matching chapters for this subtest (to label packages intuitively)
  const matchingChapters = TKA_CHAPTERS.filter((ch) => ch.subject === selectedSubtest);

  // 12 Packages Grid (like Gambar 2: 1 to 9, up to 12)
  const packageCards = Array.from({ length: 12 }, (_, i) => {
    const pkgNumber = i + 1;
    const score = getPackageScore(pkgNumber);
    const chapter = matchingChapters[i % matchingChapters.length];

    // Filter soal yang cocok untuk bab dan mapel ini
    const matchingQuestions = allQuestions.filter((q) => {
      if (q.subject !== selectedSubtest) return false;
      if (chapter?.id && q.chapterId !== chapter.id) return false;
      return true;
    });

    const practiceQuestions = getQuestionsForPracticePackage(matchingQuestions, pkgNumber, 30);
    const availableCount = practiceQuestions.length;

    return {
      number: pkgNumber,
      score,
      chapterName: chapter?.title || `Latihan Soal Paket ${pkgNumber}`,
      chapterId: chapter?.id,
      hasAttempted: score > 0,
      availableCount,
      targetCount: 30,
    };
  });

  return (
    <div className="w-full space-y-4 pb-12">
      {/* Blue Hero Header - Exact Match to Gambar 2 with IX-H Palette */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-[#1C5FE0] text-white shadow-md border border-blue-400/30">
        {/* Chevron Back Button */}
        {onBack && (
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer mb-3 active:scale-95 shadow-xs"
            title="Kembali"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        <div className="space-y-0.5">
          <span className="text-[11px] font-heading font-extrabold tracking-wider uppercase text-blue-200">
            LATIHAN SOAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white">
            TKA SMP
          </h1>
        </div>

        {/* Decorative Arrows from Gambar 2 */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 flex flex-col gap-2">
          <div className="w-24 h-6 bg-white transform skew-x-[35deg] rounded-sm" />
          <div className="w-28 h-6 bg-white transform skew-x-[35deg] rounded-sm" />
        </div>
      </div>

      {/* Subtest Switcher Header - Api streak icon removed per user request */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <h2 className="text-sm sm:text-base font-heading font-bold text-[#1F3A5F]">
            Pilih Subtes
          </h2>
          <p className="text-xs text-[#5C6F84]">
            Pilih mata pelajaran untuk melihat paket latihan soal
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C5FE0]/10 border border-[#1C5FE0]/20 text-[#1C5FE0] text-xs font-heading font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>12 Paket per Mapel</span>
        </div>
      </div>

      {/* Subtest Buttons: MTK, BINDO, IPA, BING */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {subtests.map((st) => {
          const Icon = st.icon;
          const isSelected = selectedSubtest === st.id;
          return (
            <button
              key={st.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedSubtest(st.id);
              }}
              className={`neu-flat py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-2 shadow-md ' + st.activeBorder
                  : 'bg-[#E7EBF5] border border-white/80 hover:bg-white/60 text-[#5C6F84]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-blue-50' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${st.accentColor}`} />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-heading font-extrabold tracking-wider ${
                  isSelected ? 'text-[#1F3A5F]' : 'text-[#5C6F84]'
                }`}
              >
                {st.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3-Column (or 4-column on larger screens) Grid of Numbered Package Cards (Gambar 2 Layout) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 pt-1">
        {packageCards.map((card) => {
          const isHighlighted = card.hasAttempted && card.score > 0;
          return (
            <motion.div
              key={card.number}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundManager.playClick();
                onSelectPracticePackage(selectedSubtest, card.number, card.chapterId);
              }}
              className={`relative overflow-hidden rounded-2xl p-2.5 sm:p-3.5 flex flex-col justify-between h-28 sm:h-32 cursor-pointer transition-all ${
                isHighlighted
                  ? 'bg-gradient-to-br from-[#E11D48]/85 to-[#BE123C] text-white shadow-md border border-rose-300'
                  : 'neu-flat bg-[#E7EBF5] border border-white/85 hover:border-blue-300 text-[#1F3A5F]'
              }`}
            >
              {/* Giant Translucent Watermark Number in Top Right Corner */}
              <div
                className={`absolute right-1 -top-1 font-heading font-black text-4xl sm:text-5xl select-none pointer-events-none ${
                  isHighlighted ? 'text-white/20' : 'text-[#5C6F84]/15'
                }`}
              >
                {card.number}
              </div>

              {/* Top Subtitle / Chapter Preview & Question Count Badge */}
              <div className="relative z-10 flex items-center justify-between gap-1">
                <span
                  className={`text-[9px] font-heading font-extrabold uppercase tracking-wider block truncate ${
                    isHighlighted ? 'text-rose-100' : 'text-[#5C6F84]'
                  }`}
                  title={card.chapterName}
                >
                  Paket {card.number}
                </span>

                <span
                  className={`text-[8px] font-heading font-black px-1.5 py-0.5 rounded-md leading-none shrink-0 ${
                    isHighlighted
                      ? 'bg-black/25 text-rose-100'
                      : card.availableCount >= card.targetCount
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                      : 'bg-[#1C5FE0]/10 text-[#1C5FE0] border border-[#1C5FE0]/20'
                  }`}
                  title={`${card.availableCount} dari ${card.targetCount} butir soal tersedia untuk paket ini`}
                >
                  {card.availableCount}/{card.targetCount}
                </span>
              </div>

              {/* Bottom: Score and Retake / Repeat Icon */}
              <div className="relative z-10 pt-1">
                <div
                  className={`text-xl sm:text-2xl font-heading font-black leading-none ${
                    isHighlighted ? 'text-white' : 'text-[#1F3A5F]'
                  }`}
                >
                  {card.score}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className={`text-[8px] sm:text-[9px] font-heading font-extrabold uppercase tracking-wider ${
                      isHighlighted ? 'text-rose-100' : 'text-[#5C6F84]'
                    }`}
                  >
                    SKOR
                  </span>
                  <div
                    className={`p-0.5 rounded-md ${
                      isHighlighted ? 'bg-white/20 text-white' : 'text-[#5C6F84]'
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Helpful Info Footer */}
      <div className="neu-flat rounded-2xl p-3.5 bg-[#E7EBF5] border border-white/80 flex items-center justify-between text-xs text-[#5C6F84]">
        <span>
          💡 Klik nomor paket untuk mulai mengerjakan 10–15 butir soal dengan trik The King.
        </span>
      </div>
    </div>
  );
};
