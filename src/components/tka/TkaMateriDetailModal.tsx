import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { TkaMateriLesson } from './tkaMateriLessonsData';
import { soundManager } from '../../lib/gameAudio';
import { FormattedMathFormula } from './MathFormulaDisplay';

interface TkaMateriDetailModalProps {
  lesson: TkaMateriLesson;
  onClose: () => void;
  onPracticeLesson?: () => void;
}

export const TkaMateriDetailModal: React.FC<TkaMateriDetailModalProps> = ({
  lesson,
  onClose,
  onPracticeLesson,
}) => {
  const [activeTab, setActiveTab] = useState<'KONSEP' | 'CONTOH' | 'RANGKUMAN'>('KONSEP');
  const [expandedExample, setExpandedExample] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`ixh_lesson_done_${lesson.id}`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const handleMarkComplete = () => {
    soundManager.playCorrect();
    const next = !isCompleted;
    setIsCompleted(next);
    try {
      localStorage.setItem(`ixh_lesson_done_${lesson.id}`, String(next));
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#E7EBF5] rounded-3xl border border-white/90 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto"
      >
        {/* Header with Royal Gradient & Subject Accent */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1C5FE0] to-[#1644A6] text-white flex items-start justify-between gap-3 relative shrink-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-white font-heading font-extrabold text-[11px] tracking-wide uppercase">
                {lesson.chapterNumber}
              </span>
              <span className="text-xs text-blue-200 font-medium truncate">
                Materi TKA SMP
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-black tracking-tight text-white line-clamp-2">
              {lesson.chapterTitle}
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center text-sm cursor-pointer transition-colors shrink-0"
            title="Tutup"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 bg-[#E7EBF5] border-b border-gray-200/80 flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('KONSEP');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'KONSEP'
                ? 'bg-[#1C5FE0] text-white shadow-xs'
                : 'bg-white/70 text-[#5C6F84] hover:bg-white'
            }`}
          >
            Inti Konsep
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('CONTOH');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'CONTOH'
                ? 'bg-[#1C5FE0] text-white shadow-xs'
                : 'bg-white/70 text-[#5C6F84] hover:bg-white'
            }`}
          >
            Contoh &amp; The King
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('RANGKUMAN');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer ${
              activeTab === 'RANGKUMAN'
                ? 'bg-[#1C5FE0] text-white shadow-xs'
                : 'bg-white/70 text-[#5C6F84] hover:bg-white'
            }`}
          >
            Rangkuman
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-sm text-[#1F3A5F]">
          {/* TAB 1: KONSEP */}
          {activeTab === 'KONSEP' && (
            <div className="space-y-4">
              {/* Overview Callout */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-1">
                <span className="text-[11px] font-heading font-extrabold uppercase text-[#1C5FE0] tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Pengantar Bab
                </span>
                <div className="text-xs sm:text-sm text-[#2A4365] leading-relaxed">
                  <FormattedMathFormula text={lesson.overview} />
                </div>
              </div>

              {/* Key Points */}
              <div className="space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Poin Kunci &amp; Rumus Dasar
                </h3>

                {lesson.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#1C5FE0]/15 text-[#1C5FE0] flex items-center justify-center text-xs font-heading font-black shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                        {point.title}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-[#5C6F84] leading-relaxed pl-8">
                      {point.description}
                    </p>

                    {point.formulaOrConcept && (
                      <div className="ml-8 mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 font-mono text-xs text-[#1F3A5F] whitespace-pre-line leading-relaxed">
                        <FormattedMathFormula text={point.formulaOrConcept} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CONTOH SOAL & THE KING */}
          {activeTab === 'CONTOH' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Bedah Contoh Soal TKA
                </h3>
                <span className="text-xs text-gray-500">
                  {lesson.exampleProblems.length} Contoh Soal
                </span>
              </div>

              {lesson.exampleProblems.map((prob, idx) => {
                const isExp = expandedExample === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-gray-200/80 overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setExpandedExample(isExp ? -1 : idx)}
                      className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-heading font-black text-[#1C5FE0] uppercase tracking-wider">
                          Contoh #{idx + 1}
                        </span>
                        <div className="text-xs sm:text-sm font-semibold text-[#1F3A5F] leading-snug">
                          <FormattedMathFormula text={prob.question} />
                        </div>
                      </div>
                      <div className="shrink-0 text-gray-400 mt-1">
                        {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExp && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3 bg-[#F8FAFC]">
                        {/* Step by step */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-[#1F3A5F] block">
                            Penyelesaian Konvensional / Tahapan:
                          </span>
                          <div className="space-y-1.5 pl-1">
                            {prob.stepByStep.map((step, sIdx) => (
                              <div key={sIdx} className="text-xs text-gray-700 leading-relaxed">
                                <FormattedMathFormula text={step} />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* The King Formula Callout */}
                        {prob.theKingTip && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-950 space-y-1">
                            <span className="text-[11px] font-heading font-extrabold uppercase text-amber-800 tracking-wide flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              Trik Cepat (The King)
                            </span>
                            <div className="text-xs font-medium leading-relaxed">
                              <FormattedMathFormula text={prob.theKingTip} />
                            </div>
                          </div>
                        )}

                        {/* Answer pill */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          <span className="text-xs font-bold text-gray-500 shrink-0">Jawaban Akhir:</span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-heading font-bold text-xs inline-block">
                            <FormattedMathFormula text={prob.answer} />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: RANGKUMAN & EVALUASI */}
          {activeTab === 'RANGKUMAN' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2">
                <span className="text-xs font-heading font-extrabold uppercase text-[#1C5FE0] tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#1C5FE0]" />
                  Kesimpulan &amp; Catatan Penting
                </span>
                <div className="text-xs sm:text-sm text-[#2A4365] leading-relaxed">
                  <FormattedMathFormula text={lesson.summary} />
                </div>
              </div>

              {/* Action checklist for student */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-emerald-900">
                    Status Pemahaman Materi
                  </h4>
                  <p className="text-xs text-emerald-700">
                    {isCompleted
                      ? 'Kamu telah menandai materi ini sebagai "Selesai Dipelajari"!'
                      : 'Tandai materi ini setelah membaca dan memahaminya.'}
                  </p>
                </div>

                <button
                  onClick={handleMarkComplete}
                  className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100/50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Selesai' : 'Tandai Selesai'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white/80 border-t border-gray-200/80 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-heading font-bold text-xs sm:text-sm cursor-pointer transition-colors"
          >
            Tutup
          </button>

          {onPracticeLesson && (
            <button
              onClick={() => {
                soundManager.playClick();
                onPracticeLesson();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#1C5FE0] hover:bg-[#1A54C7] text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <span>Uji Pemahaman di Latihan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
