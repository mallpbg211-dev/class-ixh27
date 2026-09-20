import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Layers,
  BookOpen,
  Crown,
  Save,
  RotateCcw,
  Check,
  RefreshCw,
  Sparkles,
  CheckSquare,
  Square,
  HelpCircle,
  Filter,
  Search,
  FileUp,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import pdfToText from 'react-pdftotext';
import {
  TkaQuestion,
  TkaSubject,
  TkaQuestionType,
  TryOutPackage,
} from './tkaTypes';
import { TKA_CHAPTERS } from './tkaChaptersData';
import {
  loadAllTryOutPackages,
  loadAllQuestions,
  saveCustomQuestionsBatch,
  saveCustomTryOutPackage,
} from './tkaStorage';
import { MathRenderer } from './MathFormulaDisplay';
import { soundManager } from '../../lib/gameAudio';
import { fireConfetti } from '../../utils/confettiHelper';

interface AdminTkaPdfImportModalProps {
  isOpen: boolean;
  initialPackageId?: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

type ConfidenceLevel = 'TINGGI' | 'SEDANG' | 'RENDAH';

interface ParsedPdfValidQuestionItem {
  tempId: string;
  subject: TkaSubject;
  chapterId: string;
  chapterName: string;
  subtopic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswers: number[];
  theKingFormula: string;
  conventionalSolution: string;
  confidence: ConfidenceLevel;
  selected: boolean;
  isExpanded: boolean;
  isEditing?: boolean;
}

// Helper: Dedup kemiripan teks pertanyaan
function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function calculateWordSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(normalizeText(textA));
  const wordsB = new Set(normalizeText(textB));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) intersection++;
  });
  const smallerSize = Math.min(wordsA.size, wordsB.size);
  return intersection / smallerSize;
}

// Helper: Memecah teks panjang menjadi chunk ~8.000 karakter dengan overlap ~400 karakter
function chunkText(text: string, chunkSize = 8000, overlap = 400): string[] {
  if (text.length <= chunkSize) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end >= text.length) break;
    start = end - overlap;
  }
  return chunks;
}

export const AdminTkaPdfImportModal: React.FC<AdminTkaPdfImportModalProps> = ({
  isOpen,
  initialPackageId,
  onClose,
  onSuccess,
}) => {
  // Master Packages & Bank Soal
  const [packages, setPackages] = useState<TryOutPackage[]>([]);
  const [allQuestions, setAllQuestions] = useState<TkaQuestion[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');

  // Target Subject & Chapter Preference (Opsional)
  const [targetSubject, setTargetSubject] = useState<TkaSubject | 'AUTO'>('AUTO');
  const [targetChapterId, setTargetChapterId] = useState<string>('');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parsing Result State
  const [hasParsed, setHasParsed] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedPdfValidQuestionItem[]>([]);
  const [previewFilterSubject, setPreviewFilterSubject] = useState<string>('ALL');
  const [previewFilterConfidence, setPreviewFilterConfidence] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Inline Editing State
  const [editingItem, setEditingItem] = useState<ParsedPdfValidQuestionItem | null>(null);

  // Inisialisasi Paket & State
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

      // Reset parsing state
      setSelectedFile(null);
      setIsProcessing(false);
      setHasParsed(false);
      setParsedQuestions([]);
      setErrorMessage(null);
      setEditingItem(null);
    }
  }, [isOpen, initialPackageId]);

  // Statistik Paket yang Dipilih
  const currentPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId);
  }, [packages, selectedPackageId]);

  const sessionStats = useMemo(() => {
    if (!currentPackage) return [];
    return currentPackage.sessions.map((sess) => {
      const currentCount = (sess.questionIds || []).length;
      return {
        subject: sess.subject,
        title: sess.title,
        currentCount,
        target: sess.targetQuestionCount || 30,
      };
    });
  }, [currentPackage]);

  // --------------------------------------------------------------------------
  // EKSTRAKSI TEKS PDF & PEMANGGILAN AI BERTAHAP
  // --------------------------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPdfFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processPdfFile(file);
    }
  };

  const processPdfFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Hanya berkas berformat .pdf yang didukung.');
      return;
    }

    // Validasi ukuran maksimal (15 MB)
    const MAX_SIZE_MB = 15;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      soundManager.playWrong();
      setErrorMessage(`Ukuran file PDF (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal ${MAX_SIZE_MB} MB. Silakan gunakan file yang lebih ringkas.`);
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setIsProcessing(true);
    setProgressMsg('Membaca dan mengekstrak teks PDF di browser...');

    try {
      soundManager.playClick();
      // Ekstraksi teks PDF client-side
      const extractedText = await pdfToText(file);

      // Cek apakah teks kosong / terlalu pendek (indikasi scan murni tanpa teks digital)
      if (!extractedText || extractedText.trim().length < 50) {
        soundManager.playWrong();
        setIsProcessing(false);
        setErrorMessage(
          'PDF ini sepertinya berupa hasil scan/gambar tanpa teks yang bisa dibaca. Coba gunakan PDF hasil ketik langsung (bukan hasil foto/scan), atau pakai fitur Import Excel sebagai alternatif.'
        );
        return;
      }

      // Potong menjadi chunks jika teks sangat panjang
      const textChunks = chunkText(extractedText.trim(), 8000, 400);
      const totalChunks = textChunks.length;

      const rawAiQuestions: any[] = [];

      for (let i = 0; i < totalChunks; i++) {
        setProgressMsg(
          totalChunks > 1
            ? `Menganalisis potongan teks ${i + 1} dari ${totalChunks} dengan AI...`
            : 'Menganalisis soal dan format rumus KaTeX dengan AI...'
        );

        const chunk = textChunks[i];
        const res = await fetch('/api/tka/parse-questions-from-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawText: chunk,
            subject: targetSubject !== 'AUTO' ? targetSubject : undefined,
            defaultChapterId: targetChapterId || undefined,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server merespon kode ${res.status}`);
        }

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Gagal memproses potongan teks PDF.');
        }

        if (Array.isArray(data.questions)) {
          rawAiQuestions.push(...data.questions);
        }
      }

      if (rawAiQuestions.length === 0) {
        soundManager.playWrong();
        setIsProcessing(false);
        setErrorMessage(
          'AI tidak menemukan butir soal pilihan ganda yang valid dalam dokumen PDF ini. Pastikan PDF memuat teks pertanyaan dan opsi jawaban A-D.'
        );
        return;
      }

      // Deduplikasi & Normalisasi ke Item Soal Valid
      const validItems: ParsedPdfValidQuestionItem[] = [];
      const timestamp = Date.now();

      rawAiQuestions.forEach((item, idx) => {
        const qText = String(item.question || '').trim();
        if (qText.length < 5) return;

        // Cek dedup kemiripan dengan soal yang sudah dikumpulkan
        const isDuplicate = validItems.some((existing) => {
          return calculateWordSimilarity(qText, existing.question) >= 0.75;
        });

        if (isDuplicate) return;

        // Tentukan subject
        let finalSubject: TkaSubject = 'IPA';
        if (targetSubject !== 'AUTO') {
          finalSubject = targetSubject;
        } else if (item.detectedSubject && ['MATEMATIKA', 'IPA', 'B_INDO', 'B_INGGRIS'].includes(item.detectedSubject)) {
          finalSubject = item.detectedSubject as TkaSubject;
        }

        // Tentukan chapter
        const availableChapters = TKA_CHAPTERS.filter((c) => c.subject === finalSubject);
        let matchedChapter = availableChapters[0];
        if (targetChapterId) {
          const found = availableChapters.find((c) => c.id === targetChapterId);
          if (found) matchedChapter = found;
        } else if (item.suggestedChapter) {
          const found = availableChapters.find((c) =>
            c.title.toLowerCase().includes(String(item.suggestedChapter).toLowerCase())
          );
          if (found) matchedChapter = found;
        }

        const confidenceVal: ConfidenceLevel = ['TINGGI', 'SEDANG', 'RENDAH'].includes(item.confidence)
          ? item.confidence
          : 'SEDANG';

        validItems.push({
          tempId: `PDF_${finalSubject}_${timestamp}_${idx + 1}`,
          subject: finalSubject,
          chapterId: matchedChapter ? matchedChapter.id : `${finalSubject}_BAB_1`,
          chapterName: matchedChapter ? matchedChapter.title : 'Materi Pembelajaran TKA',
          subtopic: item.suggestedChapter || matchedChapter?.title || 'Latihan Soal Ujian',
          question: qText,
          options: Array.isArray(item.options) && item.options.length >= 4 ? item.options.slice(0, 4) : ['A', 'B', 'C', 'D'],
          correctAnswer: typeof item.correctAnswer === 'number' ? item.correctAnswer : 0,
          correctAnswers: Array.isArray(item.correctAnswers) && item.correctAnswers.length > 0 ? item.correctAnswers : [item.correctAnswer || 0],
          theKingFormula: item.theKingFormula || 'Gunakan penalaran konsep dasar The King.',
          conventionalSolution: item.conventionalSolution || 'Pembahasan telah diverifikasi oleh AI.',
          confidence: confidenceVal,
          selected: true,
          isExpanded: confidenceVal === 'RENDAH', // Otomatis expand yang butuh perhatian
          isEditing: false,
        });
      });

      // Urutkan: RENDAH paling atas, lalu SEDANG, lalu TINGGI paling bawah
      validItems.sort((a, b) => {
        const orderMap: Record<ConfidenceLevel, number> = {
          RENDAH: 0,
          SEDANG: 1,
          TINGGI: 2,
        };
        return orderMap[a.confidence] - orderMap[b.confidence];
      });

      setParsedQuestions(validItems);
      setHasParsed(true);
      setIsProcessing(false);
      soundManager.playCorrect();
    } catch (err: any) {
      console.error('Error saat proses PDF:', err);
      soundManager.playWrong();
      setIsProcessing(false);
      setErrorMessage(
        err.message || 'Terjadi kesalahan saat mengekstrak dan memproses dokumen PDF. Silakan coba kembali.'
      );
    }
  };

  // --------------------------------------------------------------------------
  // AKSI PREVIEW: TOGGLE, SELECT ALL, EDIT, DELETE
  // --------------------------------------------------------------------------
  const handleToggleSelect = (tempId: string) => {
    soundManager.playClick();
    setParsedQuestions((prev) =>
      prev.map((q) => (q.tempId === tempId ? { ...q, selected: !q.selected } : q))
    );
  };

  const handleSelectAll = (select: boolean) => {
    soundManager.playClick();
    setParsedQuestions((prev) => prev.map((q) => ({ ...q, selected: select })));
  };

  const handleToggleExpand = (tempId: string) => {
    soundManager.playClick();
    setParsedQuestions((prev) =>
      prev.map((q) => (q.tempId === tempId ? { ...q, isExpanded: !q.isExpanded } : q))
    );
  };

  const handleDeleteItem = (tempId: string) => {
    soundManager.playClick();
    setParsedQuestions((prev) => prev.filter((q) => q.tempId !== tempId));
  };

  const handleStartInlineEdit = (item: ParsedPdfValidQuestionItem) => {
    soundManager.playClick();
    setEditingItem({ ...item });
  };

  const handleSaveInlineEdit = () => {
    if (!editingItem) return;
    if (!editingItem.question.trim()) {
      alert('Pertanyaan tidak boleh kosong!');
      return;
    }
    if (editingItem.options.some((opt) => !opt.trim())) {
      alert('Semua 4 opsi jawaban (A, B, C, D) harus terisi!');
      return;
    }

    soundManager.playCorrect();
    setParsedQuestions((prev) =>
      prev.map((q) => (q.tempId === editingItem.tempId ? { ...editingItem, isEditing: false } : q))
    );
    setEditingItem(null);
  };

  // Filtered Questions di Layar Preview
  const filteredPreviewQuestions = useMemo(() => {
    return parsedQuestions.filter((q) => {
      if (previewFilterSubject !== 'ALL' && q.subject !== previewFilterSubject) {
        return false;
      }
      if (previewFilterConfidence !== 'ALL' && q.confidence !== previewFilterConfidence) {
        return false;
      }
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchQ = q.question.toLowerCase().includes(query);
        const matchOpts = q.options.some((o) => o.toLowerCase().includes(query));
        const matchCh = q.chapterName.toLowerCase().includes(query);
        if (!matchQ && !matchOpts && !matchCh) return false;
      }
      return true;
    });
  }, [parsedQuestions, previewFilterSubject, previewFilterConfidence, searchFilter]);

  const selectedValidQuestions = useMemo(() => {
    return parsedQuestions.filter((q) => q.selected);
  }, [parsedQuestions]);

  const confidenceCounts = useMemo(() => {
    const counts = { RENDAH: 0, SEDANG: 0, TINGGI: 0 };
    parsedQuestions.forEach((q) => {
      counts[q.confidence]++;
    });
    return counts;
  }, [parsedQuestions]);

  // --------------------------------------------------------------------------
  // SIMPAN FINAL KE BANK SOAL & ASSIGN KE PAKET TOBK
  // --------------------------------------------------------------------------
  const handleCommitImport = () => {
    if (selectedValidQuestions.length === 0) {
      alert('Pilih setidaknya 1 soal yang valid untuk diimpor.');
      return;
    }

    try {
      soundManager.playCorrect();

      const questionsToSave: TkaQuestion[] = selectedValidQuestions.map((item) => {
        return {
          id: item.tempId,
          subject: item.subject,
          chapterId: item.chapterId,
          chapterName: item.chapterName,
          subtopic: item.subtopic,
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
          correctAnswers: item.correctAnswers,
          theKingFormula: item.theKingFormula,
          conventionalSolution: item.conventionalSolution,
          questionType: 'PG' as TkaQuestionType,
          source: 'AI',
          packageId: selectedPackageId || undefined,
        };
      });

      // 1. Simpan ke Bank Soal
      saveCustomQuestionsBatch(questionsToSave);

      // 2. Jika ada paket tujuan yang dipilih, tautkan ke sesi paket
      if (selectedPackageId) {
        const pkgs = loadAllTryOutPackages();
        const pkgIndex = pkgs.findIndex((p) => p.id === selectedPackageId);
        if (pkgIndex >= 0) {
          const targetPkg = { ...pkgs[pkgIndex] };
          targetPkg.sessions = targetPkg.sessions.map((sess) => {
            const matchingNewIds = questionsToSave
              .filter((q) => q.subject === sess.subject)
              .map((q) => q.id);

            if (matchingNewIds.length > 0) {
              const existingIds = sess.questionIds || [];
              const combinedIds = Array.from(new Set([...existingIds, ...matchingNewIds]));
              return {
                ...sess,
                questionIds: combinedIds,
              };
            }
            return sess;
          });

          saveCustomTryOutPackage(targetPkg);
        }
      }

      fireConfetti({ particleCount: 50 });
      const pkgTitle = currentPackage ? currentPackage.title : 'Bank Soal';
      onSuccess(
        `Berhasil mengimpor ${questionsToSave.length} butir soal dari PDF ke "${pkgTitle}"!`
      );
      onClose();
    } catch (err: any) {
      console.error('Gagal menyimpan hasil import PDF:', err);
      alert('Gagal menyimpan soal: ' + (err?.message || String(err)));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="neu-flat rounded-3xl bg-[#E7EBF5] border border-white/90 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* ================= HEADER ================= */}
        <div className="p-4 sm:p-5 border-b border-white/80 flex items-center justify-between gap-3 shrink-0 bg-[#E7EBF5]/95">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md">
              <FileText className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1F3A5F] flex items-center gap-2">
                <span>Import Soal TOBK dari PDF</span>
                <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 text-[10px] font-extrabold tracking-wider uppercase border border-rose-200/80">
                  AI Extractor &amp; KaTeX
                </span>
              </h3>
              <p className="text-xs text-[#5C6F84]">
                Ekstraksi otomatis teks dokumen PDF, susun ke format standar TOBK, dan review sebelum disimpan.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/70 hover:bg-white text-gray-500 hover:text-gray-800 shadow-2xs cursor-pointer transition-all shrink-0"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= BODY CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* STEP 1: UPLOAD BOX & PREFERENCES (Hanya muncul jika belum parsed atau ingin reset) */}
          {!hasParsed && (
            <div className="space-y-4">
              {/* Petunjuk & Preferensi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#DFE5F2] border border-white/60 text-xs">
                <div>
                  <label className="font-heading font-bold text-[#1F3A5F] block mb-1">
                    Mata Pelajaran Dokumen (Opsional):
                  </label>
                  <select
                    value={targetSubject}
                    onChange={(e) => {
                      const val = e.target.value as TkaSubject | 'AUTO';
                      setTargetSubject(val);
                      if (val !== 'AUTO') {
                        const firstCh = TKA_CHAPTERS.find((c) => c.subject === val);
                        setTargetChapterId(firstCh ? firstCh.id : '');
                      } else {
                        setTargetChapterId('');
                      }
                    }}
                    className="neu-pressed w-full px-3 py-2 rounded-xl text-xs font-bold text-[#1F3A5F] bg-white/80 border border-white/80 focus:outline-none focus:ring-2 focus:ring-[#1C5FE0]"
                  >
                    <option value="AUTO">-- Deteksi Otomatis oleh AI --</option>
                    <option value="MATEMATIKA">Matematika</option>
                    <option value="IPA">IPA (Fisika, Biologi, Kimia)</option>
                    <option value="B_INDO">Bahasa Indonesia</option>
                    <option value="B_INGGRIS">Bahasa Inggris</option>
                  </select>
                </div>

                <div>
                  <label className="font-heading font-bold text-[#1F3A5F] block mb-1">
                    Bab / Topik Default (Opsional):
                  </label>
                  <select
                    value={targetChapterId}
                    onChange={(e) => setTargetChapterId(e.target.value)}
                    disabled={targetSubject === 'AUTO'}
                    className="neu-pressed w-full px-3 py-2 rounded-xl text-xs font-bold text-[#1F3A5F] bg-white/80 border border-white/80 focus:outline-none focus:ring-2 focus:ring-[#1C5FE0] disabled:opacity-50"
                  >
                    <option value="">-- Sesuaikan Otomatis Per Soal --</option>
                    {targetSubject !== 'AUTO' &&
                      TKA_CHAPTERS.filter((c) => c.subject === targetSubject).map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.number}: {ch.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                className={`neu-pressed rounded-3xl p-6 sm:p-8 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[180px] ${
                  isDragging
                    ? 'border-rose-500 bg-rose-50/80 scale-[0.99]'
                    : isProcessing
                    ? 'border-blue-400 bg-blue-50/40 cursor-wait'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/50'
                    : 'border-gray-300 hover:border-rose-500 bg-[#DFE5F2]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-3 max-w-md">
                  <div
                    className={`p-3.5 rounded-2xl ${
                      isProcessing
                        ? 'bg-blue-600 text-white animate-spin'
                        : selectedFile
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-rose-600 shadow-sm'
                    }`}
                  >
                    {isProcessing ? <RefreshCw className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                  </div>

                  <div>
                    <span className="text-sm font-heading font-extrabold text-[#1F3A5F] block">
                      {isProcessing
                        ? 'Sedang Memproses Berkas PDF...'
                        : selectedFile
                        ? selectedFile.name
                        : 'Pilih atau Seret Berkas PDF Soal ke Sini'}
                    </span>
                    <p className="text-xs text-[#5C6F84] mt-1">
                      {isProcessing
                        ? progressMsg
                        : selectedFile
                        ? `Ukuran: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB — Klik untuk ganti file`
                        : 'Mendukung format .pdf hingga 15 MB (Pastikan dokumen memiliki teks digital, bukan hasil scan/foto)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Processing Box */}
              {isProcessing && (
                <div className="neu-flat rounded-2xl p-4 bg-blue-50/90 border border-blue-200 text-center space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-sm font-heading font-bold text-[#1C5FE0]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#1C5FE0]" />
                    <span>{progressMsg}</span>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    AI sedang menyaring header/footer, memformat notasi LaTeX $...$, dan menganalisis kunci jawaban.
                  </p>
                </div>
              )}

              {/* Error Message Box */}
              {errorMessage && (
                <div className="neu-flat rounded-2xl p-4 bg-rose-50 border border-rose-300 text-rose-900 space-y-2 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-heading font-bold text-rose-950">Gagal Membaca Dokumen PDF</p>
                      <p className="leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PREVIEW & VERIFICATION SCREEN (SETELAH PARSING) */}
          {hasParsed && (
            <div className="space-y-4 animate-fade-in">
              {/* TARGET PACKAGE SELECTOR */}
              <div className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-heading font-bold text-[#1F3A5F] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Pilih Paket TOBK Tujuan:</span>
                  </label>

                  <select
                    value={selectedPackageId}
                    onChange={(e) => {
                      soundManager.playClick();
                      setSelectedPackageId(e.target.value);
                    }}
                    className="neu-pressed rounded-xl px-3 py-2 text-xs font-heading font-bold text-[#1F3A5F] bg-[#DFE5F2] border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#1C5FE0] w-full sm:w-80 cursor-pointer"
                  >
                    <option value="">-- Simpan ke Bank Soal Saja (Tanpa Paket) --</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title} ({pkg.tag})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sesi & Kuota Info */}
                {currentPackage && (
                  <div className="pt-2 border-t border-white/60 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {sessionStats.map((sess) => (
                      <div
                        key={sess.subject}
                        className="p-2 rounded-xl bg-white/70 border border-gray-200/80 text-[11px] space-y-0.5"
                      >
                        <span className="font-bold text-[#1F3A5F] block truncate">{sess.title}</span>
                        <div className="flex items-center justify-between text-[#5C6F84]">
                          <span>Saat ini:</span>
                          <span
                            className={`font-black ${
                              sess.currentCount >= sess.target
                                ? 'text-emerald-700'
                                : 'text-[#1C5FE0]'
                            }`}
                          >
                            {sess.currentCount}/{sess.target}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* STATS & SUMMARY BAR */}
              <div className="neu-flat rounded-2xl p-3 sm:p-4 bg-white/70 border border-white/90 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-extrabold text-[#1F3A5F] text-xs">
                    Hasil Ekstraksi: {parsedQuestions.length} Soal
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                    {confidenceCounts.RENDAH > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        {confidenceCounts.RENDAH} Perlu Dicek Ulang
                      </span>
                    )}
                    {confidenceCounts.SEDANG > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-300 font-bold flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-slate-500" />
                        {confidenceCounts.SEDANG} Cek Sekilas
                      </span>
                    )}
                    {confidenceCounts.TINGGI > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {confidenceCounts.TINGGI} Akurat
                      </span>
                    )}
                  </div>
                </div>

                {/* Reset File Button */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setHasParsed(false);
                    setSelectedFile(null);
                    setParsedQuestions([]);
                  }}
                  className="text-xs font-heading font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Unggah PDF Lain</span>
                </button>
              </div>

              {/* CONTROLS BAR: SEARCH, FILTER, SELECT ALL */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                  <div className="neu-pressed rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 bg-[#DFE5F2] border border-white/60 text-xs w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Cari teks soal / opsi..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="bg-transparent text-xs text-[#1F3A5F] placeholder-gray-400 focus:outline-none w-full"
                    />
                  </div>

                  <select
                    value={previewFilterSubject}
                    onChange={(e) => setPreviewFilterSubject(e.target.value)}
                    className="neu-pressed rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1F3A5F] bg-[#DFE5F2] border border-white/60 focus:outline-none"
                  >
                    <option value="ALL">Semua Mapel</option>
                    <option value="MATEMATIKA">Matematika</option>
                    <option value="IPA">IPA</option>
                    <option value="B_INDO">B. Indonesia</option>
                    <option value="B_INGGRIS">B. Inggris</option>
                  </select>

                  <select
                    value={previewFilterConfidence}
                    onChange={(e) => setPreviewFilterConfidence(e.target.value)}
                    className="neu-pressed rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1F3A5F] bg-[#DFE5F2] border border-white/60 focus:outline-none"
                  >
                    <option value="ALL">Semua Tingkat Keyakinan</option>
                    <option value="RENDAH">⚠️ Perlu Dicek Ulang (Rendah)</option>
                    <option value="SEDANG">🔍 Cek Sekilas (Sedang)</option>
                    <option value="TINGGI">✅ Akurat (Tinggi)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleSelectAll(true)}
                    className="text-xs font-bold text-[#1C5FE0] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Pilih Semua</span>
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handleSelectAll(false)}
                    className="text-xs font-bold text-gray-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Batal Semua</span>
                  </button>
                </div>
              </div>

              {/* LIST OF PARSED QUESTIONS */}
              <div className="space-y-3">
                {filteredPreviewQuestions.length === 0 ? (
                  <div className="p-8 text-center neu-pressed rounded-2xl bg-[#DFE5F2] border border-white/60 text-gray-500 text-xs">
                    Tidak ada butir soal yang cocok dengan filter pencarian.
                  </div>
                ) : (
                  filteredPreviewQuestions.map((item, idx) => {
                    const isSelected = item.selected;
                    const isExpanded = item.isExpanded;
                    const keys = item.correctAnswers || [item.correctAnswer];

                    return (
                      <div
                        key={item.tempId}
                        className={`neu-flat rounded-2xl p-4 transition-all border ${
                          isSelected
                            ? item.confidence === 'RENDAH'
                              ? 'bg-amber-50/70 border-amber-300'
                              : 'bg-[#E7EBF5] border-white/90'
                            : 'bg-gray-100/70 border-gray-200 opacity-60'
                        }`}
                      >
                        {/* Header Kartu Soal */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleToggleSelect(item.tempId)}
                              className="mt-0.5 text-[#1C5FE0] cursor-pointer hover:scale-110 transition-transform"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#1C5FE0]" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </button>

                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-heading font-black text-xs text-[#1F3A5F]">
                                  #{idx + 1}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[10px] border border-indigo-200">
                                  {item.subject}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold text-[10px] border border-blue-200 truncate max-w-[200px]">
                                  {item.chapterName}
                                </span>

                                {/* Confidence Badge */}
                                {item.confidence === 'RENDAH' && (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold flex items-center gap-1 shadow-2xs">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>⚠️ Perlu dicek ulang</span>
                                  </span>
                                )}
                                {item.confidence === 'SEDANG' && (
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-extrabold flex items-center gap-1">
                                    <HelpCircle className="w-3 h-3 text-slate-500" />
                                    <span>Cek sekilas</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartInlineEdit(item)}
                              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-[#1C5FE0] border border-blue-100 shadow-2xs cursor-pointer transition-all"
                              title="Edit Soal Ini"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.tempId)}
                              className="p-1.5 rounded-lg bg-white/80 hover:bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs cursor-pointer transition-all"
                              title="Hapus Soal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleExpand(item.tempId)}
                              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-gray-600 border border-gray-200 shadow-2xs cursor-pointer transition-all"
                              title={isExpanded ? 'Sembunyikan Solusi' : 'Tampilkan Solusi'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Teks Pertanyaan (KaTeX Support) */}
                        <div className="mt-2.5 text-xs text-gray-900 font-medium leading-relaxed pl-6.5">
                          <MathRenderer content={item.question} />
                        </div>

                        {/* Opsi Jawaban (A-D) */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6.5">
                          {item.options.map((opt, optIdx) => {
                            const isCorrect = keys.includes(optIdx);
                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded-xl text-xs flex items-start gap-2 border transition-colors ${
                                  isCorrect
                                    ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                                    : 'bg-white/70 border-gray-200 text-gray-700'
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-gray-300 text-gray-700'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <div className="flex-1 overflow-x-auto">
                                  <MathRenderer content={opt} />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Expandable: The King Formula & Conventional Solution */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-gray-200/80 pl-6.5 space-y-2 animate-fade-in">
                            <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] space-y-1">
                              <span className="font-extrabold text-amber-900 flex items-center gap-1">
                                <Crown className="w-3.5 h-3.5 text-amber-600" />
                                <span>Solusi Kilat The King:</span>
                              </span>
                              <div className="text-amber-800 pl-4.5">
                                <MathRenderer content={item.theKingFormula} />
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200 text-[11px] space-y-1">
                              <span className="font-extrabold text-blue-900 flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-[#1C5FE0]" />
                                <span>Pembahasan Konvensional:</span>
                              </span>
                              <div className="text-blue-800 pl-4.5">
                                <MathRenderer content={item.conventionalSolution} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-white/80 flex items-center justify-between gap-3 shrink-0 bg-[#E7EBF5]/95">
          <div className="text-xs text-[#5C6F84]">
            {hasParsed ? (
              <span>
                <strong className="text-emerald-700 font-black font-heading">
                  {selectedValidQuestions.length}
                </strong>{' '}
                dari {parsedQuestions.length} soal terpilih untuk diimpor
              </span>
            ) : (
              <span>Unggah berkas PDF di atas untuk mengekstrak dan menelaah butir soal.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-heading font-bold shadow-2xs cursor-pointer transition-all"
            >
              Batal
            </button>

            {hasParsed && (
              <button
                type="button"
                disabled={selectedValidQuestions.length === 0}
                onClick={handleCommitImport}
                className={`px-5 py-2.5 rounded-xl text-xs font-heading font-extrabold flex items-center gap-2 shadow-md transition-all ${
                  selectedValidQuestions.length > 0
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white cursor-pointer active:scale-98'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>
                  Impor {selectedValidQuestions.length} Soal ke{' '}
                  {currentPackage ? 'Paket' : 'Bank Soal'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= INLINE EDIT MODAL ================= */}
      {editingItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="neu-flat rounded-3xl bg-[#E7EBF5] border border-white/90 max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/80 flex items-center justify-between gap-3 bg-[#E7EBF5]">
              <h4 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#1C5FE0]" />
                <span>Edit Butir Soal PDF</span>
              </h4>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Mapel & Bab */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Mata Pelajaran:
                  </label>
                  <select
                    value={editingItem.subject}
                    onChange={(e) => {
                      const s = e.target.value as TkaSubject;
                      const firstCh = TKA_CHAPTERS.find((c) => c.subject === s);
                      setEditingItem({
                        ...editingItem,
                        subject: s,
                        chapterId: firstCh ? firstCh.id : `${s}_BAB_1`,
                        chapterName: firstCh ? firstCh.title : 'Materi Pembelajaran',
                      });
                    }}
                    className="neu-pressed w-full px-3 py-1.5 rounded-xl text-xs font-bold text-[#1F3A5F] bg-white border border-white/80"
                  >
                    <option value="MATEMATIKA">Matematika</option>
                    <option value="IPA">IPA</option>
                    <option value="B_INDO">B. Indonesia</option>
                    <option value="B_INGGRIS">B. Inggris</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Bab / Topik:
                  </label>
                  <select
                    value={editingItem.chapterId}
                    onChange={(e) => {
                      const chId = e.target.value;
                      const ch = TKA_CHAPTERS.find((c) => c.id === chId);
                      setEditingItem({
                        ...editingItem,
                        chapterId: chId,
                        chapterName: ch ? ch.title : editingItem.chapterName,
                      });
                    }}
                    className="neu-pressed w-full px-3 py-1.5 rounded-xl text-xs font-bold text-[#1F3A5F] bg-white border border-white/80"
                  >
                    {TKA_CHAPTERS.filter((c) => c.subject === editingItem.subject).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.number}: {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Teks Pertanyaan */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Teks Pertanyaan (Gunakan KaTeX $...$ untuk rumus):
                </label>
                <textarea
                  rows={3}
                  value={editingItem.question}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  className="neu-pressed w-full p-2.5 rounded-xl text-xs text-[#1F3A5F] bg-white border border-white/80 focus:outline-none focus:ring-2 focus:ring-[#1C5FE0]"
                />
              </div>

              {/* 4 Opsi Jawaban */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Pilihan Jawaban &amp; Kunci Jawaban:
                </label>
                {editingItem.options.map((opt, oIdx) => {
                  const isCorrect = editingItem.correctAnswer === oIdx;
                  return (
                    <div key={oIdx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingItem({
                            ...editingItem,
                            correctAnswer: oIdx,
                            correctAnswers: [oIdx],
                          })
                        }
                        className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                          isCorrect
                            ? 'bg-emerald-600 text-white shadow-xs scale-105'
                            : 'bg-gray-200 text-gray-700 hover:bg-emerald-100'
                        }`}
                        title="Klik untuk jadikan kunci jawaban"
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...editingItem.options];
                          newOpts[oIdx] = e.target.value;
                          setEditingItem({ ...editingItem, options: newOpts });
                        }}
                        placeholder={`Teks opsi ${String.fromCharCode(65 + oIdx)}`}
                        className="neu-pressed flex-1 px-3 py-1.5 rounded-xl text-xs text-[#1F3A5F] bg-white border border-white/80 focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Rumus The King */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Solusi Kilat The King:
                </label>
                <input
                  type="text"
                  value={editingItem.theKingFormula}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, theKingFormula: e.target.value })
                  }
                  className="neu-pressed w-full px-3 py-1.5 rounded-xl text-xs text-[#1F3A5F] bg-white border border-white/80 focus:outline-none"
                />
              </div>

              {/* Pembahasan Konvensional */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Pembahasan Konvensional:
                </label>
                <textarea
                  rows={2}
                  value={editingItem.conventionalSolution}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, conventionalSolution: e.target.value })
                  }
                  className="neu-pressed w-full p-2.5 rounded-xl text-xs text-[#1F3A5F] bg-white border border-white/80 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 border-t border-white/80 flex items-center justify-end gap-2 bg-[#E7EBF5]">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white text-gray-700 text-xs font-heading font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveInlineEdit}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
