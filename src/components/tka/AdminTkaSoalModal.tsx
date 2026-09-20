import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Plus,
  BookOpen,
  Volume2,
  Crown,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Wand2,
  RefreshCw,
  Save,
  Layers,
} from 'lucide-react';
import { TkaQuestion, TkaSubject, TkaSkill, TryOutPackage } from './tkaTypes';
import { TKA_CHAPTERS } from './tkaChaptersData';
import {
  saveCustomQuestion,
  loadAllTryOutPackages,
  saveCustomTryOutPackage,
  loadAllQuestions,
} from './tkaStorage';
import { soundManager } from '../../lib/gameAudio';
import { ttsHelper } from './ttsHelper';
import { MathRenderer } from './MathFormulaDisplay';

interface AdminTkaSoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionAdded: (question: TkaQuestion) => void;
}

export const AdminTkaSoalModal: React.FC<AdminTkaSoalModalProps> = ({
  isOpen,
  onClose,
  onQuestionAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'MANUAL' | 'AI'>('MANUAL');

  // Manual Form State
  const [subject, setSubject] = useState<TkaSubject>('IPA');
  const [chapterId, setChapterId] = useState<string>('IPA_BAB_1');
  const [subtopic, setSubtopic] = useState('');
  const [skill, setSkill] = useState<TkaSkill>('GENERAL');
  const [listeningScript, setListeningScript] = useState('');
  const [passage, setPassage] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [theKingFormula, setTheKingFormula] = useState('');
  const [conventionalSolution, setConventionalSolution] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');

  // AI Generator State
  const [aiSubject, setAiSubject] = useState<TkaSubject>('IPA');
  const [aiChapterId, setAiChapterId] = useState<string>('IPA_BAB_1');
  const [aiSkill, setAiSkill] = useState<TkaSkill>('GENERAL');
  const [aiSelectedPackageId, setAiSelectedPackageId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<TkaQuestion | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const allPackages = useMemo(() => {
    if (!isOpen) return [];
    return loadAllTryOutPackages();
  }, [isOpen]);

  if (!isOpen) return null;

  const currentChapters = TKA_CHAPTERS.filter((ch) => ch.subject === subject);
  const currentAiChapters = TKA_CHAPTERS.filter((ch) => ch.subject === aiSubject);

  const selectedManualPkg = allPackages.find((p) => p.id === selectedPackageId);
  const selectedManualSess = selectedManualPkg?.sessions.find((s) => s.subject === subject);

  const selectedAiPkg = allPackages.find((p) => p.id === aiSelectedPackageId);
  const selectedAiSess = selectedAiPkg?.sessions.find((s) => s.subject === aiSubject);

  const handleSubjectChange = (newSub: TkaSubject) => {
    setSubject(newSub);
    const firstCh = TKA_CHAPTERS.find((ch) => ch.subject === newSub);
    if (firstCh) setChapterId(firstCh.id);
    if (newSub === 'B_INGGRIS') {
      setSkill('READING');
    } else {
      setSkill('GENERAL');
      setListeningScript('');
    }
  };

  const handleAiSubjectChange = (newSub: TkaSubject) => {
    setAiSubject(newSub);
    const firstCh = TKA_CHAPTERS.find((ch) => ch.subject === newSub);
    if (firstCh) setAiChapterId(firstCh.id);
  };

  // Helper untuk menambahkan id soal ke sesi paket TOBK dan menyimpan paket yang diupdate
  const attachQuestionToPackage = (newQ: TkaQuestion, pkgId: string): string => {
    if (!pkgId) return '';
    const pkg = allPackages.find((p) => p.id === pkgId);
    if (!pkg) return '';

    const matchedSess = pkg.sessions.find((s) => s.subject === newQ.subject);
    const targetSessionCount = matchedSess?.questionCount || 30;

    // Push id soal ke questionIds sesi paket
    const updatedSessions = pkg.sessions.map((s) => {
      if (s.subject === newQ.subject) {
        const existingIds = s.questionIds ? [...s.questionIds] : [];
        if (!existingIds.includes(newQ.id)) {
          existingIds.push(newQ.id);
        }
        return {
          ...s,
          questionIds: existingIds,
        };
      }
      return s;
    });

    const updatedPackage: TryOutPackage = {
      ...pkg,
      sessions: updatedSessions,
    };

    saveCustomTryOutPackage(updatedPackage);

    // Hitung jumlah soal sekarang di sesi itu
    const allBank = loadAllQuestions();
    const currentCount = allBank.filter(
      (q) => (q.packageId === pkg.id || q.id === newQ.id) && q.subject === newQ.subject
    ).length;

    const mapelLabel =
      newQ.subject === 'IPA'
        ? 'IPA'
        : newQ.subject === 'B_INDO'
        ? 'B. Indonesia'
        : newQ.subject === 'B_INGGRIS'
        ? 'B. Inggris'
        : 'Matematika';

    return `Soal ditambahkan ke ${pkg.title} — sesi ${mapelLabel} kini ${currentCount}/${targetSessionCount} soal.`;
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      alert('Harap lengkapi teks pertanyaan dan semua 4 pilihan jawaban.');
      return;
    }

    const selectedCh = TKA_CHAPTERS.find((ch) => ch.id === chapterId);
    const newQ: TkaQuestion = {
      id: `CUSTOM_Q_${Date.now()}`,
      subject,
      chapterId,
      chapterName: selectedCh ? `${selectedCh.number}: ${selectedCh.title}` : 'Materi Umum',
      question: questionText.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      correctAnswer,
      theKingFormula: theKingFormula.trim() || 'THE KING: Pahami konsep dasar dan eliminasi opsi yang tidak relevan.',
      conventionalSolution: conventionalSolution.trim() || 'Berdasarkan teori yang tercantum pada buku pedoman resmi.',
      source: 'ADMIN',
      ...(selectedPackageId ? { packageId: selectedPackageId } : {}),
      ...(subtopic.trim() ? { subtopic: subtopic.trim() } : {}),
      ...(subject === 'B_INGGRIS' && skill ? { skill } : {}),
      ...(subject === 'B_INGGRIS' && skill === 'LISTENING' && listeningScript.trim() ? { listeningScript: listeningScript.trim() } : {}),
      ...(passage.trim() ? { passage: passage.trim() } : {}),
    };

    saveCustomQuestion(newQ);
    let msg = '';
    if (selectedPackageId) {
      msg = attachQuestionToPackage(newQ, selectedPackageId);
    }
    onQuestionAdded(newQ);
    soundManager.playCorrect();

    if (msg) {
      setNotificationToast(msg);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      onClose();
    }
  };

  // AI Generator Engine (Gemini API Asli)
  const handleGenerateAi = async () => {
    setIsGenerating(true);
    setAiErrorMessage(null);
    soundManager.playClick();

    const selectedCh = TKA_CHAPTERS.find((ch) => ch.id === aiChapterId);
    const chapterName = selectedCh ? `${selectedCh.number}: ${selectedCh.title}` : 'Materi Pilihan';

    try {
      const res = await fetch('/api/tka/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: aiSubject,
          chapterTitle: chapterName,
          skill: aiSubject === 'B_INGGRIS' ? aiSkill : undefined,
          questionType: 'PG',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.question) {
        throw new Error(data.error || 'Gagal menghasilkan soal dari AI.');
      }

      const q = data.question;
      const generated: TkaQuestion = {
        id: `AI_Q_${Date.now()}`,
        subject: aiSubject,
        chapterId: aiChapterId,
        chapterName,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer ?? 0,
        correctAnswers: q.correctAnswers || [q.correctAnswer ?? 0],
        theKingFormula: q.theKingFormula || 'THE KING: Pahami konsep dasar dan eliminasi opsi yang tidak relevan.',
        conventionalSolution: q.conventionalSolution || 'Berdasarkan konsep materi standar.',
        source: 'AI',
        questionType: q.questionType || 'PG',
        ...(aiSubject === 'B_INGGRIS' && aiSkill ? { skill: aiSkill } : {}),
        ...(q.listeningScript ? { listeningScript: q.listeningScript } : {}),
      };

      setGeneratedPreview(generated);
      soundManager.playCorrect();
    } catch (err: any) {
      console.warn('Generate question notice:', err);
      let msg = err?.message || 'Terjadi kendala saat memanggil model AI Google.';
      if (typeof msg === 'string' && msg.includes('{') && msg.includes('}')) {
        try {
          const parsed = JSON.parse(msg.replace(/^Error:\s*/, ''));
          if (parsed?.error?.message) {
            msg = parsed.error.message;
          }
        } catch {}
      }
      setAiErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptAiQuestion = () => {
    if (!generatedPreview) return;
    const finalQ: TkaQuestion = {
      ...generatedPreview,
      ...(aiSelectedPackageId ? { packageId: aiSelectedPackageId } : {}),
    };

    saveCustomQuestion(finalQ);
    let msg = '';
    if (aiSelectedPackageId) {
      msg = attachQuestionToPackage(finalQ, aiSelectedPackageId);
    }
    onQuestionAdded(finalQ);
    soundManager.playCorrect();

    if (msg) {
      setNotificationToast(msg);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/80 max-w-2xl w-full my-auto max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
        {/* Toast Notification */}
        {notificationToast && (
          <div className="p-3 rounded-2xl bg-emerald-600 text-white text-xs font-heading font-bold flex items-center gap-2 shadow-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationToast}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-gray-900">
                Pengelolaan Bank Soal TKA &amp; AI Generator
              </h3>
              <p className="text-xs text-gray-500">Khusus Master Admin Kelas IX-H</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Manual vs AI */}
        <div className="flex items-center gap-2 p-1 bg-white/70 rounded-2xl border border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('MANUAL')}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'MANUAL'
                ? 'bg-[#1C5FE0] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Input Soal Manual</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('AI')}
            className={`flex-1 py-2 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'AI'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Soal AI (On-Demand)</span>
          </button>
        </div>

        {/* TAB 1: MANUAL INPUT */}
        {activeTab === 'MANUAL' && (
          <form onSubmit={handleSaveManual} className="space-y-3.5 text-xs">
            {/* Assign ke Paket TOBK (MANUAL) */}
            <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#1C5FE0]" />
                  <span>Assign ke Paket TOBK:</span>
                </label>
                <span className="text-[10px] text-blue-700 font-medium">Opsional</span>
              </div>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full p-2 rounded-xl border border-blue-300 bg-white text-gray-800 text-xs focus:ring-2 focus:ring-[#1C5FE0]"
              >
                <option value="">— Soal latihan biasa (tidak masuk paket manapun) —</option>
                {allPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} ({pkg.tag})
                  </option>
                ))}
              </select>
              {selectedManualPkg && (
                <div className="p-2 rounded-xl bg-white/90 border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Soal ini otomatis masuk ke Sesi:{' '}
                    <strong>{selectedManualSess?.title || subject}</strong> pada paket{' '}
                    <strong>{selectedManualPkg.title}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Mata Pelajaran:</label>
                <select
                  value={subject}
                  onChange={(e) => handleSubjectChange(e.target.value as TkaSubject)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
                >
                  <option value="IPA">IPA</option>
                  <option value="B_INDO">Bahasa Indonesia</option>
                  <option value="B_INGGRIS">Bahasa Inggris (3 Skills + Audio)</option>
                  <option value="MATEMATIKA">Matematika</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Bab / Materi:</label>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
                >
                  {currentChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.number}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subtopic */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Subtopik / Konsep Spesifik (Opsional):</label>
              <input
                type="text"
                placeholder="Contoh: Tekanan Hidrostatis, Sistem Saraf, dsb."
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
              />
            </div>

            {/* English Specific (Skill & Audio Script) */}
            {subject === 'B_INGGRIS' && (
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">Skill Bahasa Inggris:</span>
                  <div className="flex items-center gap-2">
                    {(['LISTENING', 'READING', 'WRITING'] as TkaSkill[]).map((sk) => (
                      <button
                        type="button"
                        key={sk}
                        onClick={() => setSkill(sk)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                          skill === sk ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                        }`}
                      >
                        {sk}
                      </button>
                    ))}
                  </div>
                </div>

                {skill === 'LISTENING' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-blue-900 text-[11px]">
                        Teks Audio Skrip Listening (Akan dibaca otomatis oleh Web Speech TTS):
                      </label>
                      {listeningScript && (
                        <button
                          type="button"
                          onClick={() => ttsHelper.speak(listeningScript, 'en-US')}
                          className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Tes Dengar</span>
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Contoh skrip dialog / pengumuman dalam bahasa Inggris..."
                      value={listeningScript}
                      onChange={(e) => setListeningScript(e.target.value)}
                      className="w-full p-2 rounded-xl border border-blue-300 bg-white text-gray-800"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Passage (optional) */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Wacana / Teks Bacaan (Opsional):</label>
              <textarea
                rows={2}
                placeholder="Teks bacaan pendukung soal jika ada..."
                value={passage}
                onChange={(e) => setPassage(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
              />
            </div>

            {/* Question */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Teks Pertanyaan Soal:</label>
              <textarea
                rows={3}
                required
                placeholder="Tuliskan pertanyaan soal..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-gray-700 mb-0.5">Pilihan A:</label>
                <input
                  type="text"
                  required
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-0.5">Pilihan B:</label>
                <input
                  type="text"
                  required
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-0.5">Pilihan C:</label>
                <input
                  type="text"
                  required
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-0.5">Pilihan D:</label>
                <input
                  type="text"
                  required
                  value={optD}
                  onChange={(e) => setOptD(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
                />
              </div>
            </div>

            {/* Correct Key */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Kunci Jawaban Benar:</label>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCorrectAnswer(idx)}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      correctAnswer === idx
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    Opsi {String.fromCharCode(65 + idx)}
                  </button>
                ))}
              </div>
            </div>

            {/* The King Formula */}
            <div>
              <label className="block font-bold text-amber-800 mb-1 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Metode The King (Trik Kilat 15 Detik):</span>
              </label>
              <textarea
                rows={2}
                placeholder="THE KING: Rumus cepat, kata kunci eliminasi, atau trik hitung kilat..."
                value={theKingFormula}
                onChange={(e) => setTheKingFormula(e.target.value)}
                className="w-full p-2 rounded-xl border border-amber-300 bg-amber-50/50 text-gray-900"
              />
            </div>

            {/* Conventional Solution */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Pembahasan Konvensional:</label>
              <textarea
                rows={2}
                placeholder="Langkah penjabaran buku sekolah..."
                value={conventionalSolution}
                onChange={(e) => setConventionalSolution(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl neu-button text-gray-700 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl neu-button-primary bg-[#1C5FE0] hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan ke Bank Soal</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: AI GENERATOR */}
        {activeTab === 'AI' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-purple-600" />
                <span>Gemini AI Question Generator on Demand</span>
              </span>
              <p className="text-[11px] text-purple-700 leading-relaxed">
                Hasilkan soal baru berstandar TOBK secara instan lengkap dengan stimulus, opsi, trik The King 15 detik, dan kunci jawaban terverifikasi.
              </p>
            </div>

            {/* Assign ke Paket TOBK (AI Generator) */}
            <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Assign ke Paket TOBK:</span>
                </label>
                <span className="text-[10px] text-purple-700 font-medium">Opsional</span>
              </div>
              <select
                value={aiSelectedPackageId}
                onChange={(e) => setAiSelectedPackageId(e.target.value)}
                className="w-full p-2 rounded-xl border border-purple-300 bg-white text-gray-800 text-xs focus:ring-2 focus:ring-purple-600"
              >
                <option value="">— Soal latihan biasa (tidak masuk paket manapun) —</option>
                {allPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} ({pkg.tag})
                  </option>
                ))}
              </select>
              {selectedAiPkg && (
                <div className="p-2 rounded-xl bg-white/90 border border-purple-200 text-[11px] text-purple-900 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Soal ini otomatis masuk ke Sesi:{' '}
                    <strong>{selectedAiSess?.title || aiSubject}</strong> pada paket{' '}
                    <strong>{selectedAiPkg.title}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Pilih Mapel:</label>
                <select
                  value={aiSubject}
                  onChange={(e) => handleAiSubjectChange(e.target.value as TkaSubject)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
                >
                  <option value="IPA">IPA</option>
                  <option value="B_INDO">Bahasa Indonesia</option>
                  <option value="B_INGGRIS">Bahasa Inggris</option>
                  <option value="MATEMATIKA">Matematika</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Pilih Bab Target:</label>
                <select
                  value={aiChapterId}
                  onChange={(e) => setAiChapterId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white text-gray-800"
                >
                  {currentAiChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.number}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {aiSubject === 'B_INGGRIS' && (
              <div>
                <label className="block font-bold text-gray-700 mb-1">Target Skill B. Inggris:</label>
                <div className="flex items-center gap-2">
                  {(['LISTENING', 'READING', 'WRITING'] as TkaSkill[]).map((sk) => (
                    <button
                      type="button"
                      key={sk}
                      onClick={() => setAiSkill(sk)}
                      className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                        aiSkill === sk ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300 text-gray-700'
                      }`}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateAi}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-heading font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sedang Menghasilkan Soal AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Soal Sekarang</span>
                </>
              )}
            </button>

            {/* Error / High-demand Notice Banner */}
            {aiErrorMessage && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2 animate-fade-in shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <span className="font-bold text-xs block text-amber-950">
                      Kendala Akses Server AI
                    </span>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      {aiErrorMessage}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={handleGenerateAi}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Coba Ulangi Generate</span>
                  </button>
                </div>
              </div>
            )}

            {/* Generated Result Preview */}
            {generatedPreview && (
              <div className="p-4 rounded-2xl bg-white border border-purple-300 space-y-3 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-purple-900 text-xs">
                    Pratinjau Hasil Generate AI:
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                    {generatedPreview.chapterName}
                  </span>
                </div>

                {generatedPreview.listeningScript && (
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
                    <span className="font-bold text-[11px] block">Audio Script (Listening):</span>
                    <p className="text-[11px] italic mt-0.5">{generatedPreview.listeningScript}</p>
                  </div>
                )}

                {generatedPreview.passage && (
                  <div className="p-2.5 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 italic">
                    {generatedPreview.passage}
                  </div>
                )}

                <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                  <MathRenderer text={generatedPreview.question} />
                </div>

                <div className="space-y-1">
                  {generatedPreview.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl text-xs flex items-center gap-2 ${
                        i === generatedPreview.correctAnswer
                          ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white text-center font-bold text-[10px] leading-5 shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <div className="flex-1">
                        <MathRenderer text={opt} inline={true} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <strong className="text-[11px] flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>The King Formula:</span>
                  </strong>
                  <div className="text-[11px] font-mono leading-relaxed bg-white/80 p-2 rounded-lg border border-amber-200 whitespace-pre-line">
                    <MathRenderer text={generatedPreview.theKingFormula} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleGenerateAi}
                    className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Generate Ulang</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAiQuestion}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simpan ke Bank Soal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
