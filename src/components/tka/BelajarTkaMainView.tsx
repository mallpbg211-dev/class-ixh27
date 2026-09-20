import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PenTool,
  Trophy,
  History,
  Play,
  Clock,
  CheckCircle2,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  RotateCcw,
  Zap,
  Calculator,
} from 'lucide-react';
import {
  TryOutPackage,
  TryOutHistoryRecord,
  TkaQuestion,
} from './tkaTypes';
import {
  TRY_OUT_PACKAGES,
  loadAllQuestions,
  loadActiveTryOutSession,
  loadTryOutHistory,
  clearActiveTryOutSession,
  ActiveTryOutSessionData,
  initTkaFirestoreSync,
} from './tkaStorage';
import { TryOutCbtSessionView } from './TryOutCbtSessionView';
import { LatihanSoalView } from './LatihanSoalView';
import { RiwayatProgressView } from './RiwayatProgressView';
import { TkaLeaderboardView } from './TkaLeaderboardView';
import { TheKingFormulaView } from './TheKingFormulaView';
import { KalkulatorSmaView } from './KalkulatorSmaView';
import { AdminTkaSoalModal } from './AdminTkaSoalModal';
import { TobkTkaGridView } from './TobkTkaGridView';
import { UserRole } from '../../types';
import { soundManager } from '../../lib/gameAudio';
import { TkaSubject } from './tkaTypes';

export type TkaSubTab = 'TRY_OUT' | 'LATIHAN' | 'RUMUS' | 'KALKULATOR_SMA' | 'PROGRESS' | 'LEADERBOARD';

interface BelajarTkaMainViewProps {
  currentRole: UserRole;
  initialSubTab?: TkaSubTab;
}

export const BelajarTkaMainView: React.FC<BelajarTkaMainViewProps> = ({
  currentRole,
  initialSubTab = 'TRY_OUT',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<TkaSubTab>(initialSubTab);

  // Bank questions state
  const [allQuestions, setAllQuestions] = useState<TkaQuestion[]>([]);

  // Active Try Out CBT Session
  const [activePackage, setActivePackage] = useState<TryOutPackage | null>(null);
  const [activeSavedSession, setActiveSavedSession] = useState<ActiveTryOutSessionData | null>(null);

  // State for focused practice from TobkGrid
  const [focusedPractice, setFocusedPractice] = useState<{
    subject: TkaSubject;
    packageIndex: number;
    chapterId?: string;
  } | null>(null);

  // History state
  const [history, setHistory] = useState<TryOutHistoryRecord[]>([]);

  // Admin Modal
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Load initial data and sync with Firestore in real-time
  useEffect(() => {
    setAllQuestions(loadAllQuestions());
    setHistory(loadTryOutHistory());
    const saved = loadActiveTryOutSession();
    setActiveSavedSession(saved);

    const cleanup = initTkaFirestoreSync((updatedHistory) => {
      setHistory(updatedHistory);
      setAllQuestions(loadAllQuestions());
    });
    return () => cleanup();
  }, []);

  const handleStartPackage = (pkg: TryOutPackage, continueSession: boolean = false) => {
    soundManager.playClick();
    setActivePackage(pkg);
    if (!continueSession) {
      clearActiveTryOutSession();
      setActiveSavedSession(null);
    }
  };

  const handleFinishTryOut = (record: TryOutHistoryRecord) => {
    setActivePackage(null);
    setActiveSavedSession(null);
    setHistory(loadTryOutHistory());
    setActiveSubTab('PROGRESS');
  };

  const handleQuestionAdded = (newQ: TkaQuestion) => {
    setAllQuestions((prev) => [newQ, ...prev]);
  };

  // If a CBT exam session is currently ongoing, show the CBT view full
  if (activePackage) {
    return (
      <TryOutCbtSessionView
        pkg={activePackage}
        initialSessionData={activeSavedSession?.packageId === activePackage.id ? activeSavedSession : null}
        allBankQuestions={allQuestions}
        onFinishAll={handleFinishTryOut}
        onExit={() => {
          setActivePackage(null);
          setActiveSavedSession(loadActiveTryOutSession());
        }}
      />
    );
  }

  const subNavItems: { id: TkaSubTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'TRY_OUT', label: 'Try Out (TOBK)', icon: Play },
    { id: 'LATIHAN', label: 'Latihan Soal', icon: PenTool },
    { id: 'RUMUS', label: 'Kumpulan Rumus & Trik', icon: Sparkles },
    { id: 'KALKULATOR_SMA', label: 'Kalkulator Masuk SMA', icon: Calculator },
    { id: 'PROGRESS', label: 'Riwayat & Progress', icon: History },
    { id: 'LEADERBOARD', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24">
      {/* Top Banner TKA Hub */}
      <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-heading font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
              Mekanisme Trik The King
            </span>
            <span className="text-xs text-gray-500 font-semibold">• Kurikulum Resmi IX-H</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-gray-900 mt-1">
            Belajar TKA (Tes Kemampuan Akademik)
          </h1>
          <p className="text-xs text-gray-600 max-w-lg mt-0.5 leading-relaxed">
            Simulasi ujian TOBK 4 sesi terstandar, latihan soal santai per bab dengan trik The King 15 detik, dan evaluasi peta kelemahan materi.
          </p>
        </div>

        {/* Admin Bank & AI Button */}
        {currentRole === 'ADMIN' && (
          <button
            onClick={() => {
              soundManager.playClick();
              setShowAdminModal(true);
            }}
            className="px-3.5 py-2 rounded-2xl neu-button text-purple-900 font-heading font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer border border-purple-300 hover:bg-purple-50 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Kelola Soal &amp; AI</span>
          </button>
        )}
      </div>

      {/* Sub-Navigation Switcher (4 Menus Requested) */}
      <div className="neu-flat rounded-2xl p-1.5 bg-[#E7EBF5] border border-white/80 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                setActiveSubTab(item.id);
              }}
              className={`flex-1 py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#1C5FE0] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: TRY OUT (TOBK) - With Gambar 2 UI & CBT packages */}
      {/* ========================================================= */}
      {activeSubTab === 'TRY_OUT' && (
        <div className="space-y-4">
          {/* Ongoing Saved Session Notification */}
          {activeSavedSession && (
            <div className="neu-flat rounded-2xl p-4 bg-amber-500/15 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                    Ada Sesi Try Out yang Belum Selesai (Auto-Saved)
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    Anda sedang mengerjakan Sesi ke-{activeSavedSession.currentSessionIndex + 1}. Jawaban Anda aman tersimpan otomatis.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    clearActiveTryOutSession();
                    setActiveSavedSession(null);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900 hover:bg-amber-500/20 cursor-pointer"
                >
                  Buang Sesi
                </button>
                <button
                  onClick={() => {
                    const found = TRY_OUT_PACKAGES.find((p) => p.id === activeSavedSession.packageId) || TRY_OUT_PACKAGES[0];
                    handleStartPackage(found, true);
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-heading font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tobk Grid View (Gambar 2 layout with Subtes and 12-Package Card Grid) */}
          <TobkTkaGridView
            history={history}
            allQuestions={allQuestions}
            onSelectPracticePackage={(subject, packageIndex, chapterId) => {
              setFocusedPractice({ subject, packageIndex, chapterId });
              setActiveSubTab('LATIHAN');
            }}
            onStartSimulasiTobk={(pkg) => handleStartPackage(pkg)}
          />

          {/* Collapsible Complete CBT Simulation Packages (Simulasi Resmi) */}
          <div className="pt-3 border-t border-[#C4CAE0]/50 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-heading font-bold text-gray-800">
                Paket Simulasi Lengkap CBT (Multi-Sesi Blocking Time)
              </h3>
              <span className="text-xs text-gray-500 font-semibold">
                {TRY_OUT_PACKAGES.length} Paket Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TRY_OUT_PACKAGES.map((pkg) => {
                const isBojongsariMtk = pkg.id === 'TO_PAKET_SMPN1_BOJONGSARI_MTK';
                const isBojongsariBindo = pkg.id === 'TO_PAKET_SMPN1_BOJONGSARI';
                const isBojongsari = isBojongsariMtk || isBojongsariBindo;
                return (
                  <div
                    key={pkg.id}
                    className={`neu-flat rounded-3xl p-5 transition-all flex flex-col justify-between space-y-4 ${
                      isBojongsariMtk
                        ? 'bg-gradient-to-b from-[#EAEFFB] via-[#E7EBF5] to-[#E3F2FD] border-2 border-indigo-400/90 shadow-md'
                        : isBojongsariBindo
                        ? 'bg-gradient-to-b from-[#EAEFFB] via-[#E7EBF5] to-[#E8F5E9] border-2 border-emerald-400/90 shadow-md'
                        : 'bg-[#E7EBF5] border border-white/80 hover:border-blue-300'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-heading font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                            isBojongsariMtk
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : isBojongsariBindo
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {pkg.tag}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {pkg.totalQuestions} Soal
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-heading font-extrabold text-gray-900 leading-snug">
                        {pkg.title}
                      </h4>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Sessions Breakdown */}
                      <div className="pt-2 border-t border-gray-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                          {pkg.sessions.length === 1
                            ? '1 Sesi Ujian Mandiri:'
                            : `${pkg.sessions.length} Sesi Berurutan (Blocking Time):`}
                        </span>
                        <ul className="text-[11px] text-gray-700 space-y-1 font-medium">
                          {pkg.sessions.map((s, idx) => (
                            <li
                              key={idx}
                              className="flex justify-between items-center py-0.5 px-2 rounded-lg bg-white/60"
                            >
                              <span className="font-semibold text-gray-800">{s.title}</span>
                              <span className="text-gray-500 text-[10px] font-bold">
                                {s.durationMinutes} menit • {s.questionCount} soal
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartPackage(pkg)}
                      className={`w-full py-2.5 rounded-2xl font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all ${
                        isBojongsariMtk
                          ? 'neu-button-primary bg-indigo-600 hover:bg-indigo-700 text-white'
                          : isBojongsariBindo
                          ? 'neu-button-primary bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'neu-button-primary bg-[#1C5FE0] hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Mulai Try Out {isBojongsari ? (isBojongsariMtk ? 'Matematika SMPN 1' : 'B. Indo SMPN 1') : 'TOBK'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: LATIHAN SOAL */}
      {/* ========================================================= */}
      {activeSubTab === 'LATIHAN' && (
        <LatihanSoalView
          allQuestions={allQuestions}
          initialSubject={focusedPractice?.subject || 'MATEMATIKA'}
          initialChapterId={focusedPractice?.chapterId || 'ALL'}
          packageIndex={focusedPractice?.packageIndex}
          onBack={() => {
            setFocusedPractice(null);
            setActiveSubTab('TRY_OUT');
          }}
        />
      )}

      {/* ========================================================= */}
      {/* SUB-TAB: KUMPULAN RUMUS & TRIK THE KING */}
      {/* ========================================================= */}
      {activeSubTab === 'RUMUS' && (
        <TheKingFormulaView />
      )}

      {/* ========================================================= */}
      {/* SUB-TAB: KALKULATOR NILAI MASUK SMA IMPIAN */}
      {/* ========================================================= */}
      {activeSubTab === 'KALKULATOR_SMA' && (
        <KalkulatorSmaView currentRole={currentRole} history={history} />
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: RIWAYAT & PROGRESS */}
      {/* ========================================================= */}
      {activeSubTab === 'PROGRESS' && (
        <RiwayatProgressView
          history={history}
          onStartNewTryOut={() => setActiveSubTab('TRY_OUT')}
        />
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: LEADERBOARD */}
      {/* ========================================================= */}
      {activeSubTab === 'LEADERBOARD' && (
        <TkaLeaderboardView currentRole={currentRole} />
      )}

      {/* Admin Question & AI Generator Modal */}
      <AdminTkaSoalModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onQuestionAdded={handleQuestionAdded}
      />
    </div>
  );
};
