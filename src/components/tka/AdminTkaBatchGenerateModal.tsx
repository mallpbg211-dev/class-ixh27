import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Layers,
  BookOpen,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Loader2,
  CheckSquare,
  Square,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import {
  TkaQuestion,
  TkaSubject,
  TkaSkill,
  TkaQuestionType,
  TryOutPackage,
} from './tkaTypes';
import { TKA_CHAPTERS } from './tkaChaptersData';
import {
  loadAllTryOutPackages,
  loadAllQuestions,
  saveCustomQuestion,
  saveCustomTryOutPackage,
} from './tkaStorage';
import { MathRenderer } from './MathFormulaDisplay';
import { soundManager } from '../../lib/gameAudio';

interface AdminTkaBatchGenerateModalProps {
  isOpen: boolean;
  initialPackageId?: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface GeneratedBatchQuestionItem {
  tempId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswers?: number[];
  conventionalSolution: string;
  theKingFormula: string;
  listeningScript?: string;
  questionType?: TkaQuestionType;
  selected: boolean;
  isExpanded: boolean;
}

export const AdminTkaBatchGenerateModal: React.FC<AdminTkaBatchGenerateModalProps> = ({
  isOpen,
  initialPackageId,
  onClose,
  onSuccess,
}) => {
  // Data Master Paket & Soal
  const [packages, setPackages] = useState<TryOutPackage[]>([]);
  const [allQuestions, setAllQuestions] = useState<TkaQuestion[]>([]);

  // Form State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [subject, setSubject] = useState<TkaSubject>('IPA');
  const [chapterId, setChapterId] = useState<string>('');
  const [subtopic, setSubtopic] = useState<string>('');
  const [skill, setSkill] = useState<TkaSkill>('GENERAL');
  const [questionType, setQuestionType] = useState<TkaQuestionType>('PG');
  const [generateCount, setGenerateCount] = useState<number>(10);

  // Workflow State: 'CONFIG' | 'GENERATING' | 'PREVIEW'
  const [workflowStep, setWorkflowStep] = useState<'CONFIG' | 'GENERATING' | 'PREVIEW'>('CONFIG');
  const [progressText, setProgressText] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Generated Result State
  const [previewQuestions, setPreviewQuestions] = useState<GeneratedBatchQuestionItem[]>([]);
  const [isPartialResult, setIsPartialResult] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inisialisasi Paket & Bank Soal
  useEffect(() => {
    if (isOpen) {
      const pkgs = loadAllTryOutPackages();
      const qs = loadAllQuestions();
      setPackages(pkgs);
      setAllQuestions(qs);

      const targetPkgId =
        initialPackageId && pkgs.some((p) => p.id === initialPackageId)
          ? initialPackageId
          : pkgs[0]?.id || '';
      setSelectedPackageId(targetPkgId);

      // Default subject ke sesi pertama paket jika ada
      const targetPkg = pkgs.find((p) => p.id === targetPkgId);
      const firstSubject = targetPkg?.sessions[0]?.subject || 'IPA';
      setSubject(firstSubject);

      // Default chapter untuk subject
      const defaultCh = TKA_CHAPTERS.find((ch) => ch.subject === firstSubject);
      if (defaultCh) setChapterId(defaultCh.id);

      setWorkflowStep('CONFIG');
      setPreviewQuestions([]);
      setErrorMessage(null);
    }
  }, [isOpen, initialPackageId]);

  // Paket yang sedang terpilih
  const currentPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId) || null;
  }, [packages, selectedPackageId]);

  // Bab-bab untuk mata pelajaran yang dipilih
  const availableChapters = useMemo(() => {
    return TKA_CHAPTERS.filter((ch) => ch.subject === subject);
  }, [subject]);

  // Ketika subject berubah, perbarui default chapterId dan hitung sisa kuota
  useEffect(() => {
    const ch = availableChapters[0];
    if (ch) {
      setChapterId(ch.id);
    }
  }, [subject, availableChapters]);

  // Hitung jumlah soal yang sudah terisi di sesi mapel ini untuk paket ini
  const sessionStatus = useMemo(() => {
    if (!currentPackage) {
      return { currentCount: 0, targetCount: 30, remaining: 30 };
    }
    const matchedSession = currentPackage.sessions.find((s) => s.subject === subject);
    const targetCount = matchedSession?.questionCount || 30;

    // Hitung soal di bank yang ber-packageId atau tercatat di session
    const inBankCount = allQuestions.filter(
      (q) => q.packageId === currentPackage.id && q.subject === subject
    ).length;
    const explicitCount = matchedSession?.questionIds?.length || 0;
    const currentCount = inBankCount > 0 ? inBankCount : explicitCount;
    const remaining = Math.max(0, targetCount - currentCount);

    return { currentCount, targetCount, remaining };
  }, [currentPackage, subject, allQuestions]);

  // Ketika paket atau mapel berubah di form config, update default count ke sisa kuota
  useEffect(() => {
    if (workflowStep === 'CONFIG') {
      const defaultVal = sessionStatus.remaining > 0 ? sessionStatus.remaining : 10;
      setGenerateCount(Math.min(defaultVal, 30));
    }
  }, [sessionStatus.remaining, workflowStep]);

  if (!isOpen) return null;

  // Handler Generate Batch
  const handleStartGenerate = async () => {
    if (!currentPackage) {
      alert('Silakan pilih Paket TOBK tujuan.');
      return;
    }

    const selectedCh = TKA_CHAPTERS.find((ch) => ch.id === chapterId);
    const chapterName = selectedCh ? `${selectedCh.number}: ${selectedCh.title}` : 'Materi Pilihan';

    setWorkflowStep('GENERATING');
    setErrorMessage(null);
    setProgressPercent(15);
    setProgressText(`Menghubungkan ke Gemini AI untuk ${generateCount} butir soal ${subject}...`);
    soundManager.playClick();

    const controller = new AbortController();
    setAbortController(controller);

    // Animasi progress teks bertahap
    let progressTimer: any;
    let step = 1;
    progressTimer = setInterval(() => {
      step++;
      if (step === 2) {
        setProgressPercent(35);
        setProgressText(`Membuat draf variasi soal berbobot HOTS (Bab: ${chapterName})...`);
      } else if (step === 3) {
        setProgressPercent(60);
        setProgressText('Memverifikasi notasi LaTeX matematika & rumus The King...');
      } else if (step === 4) {
        setProgressPercent(80);
        setProgressText('Mengecek dan membersihkan potensi duplikasi antar-soal...');
      }
    }, 2800);

    try {
      const res = await fetch('/api/tka/generate-question-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          subject,
          chapterTitle: chapterName,
          subtopic: subtopic.trim() || undefined,
          skill: subject === 'B_INGGRIS' ? skill : undefined,
          questionType,
          count: generateCount,
        }),
      });

      clearInterval(progressTimer);

      const data = await res.json();

      if (!res.ok || !data.success || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error(data.error || 'Tidak ada soal yang berhasil digenerate.');
      }

      setProgressPercent(100);
      setProgressText(`Selesai! ${data.questions.length} butir soal berhasil dibuat.`);

      const mapped: GeneratedBatchQuestionItem[] = data.questions.map((q: any, idx: number) => ({
        tempId: `PREVIEW_${Date.now()}_${idx}`,
        question: q.question,
        options: q.options || ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        correctAnswers: q.correctAnswers || [q.correctAnswer ?? 0],
        conventionalSolution: q.conventionalSolution || 'Pembahasan telah diverifikasi oleh AI.',
        theKingFormula: q.theKingFormula || 'Gunakan penalaran The King.',
        listeningScript: q.listeningScript || '',
        questionType: q.questionType || questionType,
        selected: true,
        isExpanded: idx === 0, // expand soal pertama saja agar rapi
      }));

      setIsPartialResult(Boolean(data.partial));
      setPreviewQuestions(mapped);
      setWorkflowStep('PREVIEW');
      soundManager.playCorrect();
    } catch (err: any) {
      clearInterval(progressTimer);
      if (err.name === 'AbortError') {
        console.info('Generate batch dibatalkan oleh user.');
        setWorkflowStep('CONFIG');
        return;
      }
      console.warn('Batch generation notice:', err);
      setErrorMessage(
        err.message || 'Terjadi gangguan saat memanggil Gemini API. Silakan coba lagi.'
      );
      setWorkflowStep('CONFIG');
    } finally {
      setAbortController(null);
    }
  };

  const handleCancelGenerate = () => {
    if (abortController) {
      abortController.abort();
    }
    setWorkflowStep('CONFIG');
  };

  // Preview List Handlers
  const handleToggleSelectAll = () => {
    const allSelected = previewQuestions.every((q) => q.selected);
    setPreviewQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        selected: !allSelected,
      }))
    );
  };

  const handleToggleSelectQuestion = (tempId: string) => {
    setPreviewQuestions((prev) =>
      prev.map((q) => (q.tempId === tempId ? { ...q, selected: !q.selected } : q))
    );
  };

  const handleToggleExpandQuestion = (tempId: string) => {
    setPreviewQuestions((prev) =>
      prev.map((q) => (q.tempId === tempId ? { ...q, isExpanded: !q.isExpanded } : q))
    );
  };

  const handleDeletePreviewQuestion = (tempId: string) => {
    setPreviewQuestions((prev) => prev.filter((q) => q.tempId !== tempId));
  };

  // Simpan Soal Terpilih ke Paket
  const handleSaveToPackage = () => {
    if (!currentPackage) return;
    const selectedItems = previewQuestions.filter((q) => q.selected);
    if (selectedItems.length === 0) {
      alert('Pilih setidaknya 1 butir soal untuk disimpan.');
      return;
    }

    const selectedCh = TKA_CHAPTERS.find((ch) => ch.id === chapterId);
    const chapterName = selectedCh ? `${selectedCh.number}: ${selectedCh.title}` : 'Materi Pilihan';

    const now = Date.now();
    const createdQuestions: TkaQuestion[] = selectedItems.map((item, idx) => ({
      id: `AI_${subject}_${currentPackage.id}_${now}_${idx + 1}`,
      subject,
      chapterId: selectedCh ? selectedCh.id : `CH_${subject}_1`,
      chapterName,
      subtopic: subtopic.trim() || undefined,
      skill: subject === 'B_INGGRIS' ? skill : undefined,
      questionType: item.questionType || 'PG',
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      correctAnswers: item.correctAnswers,
      conventionalSolution: item.conventionalSolution,
      theKingFormula: item.theKingFormula,
      listeningScript: item.listeningScript || undefined,
      source: 'AI',
      packageId: currentPackage.id,
    }));

    // 1. Simpan semua soal ke bank
    createdQuestions.forEach((q) => saveCustomQuestion(q));

    // 2. Attach id soal ke sesi paket yang sesuai
    const newQuestionIds = createdQuestions.map((q) => q.id);
    const updatedSessions = currentPackage.sessions.map((s) => {
      if (s.subject === subject) {
        const existing = s.questionIds ? [...s.questionIds] : [];
        const merged = Array.from(new Set([...existing, ...newQuestionIds]));
        return {
          ...s,
          questionIds: merged,
        };
      }
      return s;
    });

    const updatedPackage: TryOutPackage = {
      ...currentPackage,
      sessions: updatedSessions,
    };

    saveCustomTryOutPackage(updatedPackage);

    // Hitung total akhir
    const finalCount =
      sessionStatus.currentCount + createdQuestions.length;
    const mapelLabel =
      subject === 'IPA'
        ? 'IPA'
        : subject === 'B_INDO'
        ? 'B. Indonesia'
        : subject === 'B_INGGRIS'
        ? 'B. Inggris'
        : 'Matematika';

    const successSummary = `${createdQuestions.length} soal berhasil ditambahkan ke ${currentPackage.title} — sesi ${mapelLabel} kini ${finalCount}/${sessionStatus.targetCount} soal.`;

    soundManager.playCorrect();
    onSuccess(successSummary);
    onClose();
  };

  const selectedCount = previewQuestions.filter((q) => q.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/90 max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-200/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 to-[#1C5FE0] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#1F3A5F] flex items-center gap-1.5">
                <span>Generate Soal AI per Paket (Batch)</span>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Gemini Flash
                </span>
              </h3>
              <p className="text-xs text-[#5C6F84]">
                Otomatisasi pengisian kuota bank soal TOBK dengan variasi HOTS &amp; KaTeX LaTeX.
              </p>
            </div>
          </div>

          <button
            onClick={workflowStep === 'GENERATING' ? handleCancelGenerate : onClose}
            className="p-2 rounded-xl bg-white/70 hover:bg-white text-gray-500 hover:text-gray-800 transition-all cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Notification jika ada */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Kendala Pemanggilan AI:</p>
              <p className="text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              Tutup
            </button>
          </div>
        )}

        {/* ---------------- STEP 1: FORM CONFIGURATION ---------------- */}
        {workflowStep === 'CONFIG' && (
          <div className="flex-1 overflow-y-auto pr-1 py-3.5 space-y-4 text-xs">
            {/* 1. Pilih Paket TOBK Tujuan */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-heading font-bold text-xs text-[#1F3A5F] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>1. Paket TOBK Tujuan:</span>
                </label>
                <span className="text-[10px] text-gray-400">Pilih dari paket yang tersedia</span>
              </div>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50/40 text-xs font-bold text-[#1F3A5F] focus:outline-none focus:ring-2 focus:ring-[#1C5FE0]"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title} ({pkg.tag})
                  </option>
                ))}
              </select>

              {currentPackage && (
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#E7EBF5]/80 text-[11px] text-[#1F3A5F]">
                  <span className="truncate">{currentPackage.description}</span>
                  <span className="font-bold text-indigo-700 shrink-0">
                    Kapasitas: {currentPackage.totalQuestions} Soal
                  </span>
                </div>
              )}
            </div>

            {/* 2. Pilih Mata Pelajaran & Status Kuota Sesi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-2">
                <label className="font-heading font-bold text-xs text-[#1F3A5F] block">
                  2. Mata Pelajaran:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'IPA', label: 'IPA' },
                      { id: 'B_INDO', label: 'B. Indonesia' },
                      { id: 'B_INGGRIS', label: 'B. Inggris' },
                      { id: 'MATEMATIKA', label: 'Matematika' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSubject(m.id)}
                      className={`py-2 px-2.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                        subject === m.id
                          ? 'bg-[#1C5FE0] text-white shadow-xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-[#5C6F84]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Kuota Sesi */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-white flex flex-col justify-between space-y-2">
                <div>
                  <span className="font-heading font-bold text-xs text-[#1F3A5F] block">
                    Status Kuota Sesi Terpilih:
                  </span>
                  <p className="text-[11px] text-[#5C6F84] mt-0.5">
                    Sesi {subject}: {sessionStatus.currentCount} dari {sessionStatus.targetCount} soal terisi.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                    <span>Sisa Kuota:</span>
                    <span>{sessionStatus.remaining} Soal</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-indigo-200/60 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((sessionStatus.currentCount / sessionStatus.targetCount) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Materi Bab & Detail Soal */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-white space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-heading font-bold text-xs text-[#1F3A5F] block mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#1C5FE0]" />
                    <span>3. Bab / Materi Pokok:</span>
                  </label>
                  <select
                    value={chapterId}
                    onChange={(e) => setChapterId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-[#1F3A5F]"
                  >
                    {availableChapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.number}: {ch.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-heading font-bold text-xs text-[#1F3A5F] block mb-1">
                    Subtopik Spesifik (Opsional):
                  </label>
                  <input
                    type="text"
                    value={subtopic}
                    onChange={(e) => setSubtopic(e.target.value)}
                    placeholder="Contoh: Hukum Newton II, Barisan Aritmetika..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs text-[#1F3A5F]"
                  />
                </div>
              </div>

              {/* Baris Kedua Detail Soal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-gray-100">
                <div>
                  <label className="font-heading font-bold text-[11px] text-gray-700 block mb-1">
                    Tipe Soal:
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as TkaQuestionType)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white text-xs"
                  >
                    <option value="PG">Pilihan Ganda Biasa (1 Jawaban)</option>
                    <option value="PGK">Pilihan Ganda Kompleks (PGK)</option>
                  </select>
                </div>

                {subject === 'B_INGGRIS' ? (
                  <div>
                    <label className="font-heading font-bold text-[11px] text-gray-700 block mb-1">
                      Skill Bahasa Inggris:
                    </label>
                    <select
                      value={skill}
                      onChange={(e) => setSkill(e.target.value as TkaSkill)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white text-xs"
                    >
                      <option value="GENERAL">General Comprehension</option>
                      <option value="READING">Reading Text</option>
                      <option value="LISTENING">Listening Audio</option>
                      <option value="WRITING">Writing / Grammar</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="font-heading font-bold text-[11px] text-gray-700 block mb-1">
                      Format Rumus:
                    </label>
                    <div className="px-2.5 py-1.5 rounded-xl bg-gray-100 text-[11px] text-gray-600 font-semibold truncate">
                      KaTeX LaTeX $...$ &amp; \text&#123;&#125;
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-heading font-bold text-[11px] text-[#1F3A5F] block mb-1">
                    Jumlah Soal yang Digenerate:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={35}
                      value={generateCount}
                      onChange={(e) => setGenerateCount(Number(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-indigo-300 bg-indigo-50/40 text-xs font-bold text-indigo-950 focus:ring-2 focus:ring-[#1C5FE0]"
                    />
                    <span className="text-[11px] text-gray-500 font-bold shrink-0">Butir</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Penjelasan Batch Internal */}
            <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#1C5FE0] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold">Mekanisme Multi-Batch Gemini:</span> Sistem secara otomatis
                memecah permintaan menjadi sub-batch 8 soal per panggilan untuk mencegah timeout atau
                respon terpotong, menyaring soal duplikat dengan similarity dedup, dan menampilkan pratinjau
                sebelum disimpan.
              </div>
            </div>
          </div>
        )}

        {/* ---------------- STEP 2: GENERATING PROGRESS ---------------- */}
        {workflowStep === 'GENERATING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 space-y-5 text-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1C5FE0] to-indigo-500 flex items-center justify-center text-white shadow-xl animate-pulse">
                <Sparkles className="w-10 h-10 text-amber-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-xs">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h4 className="font-heading font-extrabold text-base text-[#1F3A5F]">
                Sedang Men-generate {generateCount} Soal TKA...
              </h4>
              <p className="text-xs text-[#5C6F84] leading-relaxed">{progressText}</p>
            </div>

            {/* Progress Bar Neumorphic */}
            <div className="w-full max-w-sm space-y-1.5">
              <div className="w-full h-3 rounded-full neu-inset p-0.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-[#1C5FE0] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold px-1">
                <span>Memproses Batch Gemini</span>
                <span>{progressPercent}%</span>
              </div>
            </div>

            <button
              onClick={handleCancelGenerate}
              className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-gray-600 hover:text-rose-600 transition-all cursor-pointer"
            >
              Batalkan Proses
            </button>
          </div>
        )}

        {/* ---------------- STEP 3: PREVIEW SCREEN ---------------- */}
        {workflowStep === 'PREVIEW' && (
          <div className="flex-1 overflow-y-auto pr-1 py-3.5 space-y-3.5 text-xs">
            {/* Header Preview & Controls */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-xs text-[#1F3A5F]">
                    Pratinjau Hasil Generate AI
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                    {previewQuestions.length} Butir Soal Terbentuk
                  </span>
                  {isPartialResult && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200">
                      Sebagian Terpenuhi
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5C6F84]">
                  Periksa setiap soal di bawah ini. Hapus yang dirasa kurang pas sebelum disimpan ke{' '}
                  <span className="font-bold text-[#1F3A5F]">{currentPackage?.title}</span>.
                </p>
              </div>

              {/* Toggle Select All */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="px-3 py-1.5 rounded-xl neu-btn text-xs font-bold text-[#1F3A5F] flex items-center gap-1.5 cursor-pointer"
                >
                  {previewQuestions.every((q) => q.selected) ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-[#1C5FE0]" />
                      <span>Batal Semua</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5 text-gray-500" />
                      <span>Pilih Semua</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Questions List Card Items */}
            <div className="space-y-3">
              {previewQuestions.map((item, idx) => {
                const isSelected = item.selected;
                const isExpanded = item.isExpanded;
                const optLabels = ['A', 'B', 'C', 'D'];

                return (
                  <div
                    key={item.tempId}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'bg-white/90 border-indigo-200 shadow-2xs'
                        : 'bg-gray-100/70 border-gray-200 opacity-60'
                    }`}
                  >
                    {/* Item Header Row */}
                    <div className="p-3 sm:p-3.5 flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleSelectQuestion(item.tempId)}
                          className="mt-0.5 text-gray-400 hover:text-[#1C5FE0] cursor-pointer shrink-0"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#1C5FE0]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          {/* Badges */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#1C5FE0]/10 text-[#1C5FE0]">
                              Soal #{idx + 1}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-200 text-gray-700">
                              {item.questionType === 'PGK' ? 'PGK' : 'PG Biasa'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              Kunci: {String.fromCharCode(65 + item.correctAnswer)}
                            </span>
                          </div>

                          {/* Pertanyaan Singkat */}
                          <div className="text-xs text-[#1F3A5F] font-semibold line-clamp-2">
                            <MathRenderer text={item.question} inline={true} />
                          </div>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleExpandQuestion(item.tempId)}
                          className="p-1.5 rounded-xl hover:bg-gray-200/80 text-gray-600 transition-all cursor-pointer"
                          title={isExpanded ? 'Tutup Detail' : 'Buka Detail Soal & Pembahasan'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePreviewQuestion(item.tempId)}
                          className="p-1.5 rounded-xl hover:bg-rose-100 text-gray-400 hover:text-rose-600 transition-all cursor-pointer"
                          title="Hapus Soal Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail (Soal Lengkap, 4 Opsi, Solusi The King & Konvensional) */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100 space-y-3 animate-fade-in text-xs">
                        {/* Soal Lengkap */}
                        <div className="p-3 rounded-xl bg-gray-50/90 border border-gray-200/80 text-gray-900 leading-relaxed font-medium">
                          <MathRenderer text={item.question} />
                        </div>

                        {/* Listening Script jika ada */}
                        {item.listeningScript && (
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] flex items-start gap-2">
                            <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Listening Audio Script: </span>
                              <span>{item.listeningScript}</span>
                            </div>
                          </div>
                        )}

                        {/* 4 Opsi Jawaban */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.options.map((opt, optIdx) => {
                            const isCorrect = item.correctAnswers
                              ? item.correctAnswers.includes(optIdx)
                              : item.correctAnswer === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded-xl border flex items-start gap-2 ${
                                  isCorrect
                                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                                    : 'bg-white border-gray-200 text-gray-800'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {optLabels[optIdx]}
                                </span>
                                <div className="flex-1 min-w-0 text-xs">
                                  <MathRenderer text={opt} inline={true} />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Solusi The King & Konvensional */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                            <span className="text-[10px] uppercase font-extrabold text-indigo-900 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                              <span>Solusi The King:</span>
                            </span>
                            <div className="text-[11px] text-indigo-950 leading-relaxed font-medium">
                              <MathRenderer text={item.theKingFormula} />
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                            <span className="text-[10px] uppercase font-extrabold text-slate-700">
                              Pembahasan Konsep Konvensional:
                            </span>
                            <div className="text-[11px] text-slate-900 leading-relaxed font-medium">
                              <MathRenderer text={item.conventionalSolution} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-200/90 flex items-center justify-between gap-3 shrink-0">
          {workflowStep === 'CONFIG' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-gray-600 cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleStartGenerate}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-[#1C5FE0] hover:from-indigo-700 hover:to-blue-700 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Mulai Generate {generateCount} Soal AI</span>
              </button>
            </>
          ) : workflowStep === 'PREVIEW' ? (
            <>
              <button
                type="button"
                onClick={() => setWorkflowStep('CONFIG')}
                className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-gray-600 hover:text-[#1F3A5F] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ubah Pengaturan</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToPackage}
                disabled={selectedCount === 0}
                className={`px-5 py-2.5 rounded-xl font-heading font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  selectedCount > 0
                    ? 'bg-[#1C5FE0] hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan {selectedCount} Soal ke Paket</span>
              </button>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <span className="text-[11px] text-gray-500 italic">
                Sedang memproses, mohon tunggu...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
