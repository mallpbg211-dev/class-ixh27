import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  Clock,
  CheckCircle2,
  CheckSquare,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  TkaQuestion,
  TryOutPackage,
  TryOutHistoryRecord,
  SessionResult,
  TkaSubject,
} from './tkaTypes';
import {
  saveActiveTryOutSession,
  clearActiveTryOutSession,
  saveTryOutResult,
  calculateChapterBreakdown,
  ActiveTryOutSessionData,
} from './tkaStorage';
import { getQuestionsForSubject } from './tkaChaptersData';
import { soundManager } from '../../lib/gameAudio';
import { ttsHelper } from './ttsHelper';
import { MathRenderer } from './MathFormulaDisplay';

// ISOLATED TIMER COMPONENT to prevent re-rendering entire question tree every second
// Crucial for smooth performance on entry-level Android devices (Redmi 9A, etc.)
interface IsolatedTimerProps {
  initialSecondsRemaining: number;
  onTimeExpired: () => void;
}

const IsolatedTimer = memo(({ initialSecondsRemaining, onTimeExpired }: IsolatedTimerProps) => {
  const [seconds, setSeconds] = useState(initialSecondsRemaining);
  const onExpiredRef = useRef(onTimeExpired);
  onExpiredRef.current = onTimeExpired;

  useEffect(() => {
    setSeconds(initialSecondsRemaining);
  }, [initialSecondsRemaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpiredRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const isUrgent = seconds < 180; // less than 3 minutes

  return (
    <div
      className={`px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
        isUrgent
          ? 'bg-rose-500 text-white animate-pulse'
          : 'bg-[#1C5FE0]/15 text-[#1C5FE0] border border-[#1C5FE0]/30'
      }`}
    >
      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(remainingSecs).padStart(2, '0')}
      </span>
    </div>
  );
});

IsolatedTimer.displayName = 'IsolatedTimer';

interface TryOutCbtSessionViewProps {
  pkg: TryOutPackage;
  initialSessionData?: ActiveTryOutSessionData | null;
  allBankQuestions: TkaQuestion[];
  onFinishAll: (record: TryOutHistoryRecord) => void;
  onExit: () => void;
}

export const TryOutCbtSessionView: React.FC<TryOutCbtSessionViewProps> = ({
  pkg,
  initialSessionData,
  allBankQuestions,
  onFinishAll,
  onExit,
}) => {
  // Session Index (0 = IPA, 1 = B_INDO, 2 = B_INGGRIS, 3 = MATEMATIKA)
  const [currentSessionIndex, setCurrentSessionIndex] = useState<number>(
    initialSessionData ? initialSessionData.currentSessionIndex : 0
  );

  const currentSessionConfig = pkg.sessions[currentSessionIndex];

  // Helper to load questions based on priority:
  // 1. If sessionConfig.questionIds exists and has items -> use those (perilaku lama)
  // 2. If empty -> filter bank questions where q.packageId === pkg.id && q.subject === sessionConfig.subject
  // 3. If still empty -> return [] (jangan diam-diam menampilkan soal dari paket lain)
  const resolveSessionQuestions = useCallback((
    sessionConfig: typeof pkg.sessions[0],
    bank: TkaQuestion[]
  ): TkaQuestion[] => {
    // 1. Jika sessionConfig.questionIds terisi -> pakai itu
    if (sessionConfig.questionIds && sessionConfig.questionIds.length > 0) {
      const mapped = sessionConfig.questionIds
        .map((id) => bank.find((q) => q.id === id))
        .filter(Boolean) as TkaQuestion[];
      if (mapped.length > 0) return mapped;
    }

    // 2. Jika kosong -> filter bank soal berdasarkan packageId === pkg.id DAN subject yang sesuai
    const pkgFiltered = bank.filter(
      (q) => q.packageId === pkg.id && q.subject === sessionConfig.subject
    );
    if (pkgFiltered.length > 0) {
      if (pkgFiltered.length <= sessionConfig.questionCount) {
        return pkgFiltered;
      }
      return pkgFiltered.slice(0, sessionConfig.questionCount);
    }

    // 3. Masih kosong -> kembalikan [] agar menampilkan pesan jelas ke siswa/admin
    return [];
  }, [pkg.id]);

  // Load questions for the current session
  const [sessionQuestions, setSessionQuestions] = useState<TkaQuestion[]>(() => {
    return resolveSessionQuestions(currentSessionConfig, allBankQuestions);
  });

  // Current question index in active session (0..29)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // User answers for this session
  const [answers, setAnswers] = useState<Record<string, number | number[]>>(() => {
    return initialSessionData ? initialSessionData.userAnswers : {};
  });

  // Doubtful question IDs
  const [doubtfulIds, setDoubtfulIds] = useState<string[]>(() => {
    return initialSessionData ? initialSessionData.doubtfulIds : [];
  });

  // Completed sessions list
  const [completedSessions, setCompletedSessions] = useState<ActiveTryOutSessionData['completedSessions']>(
    () => (initialSessionData ? initialSessionData.completedSessions : [])
  );

  // Time tracking using server-like epoch delta
  const [sessionStartTime, setSessionStartTime] = useState<number>(() => {
    return initialSessionData ? initialSessionData.sessionStartTime : Date.now();
  });

  // TTS audio speaking state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Show session end confirmation dialog
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Subscribe to TTS state
  useEffect(() => {
    const unsub = ttsHelper.subscribeStateChange((speaking) => {
      setIsAudioPlaying(speaking);
    });
    return () => {
      ttsHelper.stop();
      unsub();
    };
  }, []);

  // Update questions whenever session index changes
  useEffect(() => {
    const qs = resolveSessionQuestions(currentSessionConfig, allBankQuestions);
    setSessionQuestions(qs);
    setCurrentQuestionIndex(0);
    setSessionStartTime(Date.now());
  }, [currentSessionIndex, currentSessionConfig, allBankQuestions]);

  // Real-time Auto-Save to localStorage
  const triggerAutoSave = useCallback(
    (newAnswers: Record<string, number>, newDoubtful: string[]) => {
      const payload: ActiveTryOutSessionData = {
        packageId: pkg.id,
        currentSessionIndex,
        sessionStartTime,
        sessionDurationMinutes: currentSessionConfig.durationMinutes,
        userAnswers: newAnswers,
        doubtfulIds: newDoubtful,
        completedSessions,
      };
      saveActiveTryOutSession(payload);
    },
    [pkg.id, currentSessionIndex, sessionStartTime, currentSessionConfig.durationMinutes, completedSessions]
  );

  const handleSelectOption = (questionId: string, optionIndex: number, isComplex?: boolean) => {
    soundManager.playClick();
    let updatedVal: number | number[];
    if (isComplex) {
      const current = answers[questionId];
      const list: number[] = Array.isArray(current)
        ? [...current]
        : current !== undefined
        ? [current]
        : [];
      if (list.includes(optionIndex)) {
        updatedVal = list.filter((idx) => idx !== optionIndex);
      } else {
        updatedVal = [...list, optionIndex].sort((a, b) => a - b);
      }
    } else {
      updatedVal = optionIndex;
    }
    const updated = { ...answers, [questionId]: updatedVal };
    setAnswers(updated);
    triggerAutoSave(updated, doubtfulIds);
  };

  const handleToggleDoubtful = (questionId: string) => {
    soundManager.playClick();
    let updated: string[];
    if (doubtfulIds.includes(questionId)) {
      updated = doubtfulIds.filter((id) => id !== questionId);
    } else {
      updated = [...doubtfulIds, questionId];
    }
    setDoubtfulIds(updated);
    triggerAutoSave(answers, updated);
  };

  const handlePlayListeningAudio = (script?: string) => {
    if (!script) return;
    if (isAudioPlaying) {
      ttsHelper.stop();
    } else {
      ttsHelper.speak(script, 'en-US', 0.9);
    }
  };

  // BLOCKING TIME HANDLER: lock current session permanently, proceed to next or finish
  const handleLockAndProceedSession = useCallback(() => {
    ttsHelper.stop();
    soundManager.playClick();
    setShowConfirmModal(false);

    // Calculate time spent
    const spentSecs = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));

    const newCompleted = [
      ...completedSessions,
      {
        subject: currentSessionConfig.subject,
        answers: { ...answers },
        timeSpentSeconds: spentSecs,
        lockedAt: Date.now(),
      },
    ];

    setCompletedSessions(newCompleted);

    // If more sessions remain
    if (currentSessionIndex < pkg.sessions.length - 1) {
      const nextIndex = currentSessionIndex + 1;
      setCurrentSessionIndex(nextIndex);
      // Reset answers & doubtful for new session
      setAnswers({});
      setDoubtfulIds([]);
      const nextStartTime = Date.now();
      setSessionStartTime(nextStartTime);

      saveActiveTryOutSession({
        packageId: pkg.id,
        currentSessionIndex: nextIndex,
        sessionStartTime: nextStartTime,
        sessionDurationMinutes: pkg.sessions[nextIndex].durationMinutes,
        userAnswers: {},
        doubtfulIds: [],
        completedSessions: newCompleted,
      });
    } else {
      // ALL 4 SESSIONS COMPLETED! Build Final Report
      finalizeTryOut(newCompleted);
    }
  }, [completedSessions, currentSessionConfig.subject, answers, sessionStartTime, currentSessionIndex, pkg]);

  // Finalize tryout and calculate comprehensive scores + breakdown
  const finalizeTryOut = (
    allCompleted: ActiveTryOutSessionData['completedSessions']
  ) => {
    let totalQuestionsCount = 0;
    let totalCorrectCount = 0;
    let totalTimeSpent = 0;
    const sessionResults: SessionResult[] = [];
    const allQuestionsCollected: TkaQuestion[] = [];
    const consolidatedAnswers: Record<string, number | number[]> = {};

    allCompleted.forEach((sess) => {
      const sessConfig =
        pkg.sessions.find((s) => s.subject === sess.subject) || pkg.sessions[0];
      const qs = resolveSessionQuestions(sessConfig, allBankQuestions);
      allQuestionsCollected.push(...qs);

      let correct = 0;
      let unanswered = 0;
      let wrong = 0;

      qs.forEach((q) => {
        const userChoice = sess.answers[q.id];
        consolidatedAnswers[q.id] = userChoice;
        const isComplex = q.questionType === 'PGK';
        if (isComplex) {
          const userArr = Array.isArray(userChoice)
            ? userChoice
            : userChoice !== undefined
            ? [userChoice]
            : [];
          const targetKeys = (q.correctAnswers || [q.correctAnswer]).slice().sort((a, b) => a - b);
          if (userArr.length === 0) {
            unanswered += 1;
          } else if (
            userArr.length === targetKeys.length &&
            userArr.every((v, i) => v === targetKeys[i])
          ) {
            correct += 1;
          } else {
            wrong += 1;
          }
        } else {
          const singleAns = Array.isArray(userChoice) ? userChoice[0] : userChoice;
          if (singleAns === undefined) {
            unanswered += 1;
          } else if (singleAns === q.correctAnswer) {
            correct += 1;
          } else {
            wrong += 1;
          }
        }
      });

      totalQuestionsCount += qs.length;
      totalCorrectCount += correct;
      totalTimeSpent += sess.timeSpentSeconds;

      const score100 = qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
      const score1000 = qs.length > 0 ? Math.round(200 + (correct / qs.length) * 800) : 200;

      sessionResults.push({
        subject: sess.subject,
        correct,
        total: qs.length,
        unanswered,
        wrong,
        score100,
        score1000,
        timeSpentSeconds: sess.timeSpentSeconds,
        userAnswers: sess.answers,
      });
    });

    const finalScore100 =
      totalQuestionsCount > 0 ? Math.round((totalCorrectCount / totalQuestionsCount) * 100) : 0;
    const finalScore1000 =
      totalQuestionsCount > 0 ? Math.round(200 + (totalCorrectCount / totalQuestionsCount) * 800) : 200;

    const { breakdowns, weakChapters, strongChapters } = calculateChapterBreakdown(
      allQuestionsCollected,
      consolidatedAnswers
    );

    const record: TryOutHistoryRecord = {
      id: `TO_RES_${Date.now()}`,
      packageId: pkg.id,
      packageName: pkg.title,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      totalScore1000: finalScore1000,
      totalScore100: finalScore100,
      totalCorrect: totalCorrectCount,
      totalQuestions: totalQuestionsCount,
      totalTimeSpentSeconds: totalTimeSpent,
      sessions: sessionResults,
      chapterBreakdowns: breakdowns,
      weakChapters,
      strongChapters,
    };

    saveTryOutResult(record);
    clearActiveTryOutSession();
    soundManager.playFanfare();
    onFinishAll(record);
  };

  const currentQ = sessionQuestions[currentQuestionIndex];
  const totalInSession = sessionQuestions.length;
  const answeredCount = Object.values(answers).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined
  ).length;

  // Calculate initial remaining seconds using server-like timestamp
  const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
  const totalSessionSeconds = currentSessionConfig.durationMinutes * 60;
  const secondsRemaining = Math.max(0, totalSessionSeconds - elapsedSeconds);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24">
      {/* Top Header CBT Navigation Bar */}
      <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentSessionIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Sesi {currentSessionIndex + 1} dari {pkg.sessions.length}
              </span>
              <span className="text-[10px] text-gray-500 font-semibold">• Blocking Time Aktif</span>
            </div>
            <h2 className="text-sm sm:text-base font-heading font-bold text-gray-900 mt-0.5">
              {currentSessionConfig.title}
            </h2>
          </div>
        </div>

        {/* Timer and Action Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <IsolatedTimer
            initialSecondsRemaining={secondsRemaining}
            onTimeExpired={handleLockAndProceedSession}
          />

          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold neu-button-primary bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {currentSessionIndex === pkg.sessions.length - 1
                ? 'Kunci & Selesai TOBK'
                : 'Selesai & Lanjut Sesi'}
            </span>
          </button>
        </div>
      </div>

      {/* Partial Questions Available Banner */}
      {sessionQuestions.length > 0 && sessionQuestions.length < currentSessionConfig.questionCount && (
        <div className="neu-flat rounded-2xl p-3.5 bg-blue-50/90 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Baru tersedia <strong>{sessionQuestions.length}</strong> dari <strong>{currentSessionConfig.questionCount}</strong> soal untuk sesi ini.
          </span>
        </div>
      )}

      {/* Empty Session State */}
      {sessionQuestions.length === 0 && (
        <div className="neu-flat rounded-3xl p-8 bg-[#E7EBF5] border border-white/80 text-center space-y-4 max-w-lg mx-auto my-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-heading font-extrabold text-gray-900">
              Sesi Belum Memiliki Soal
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
              Sesi ini belum memiliki soal. Hubungi admin untuk melengkapi paket ini.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl text-xs font-heading font-bold bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all cursor-pointer shadow-xs"
            >
              Keluar ke Menu Utama
            </button>
            {currentSessionIndex < pkg.sessions.length - 1 && (
              <button
                onClick={handleLockAndProceedSession}
                className="neu-button-primary px-4 py-2 rounded-xl text-xs font-heading font-bold bg-[#1C5FE0] text-white hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Lewati ke Sesi Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* CBT Question Palette (1..30) */}
      {sessionQuestions.length > 0 && (
        <div className="neu-flat rounded-2xl p-3 bg-[#E7EBF5] border border-white/80 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600 px-1">
          <span className="font-semibold">
            Palet Nomor Soal ({answeredCount} / {totalInSession} Dijawab)
          </span>
          <div className="flex items-center gap-3 text-[10px] font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Dijawab
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Ragu
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Belum
            </span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 max-h-32 overflow-y-auto p-1">
          {sessionQuestions.map((q, idx) => {
            const isSelected = idx === currentQuestionIndex;
            const ans = answers[q.id];
            const isAnswered = Array.isArray(ans) ? ans.length > 0 : ans !== undefined;
            const isDoubtful = doubtfulIds.includes(q.id);

            let badgeColor = 'bg-white/80 text-gray-700 border border-gray-200';
            if (isDoubtful) {
              badgeColor = 'bg-amber-400 text-amber-950 font-bold';
            } else if (isAnswered) {
              badgeColor = 'bg-emerald-500 text-white font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentQuestionIndex(idx);
                }}
                className={`h-8 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${badgeColor} ${
                  isSelected ? 'ring-2 ring-[#1C5FE0] ring-offset-2 scale-105 z-10' : 'hover:opacity-90'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Main CBT Question Card */}
      {currentQ && (
        <div className="neu-flat rounded-3xl p-5 sm:p-7 bg-[#E7EBF5] border border-white/80 space-y-5">
          {/* Question Subtopic & Skill Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-[#1C5FE0] text-white font-bold text-xs flex items-center justify-center">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-xs font-semibold text-gray-700">
                {currentQ.chapterName} {currentQ.subtopic && `• ${currentQ.subtopic}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentQ.skill && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Skill: {currentQ.skill}
                </span>
              )}
              <button
                onClick={() => handleToggleDoubtful(currentQ.id)}
                className={`px-3 py-1 rounded-xl text-xs font-heading font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  doubtfulIds.includes(currentQ.id)
                    ? 'bg-amber-400 text-amber-950 border border-amber-500 shadow-sm'
                    : 'neu-button text-gray-600 hover:text-gray-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{doubtfulIds.includes(currentQ.id) ? 'Ragu-Ragu (Ditandai)' : 'Ragu-Ragu'}</span>
              </button>
            </div>
          </div>

          {/* Listening Audio Section for English Listening Questions */}
          {currentQ.listeningScript && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900">
                  <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
                  <span className="font-heading font-bold text-xs sm:text-sm">
                    Listening Comprehension Audio Track
                  </span>
                </div>
                <button
                  onClick={() => handlePlayListeningAudio(currentQ.listeningScript)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAudioPlaying
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Hentikan Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Putar Audio Listening</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Dengarkan skrip audio dengan seksama (menggunakan Web Speech API suara natural) sebelum menjawab pertanyaan di bawah.
              </p>
            </div>
          )}

          {/* Reading Passage (if any) */}
          {currentQ.passage && (
            <div className="p-4 rounded-2xl bg-white/80 border border-blue-100 text-xs sm:text-sm text-gray-800 leading-relaxed max-h-48 overflow-y-auto italic">
              <p className="font-semibold not-italic text-[11px] text-blue-700 uppercase tracking-wide mb-1">
                Wacana Bacaan:
              </p>
              {currentQ.passage}
            </div>
          )}

          {/* Question Text & PGK notice */}
          {currentQ.questionType === 'PGK' && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-medium">
              <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                <strong>Pilihan Ganda Kompleks:</strong> Pilihan jawaban yang benar bisa lebih dari satu. Centang semua pilihan yang tepat.
              </span>
            </div>
          )}

          <div className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed whitespace-pre-line">
            <MathRenderer text={currentQ.question} />
          </div>

          {/* Options (A, B, C, D) */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt, optIdx) => {
              const isComplex = currentQ.questionType === 'PGK';
              const isSelected = isComplex
                ? Array.isArray(answers[currentQ.id]) &&
                  (answers[currentQ.id] as number[]).includes(optIdx)
                : answers[currentQ.id] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx, isComplex)}
                  className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm transition-all flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? isComplex
                        ? 'bg-purple-700 text-white shadow-md'
                        : 'bg-[#1C5FE0] text-white shadow-md'
                      : 'bg-white/70 hover:bg-white text-gray-800 border border-gray-200/80 hover:border-gray-300'
                  }`}
                >
                  <span
                    className={`w-6 h-6 text-xs font-bold flex items-center justify-center shrink-0 transition-all ${
                      isComplex
                        ? isSelected
                          ? 'rounded-lg bg-white text-purple-800 shadow-xs'
                          : 'rounded-lg bg-white text-gray-600 border border-gray-300'
                        : isSelected
                        ? 'rounded-full bg-white text-[#1C5FE0]'
                        : 'rounded-full bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isComplex && isSelected ? '✓' : String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="flex-1 pt-0.5 leading-relaxed">
                    <MathRenderer text={opt} inline={true} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => {
                soundManager.playClick();
                setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
              }}
              className="px-4 py-2 rounded-xl text-xs font-heading font-semibold neu-button flex items-center gap-1.5 disabled:opacity-40 text-gray-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-semibold text-gray-600">
              Soal {currentQuestionIndex + 1} dari {totalInSession}
            </span>

            {currentQuestionIndex < totalInSession - 1 ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentQuestionIndex((prev) => Math.min(totalInSession - 1, prev + 1));
                }}
                className="px-4 py-2 rounded-xl text-xs font-heading font-semibold neu-button flex items-center gap-1.5 text-gray-700 cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-heading font-bold neu-button-primary bg-emerald-600 text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Selesai Sesi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation & Blocking Time Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="neu-flat rounded-3xl p-6 bg-[#E7EBF5] border border-white/80 max-w-md w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-heading font-bold text-gray-900">
                Kunci Jawaban Sesi {currentSessionConfig.title}?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Peringatan <strong>Blocking Time</strong>: Setelah sesi ini dikunci, Anda <strong>TIDAK DAPAT</strong> kembali mengedit jawaban di sesi ini.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Soal Sudah Dijawab:</span>
                <strong className="text-emerald-700">{answeredCount} dari {totalInSession}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Soal Masih Ragu-Ragu:</span>
                <strong className="text-amber-700">{doubtfulIds.length}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Soal Belum Terisi:</span>
                <strong className="text-rose-700">{totalInSession - answeredCount}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-heading font-semibold neu-button text-gray-700 cursor-pointer"
              >
                Periksa Lagi
              </button>
              <button
                onClick={handleLockAndProceedSession}
                className="flex-1 py-2.5 rounded-xl text-xs font-heading font-bold neu-button-primary bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
              >
                Kunci &amp; Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
