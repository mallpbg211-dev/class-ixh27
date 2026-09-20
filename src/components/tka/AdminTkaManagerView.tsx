import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Crown,
  HelpCircle,
  FileText,
  Copy,
  CheckSquare,
  Eye,
  Check,
  X,
  FileUp,
  Loader2,
  Layers,
  Package,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { TkaQuestion, TkaSubject, TkaQuestionType, TkaSkill, TryOutPackage } from './tkaTypes';
import { TKA_CHAPTERS } from './tkaChaptersData';
import {
  loadAllQuestions,
  saveAllQuestions,
  saveCustomQuestion,
  saveCustomQuestionsBatch,
  deleteTkaQuestion,
  updateTkaQuestion,
  resetTkaQuestionsToDefault,
  loadAllTryOutPackages,
  saveCustomTryOutPackage,
  deleteCustomTryOutPackage,
  TRY_OUT_PACKAGES,
} from './tkaStorage';
import { AdminTkaBatchGenerateModal } from './AdminTkaBatchGenerateModal';
import { AdminTkaExcelImportModal } from './AdminTkaExcelImportModal';
import { AdminTkaPdfImportModal } from './AdminTkaPdfImportModal';
import { saveExcelWorkbook } from '../../utils/fileDownloader';
import { soundManager } from '../../lib/gameAudio';
import { fireConfetti } from '../../utils/confettiHelper';
import { extractTextFromPdf } from '../../utils/pdfHelper';

interface AdminTkaManagerViewProps {
  onLogActivity?: (action: string, details: string, category?: string) => void;
}

type SubTab = 'LIST' | 'PDF_UPLOAD' | 'SMART_TEXT' | 'EXCEL_UPLOAD' | 'PACKAGES';

export const AdminTkaManagerView: React.FC<AdminTkaManagerViewProps> = ({ onLogActivity }) => {
  const [questions, setQuestions] = useState<TkaQuestion[]>([]);
  const [packages, setPackages] = useState<TryOutPackage[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedPackageFilter, setSelectedPackageFilter] = useState<string>('ALL');

  // New Package Modal State
  const [isCreatePkgModalOpen, setIsCreatePkgModalOpen] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgTag, setNewPkgTag] = useState('');
  const [newPkgDesc, setNewPkgDesc] = useState('');

  // Batch AI Generator Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchTargetPkgId, setBatchTargetPkgId] = useState<string | undefined>(undefined);

  const handleOpenBatchGenerate = (pkgId?: string) => {
    setBatchTargetPkgId(pkgId);
    setIsBatchModalOpen(true);
  };

  // Excel Import Modal State
  const [isExcelImportModalOpen, setIsExcelImportModalOpen] = useState(false);
  const [excelImportTargetPkgId, setExcelImportTargetPkgId] = useState<string | undefined>(undefined);

  const handleOpenExcelImport = (pkgId?: string) => {
    setExcelImportTargetPkgId(pkgId);
    setIsExcelImportModalOpen(true);
  };

  // PDF Import Modal State (Fase 4: KaTeX + AI Confidence)
  const [isPdfImportModalOpen, setIsPdfImportModalOpen] = useState(false);
  const [pdfImportTargetPkgId, setPdfImportTargetPkgId] = useState<string | undefined>(undefined);

  const handleOpenPdfImport = (pkgId?: string) => {
    setPdfImportTargetPkgId(pkgId);
    setIsPdfImportModalOpen(true);
  };

  // Edit / Create Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TkaQuestion | null>(null);

  // Form State for Create / Edit
  const [formSubject, setFormSubject] = useState<TkaSubject>('IPA');
  const [formChapterId, setFormChapterId] = useState<string>('IPA_BAB_1');
  const [formChapterName, setFormChapterName] = useState('');
  const [formSubtopic, setFormSubtopic] = useState('');
  const [formPackageId, setFormPackageId] = useState<string>('');
  const [formType, setFormType] = useState<TkaQuestionType>('PG');
  const [formPassage, setFormPassage] = useState('');
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectSingle, setFormCorrectSingle] = useState<number>(0);
  const [formCorrectMulti, setFormCorrectMulti] = useState<number[]>([0]);
  const [formTheKing, setFormTheKing] = useState('');
  const [formConventional, setFormConventional] = useState('');
  const [formListeningScript, setFormListeningScript] = useState('');

  // Smart Text Import State
  const [smartQuestionsText, setSmartQuestionsText] = useState('');
  const [smartKeysText, setSmartKeysText] = useState('');
  const [smartDefaultSubject, setSmartDefaultSubject] = useState<TkaSubject>('B_INDO');
  const [smartDefaultChapter, setSmartDefaultChapter] = useState<string>('B_INDO_BAB_1');
  const [parsedPreview, setParsedPreview] = useState<TkaQuestion[]>([]);
  const [smartParseError, setSmartParseError] = useState<string | null>(null);
  const smartPdfInputRef = useRef<HTMLInputElement>(null);

  // PDF Upload State
  const [pdfSoalFile, setPdfSoalFile] = useState<File | null>(null);
  const [pdfKeysFile, setPdfKeysFile] = useState<File | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfExtractedText, setPdfExtractedText] = useState('');
  const [pdfKeysText, setPdfKeysText] = useState('');
  const [pdfDefaultSubject, setPdfDefaultSubject] = useState<TkaSubject>('IPA');
  const [pdfDefaultChapter, setPdfDefaultChapter] = useState<string>('IPA_BAB_1');
  const [pdfParsedPreview, setPdfParsedPreview] = useState<TkaQuestion[]>([]);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfStatusMsg, setPdfStatusMsg] = useState<string | null>(null);
  const [isPdfTextExpanded, setIsPdfTextExpanded] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const pdfKeysInputRef = useRef<HTMLInputElement>(null);

  // Excel Upload State
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelKeysFile, setExcelKeysFile] = useState<File | null>(null);
  const [excelParsedPreview, setExcelParsedPreview] = useState<TkaQuestion[]>([]);
  const [excelStatusMsg, setExcelStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const keysFileInputRef = useRef<HTMLInputElement>(null);

  // Success Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Load questions and packages on mount
  useEffect(() => {
    refreshQuestions();
    refreshPackages();
  }, []);

  const refreshQuestions = () => {
    const loaded = loadAllQuestions();
    setQuestions(loaded);
  };

  const refreshPackages = () => {
    setPackages(loadAllTryOutPackages());
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedSubjectFilter !== 'ALL' && q.subject !== selectedSubjectFilter) {
        return false;
      }
      if (selectedTypeFilter !== 'ALL') {
        const qType = q.questionType || 'PG';
        if (qType !== selectedTypeFilter) return false;
      }
      if (selectedPackageFilter !== 'ALL') {
        if (selectedPackageFilter === 'UNASSIGNED') {
          if (q.packageId) return false;
        } else if (q.packageId !== selectedPackageFilter) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = q.question.toLowerCase().includes(query);
        const matchChapter = (q.chapterName || '').toLowerCase().includes(query);
        const matchPassage = (q.passage || '').toLowerCase().includes(query);
        const matchTheKing = (q.theKingFormula || '').toLowerCase().includes(query);
        if (!matchText && !matchChapter && !matchPassage && !matchTheKing) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedSubjectFilter, selectedTypeFilter, selectedPackageFilter, searchQuery]);

  // Counts & Stats
  const stats = useMemo(() => {
    const total = questions.length;
    const pgCount = questions.filter((q) => (q.questionType || 'PG') === 'PG').length;
    const pgkCount = questions.filter((q) => q.questionType === 'PGK').length;
    const ipaCount = questions.filter((q) => q.subject === 'IPA').length;
    const bindoCount = questions.filter((q) => q.subject === 'B_INDO').length;
    const bingCount = questions.filter((q) => q.subject === 'B_INGGRIS').length;
    const mtkCount = questions.filter((q) => q.subject === 'MATEMATIKA').length;
    return { total, pgCount, pgkCount, ipaCount, bindoCount, bingCount, mtkCount };
  }, [questions]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormSubject('IPA');
    const firstCh = TKA_CHAPTERS.find((c) => c.subject === 'IPA');
    setFormChapterId(firstCh?.id || 'IPA_BAB_1');
    setFormChapterName(firstCh ? `${firstCh.number}: ${firstCh.title}` : 'Bab IPA');
    setFormSubtopic('');
    setFormPackageId('');
    setFormType('PG');
    setFormPassage('');
    setFormQuestion('');
    setFormOptions(['', '', '', '']);
    setFormCorrectSingle(0);
    setFormCorrectMulti([0]);
    setFormTheKing('');
    setFormConventional('');
    setFormListeningScript('');
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (q: TkaQuestion) => {
    setEditingQuestion(q);
    setFormSubject(q.subject);
    setFormChapterId(q.chapterId || '');
    setFormChapterName(q.chapterName || '');
    setFormSubtopic(q.subtopic || '');
    setFormPackageId(q.packageId || '');
    setFormType(q.questionType || 'PG');
    setFormPassage(q.passage || '');
    setFormQuestion(q.question);
    setFormOptions(q.options.length >= 4 ? [...q.options] : [...q.options, '', '', ''].slice(0, 4));
    setFormCorrectSingle(q.correctAnswer ?? 0);
    setFormCorrectMulti(q.correctAnswers && q.correctAnswers.length > 0 ? [...q.correctAnswers] : [q.correctAnswer ?? 0]);
    setFormTheKing(q.theKingFormula || '');
    setFormConventional(q.conventionalSolution || '');
    setFormListeningScript(q.listeningScript || '');
    setIsEditModalOpen(true);
  };

  // Save Modal Form (Create or Update)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      alert('Pertanyaan tidak boleh kosong!');
      return;
    }
    if (formOptions.some((opt) => !opt.trim())) {
      alert('Semua 4 pilihan jawaban (A, B, C, D) harus diisi!');
      return;
    }
    if (formType === 'PGK' && formCorrectMulti.length === 0) {
      alert('Untuk Pilihan Ganda Kompleks (PGK), minimal pilih 1 kunci jawaban yang benar!');
      return;
    }

    const selectedCh = TKA_CHAPTERS.find((c) => c.id === formChapterId);
    const resolvedChapterName = formChapterName.trim() || (selectedCh ? `${selectedCh.number}: ${selectedCh.title}` : 'Umum');

    const cleanQuestion: TkaQuestion = {
      id: editingQuestion ? editingQuestion.id : `CUSTOM_Q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      subject: formSubject,
      chapterId: formChapterId,
      chapterName: resolvedChapterName,
      packageId: formPackageId.trim() || undefined,
      subtopic: formSubtopic.trim() || undefined,
      passage: formPassage.trim() || undefined,
      question: formQuestion.trim(),
      options: formOptions.map((o) => o.trim()),
      questionType: formType,
      correctAnswer: formType === 'PG' ? formCorrectSingle : formCorrectMulti[0] ?? 0,
      correctAnswers: formType === 'PGK' ? [...formCorrectMulti].sort((a, b) => a - b) : [formCorrectSingle],
      theKingFormula: formTheKing.trim() || undefined,
      conventionalSolution: formConventional.trim() || undefined,
      listeningScript: formSubject === 'B_INGGRIS' && formListeningScript.trim() ? formListeningScript.trim() : undefined,
    };

    if (editingQuestion) {
      updateTkaQuestion(cleanQuestion);
      onLogActivity?.('Ubah Soal TKA', `Mengubah soal #${cleanQuestion.id} (${cleanQuestion.subject})`, 'MATERI');
      showToast('Soal berhasil diperbarui!');
    } else {
      saveCustomQuestion(cleanQuestion);
      onLogActivity?.('Tambah Soal TKA', `Menambahkan soal baru #${cleanQuestion.id} (${cleanQuestion.subject})`, 'MATERI');
      showToast('Soal baru berhasil ditambahkan!');
    }

    // Jika di-assign ke paket, update juga questionIds sesi paket
    if (formPackageId) {
      const targetPkg = packages.find((p) => p.id === formPackageId);
      if (targetPkg) {
        const updatedSessions = targetPkg.sessions.map((s) => {
          if (s.subject === cleanQuestion.subject) {
            const list = s.questionIds ? [...s.questionIds] : [];
            if (!list.includes(cleanQuestion.id)) {
              list.push(cleanQuestion.id);
            }
            return { ...s, questionIds: list };
          }
          return s;
        });
        saveCustomTryOutPackage({ ...targetPkg, sessions: updatedSessions });
        refreshPackages();
      }
    }

    refreshQuestions();
    setIsEditModalOpen(false);
    fireConfetti({ particleCount: 20 });
  };

  // Delete Question
  const handleDeleteQuestion = (q: TkaQuestion) => {
    if (window.confirm(`Hapus soal "${q.question.slice(0, 50)}..." dari Bank Soal?`)) {
      deleteTkaQuestion(q.id);
      refreshQuestions();
      onLogActivity?.('Hapus Soal TKA', `Menghapus soal #${q.id} (${q.subject})`, 'MATERI');
      showToast('Soal berhasil dihapus.');
    }
  };

  // Reset to Default
  const handleResetDefault = () => {
    if (
      window.confirm(
        'PERINGATAN: Anda akan mengembalikan Bank Soal ke susunan standar awal (termasuk paket SMPN 1 Bojongsari & paket standar bawaan). Lanjutkan?'
      )
    ) {
      resetTkaQuestionsToDefault();
      refreshQuestions();
      onLogActivity?.('Reset Bank Soal TKA', 'Mengembalikan seluruh bank soal ke default', 'MATERI');
      showToast('Bank Soal berhasil di-reset ke default.');
    }
  };

  // Package Management Handlers
  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle.trim()) {
      alert('Judul paket TOBK wajib diisi.');
      return;
    }

    const newPackageId = `CUSTOM_TOBK_${Date.now()}`;
    const newPkg: TryOutPackage = {
      id: newPackageId,
      title: newPkgTitle.trim(),
      tag: newPkgTag.trim() || 'Simulasi Mandiri',
      description:
        newPkgDesc.trim() ||
        'Simulasi Ujian TOBK 4 Sesi Terpadu (IPA, B. Indo, B. Inggris, Matematika) sistem Blocking Time.',
      totalQuestions: 120,
      sessions: [
        {
          subject: 'IPA',
          title: 'Sesi 1: Ilmu Pengetahuan Alam',
          durationMinutes: 35,
          questionCount: 30,
          questionIds: [],
        },
        {
          subject: 'B_INDO',
          title: 'Sesi 2: Literasi Bahasa Indonesia',
          durationMinutes: 30,
          questionCount: 30,
          questionIds: [],
        },
        {
          subject: 'B_INGGRIS',
          title: 'Sesi 3: Bahasa Inggris (3 Skills + Listening)',
          durationMinutes: 30,
          questionCount: 30,
          questionIds: [],
        },
        {
          subject: 'MATEMATIKA',
          title: 'Sesi 4: Penalaran Matematika',
          durationMinutes: 40,
          questionCount: 30,
          questionIds: [],
        },
      ],
    };

    saveCustomTryOutPackage(newPkg);
    refreshPackages();
    setIsCreatePkgModalOpen(false);
    setNewPkgTitle('');
    setNewPkgTag('');
    setNewPkgDesc('');
    soundManager.playCorrect();
    fireConfetti();
    showToast(`Paket "${newPkg.title}" berhasil dibuat!`);
    onLogActivity?.('Tambah Paket TOBK', `Membuat paket TOBK baru: ${newPkg.title}`, 'MATERI');
  };

  const handleDeletePackage = (pkg: TryOutPackage) => {
    const isDefault = TRY_OUT_PACKAGES.some((p) => p.id === pkg.id);
    if (isDefault) {
      alert('Paket bawaan sistem ("Paket Resmi Bawaan Sistem") tidak dapat dihapus.');
      return;
    }
    if (
      window.confirm(
        `Yakin ingin menghapus paket "${pkg.title}"?\nSemua konfigurasi sesi paket ini akan dihapus. (Soal di bank soal tetap aman namun tidak terafiliasi dengan paket ini lagi).`
      )
    ) {
      deleteCustomTryOutPackage(pkg.id);
      refreshPackages();
      soundManager.playClick();
      showToast(`Paket "${pkg.title}" berhasil dihapus.`);
      onLogActivity?.('Hapus Paket TOBK', `Menghapus paket TOBK: ${pkg.title}`, 'MATERI');
    }
  };

  // -------------------------------------------------------------
  // REUSABLE TEXT / PDF PARSER LOGIC
  // -------------------------------------------------------------
  const parseSeparateKeys = (keysText: string): Map<number, number[]> => {
    const keyMap = new Map<number, number[]>();
    if (!keysText.trim()) return keyMap;

    const lines = keysText.split(/\r?\n/);
    lines.forEach((line) => {
      const match = line.match(/^\s*(?:Nomor|No\.?\s*)?(\d+)[\.\s\:\-\)]+\s*(.+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        const rawLetters = match[2].toUpperCase();
        const letters = rawLetters.match(/[A-D]/g);
        if (letters && letters.length > 0) {
          const numSet = new Set<number>(letters.map((l) => l.charCodeAt(0) - 65));
          const indices: number[] = Array.from(numSet).sort((a, b) => a - b);
          keyMap.set(num, indices);
        }
      }
    });
    return keyMap;
  };

  const parseQuestionsFromRawText = (
    rawText: string,
    keysText: string,
    subject: TkaSubject,
    chapterId: string
  ): { questions: TkaQuestion[]; error?: string } => {
    if (!rawText.trim()) {
      return { questions: [], error: 'Teks soal kosong.' };
    }

    try {
      const separateKeysMap = parseSeparateKeys(keysText);

      // Split questions by numbers like "\n1. ", "\n1) ", "Soal 1", or double newlines before numbers
      const questionBlocks = rawText.split(/\n(?=\s*(?:(?:Soal|No\.?)\s*)?\d+[\.\)\:\-]\s+[A-Za-z0-9\(\"\'\—])/i);
      const parsedList: TkaQuestion[] = [];

      questionBlocks.forEach((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return;

        // Detect Question Number
        const numMatch = trimmed.match(/^\s*(?:(?:Soal|No\.?)\s*)?(\d+)[\.\)\:\-]\s*([\s\S]*)$/i);
        const qNumber = numMatch ? parseInt(numMatch[1], 10) : idx + 1;
        const fullContent = numMatch ? numMatch[2].trim() : trimmed;

        // Detect Passage (if format has "Wacana:" or "Bacaan:")
        let passage: string | undefined = undefined;
        const passageMatch = fullContent.match(/^(?:Wacana|Bacaan|Teks Bacaan)\s*[\:\-]\s*([\s\S]*?)(?=\nPertanyaan[\:\-]|\n\s*(?:\(?A[\.\)]|A\.)|\n\s*Perhatikan|\n\s*\d+[\.\)]|\n\s*[A-Z])/i);
        if (passageMatch && passageMatch[1].length > 40) {
          passage = passageMatch[1].trim();
        }

        // Extract Options A, B, C, D (handles A., A), (A), a., etc.)
        const optAMatch = fullContent.match(/(?:^|\n)\s*(?:\(?A[\.\)]|A\.)\s*([\s\S]*?)(?=\n\s*(?:\(?B[\.\)]|B\.)|\n\s*(?:Kunci|The King|Jawaban)|$)/i);
        const optBMatch = fullContent.match(/(?:^|\n)\s*(?:\(?B[\.\)]|B\.)\s*([\s\S]*?)(?=\n\s*(?:\(?C[\.\)]|C\.)|\n\s*(?:Kunci|The King|Jawaban)|$)/i);
        const optCMatch = fullContent.match(/(?:^|\n)\s*(?:\(?C[\.\)]|C\.)\s*([\s\S]*?)(?=\n\s*(?:\(?D[\.\)]|D\.)|\n\s*(?:Kunci|The King|Jawaban)|$)/i);
        const optDMatch = fullContent.match(/(?:^|\n)\s*(?:\(?D[\.\)]|D\.)\s*([\s\S]*?)(?=\n\s*(?:\(?E[\.\)]|E\.)|\n\s*(?:Kunci|The King|Jawaban)|$)/i);

        const optionA = optAMatch ? optAMatch[1].trim() : 'Pilihan A';
        const optionB = optBMatch ? optBMatch[1].trim() : 'Pilihan B';
        const optionC = optCMatch ? optCMatch[1].trim() : 'Pilihan C';
        const optionD = optDMatch ? optDMatch[1].trim() : 'Pilihan D';

        // Extract Question Text (before Option A)
        let questionText = fullContent;
        const optAIndex = fullContent.search(/(?:^|\n)\s*(?:\(?A[\.\)]|A\.)/i);
        if (optAIndex !== -1) {
          questionText = fullContent.slice(0, optAIndex).trim();
          if (passage && questionText.includes(passage)) {
            questionText = questionText.replace(passage, '').replace(/^(?:Wacana|Bacaan|Teks Bacaan)\s*[\:\-]/i, '').trim();
          }
        }
        if (!questionText) {
          questionText = `Pertanyaan soal nomor ${qNumber}`;
        }

        // Extract Key within question block or separate keys
        let detectedKeyIndices: number[] = [];
        const inlineKeyMatch = fullContent.match(/(?:Kunci(?:\s+Jawaban)?|Jawaban)\s*[\:\-]\s*([A-D,\s]+)/i);
        if (inlineKeyMatch) {
          const rawLetters = inlineKeyMatch[1].toUpperCase();
          const letters = rawLetters.match(/[A-D]/g);
          if (letters) {
            const numSet = new Set<number>(letters.map((l) => l.charCodeAt(0) - 65));
            detectedKeyIndices = Array.from(numSet).sort((a, b) => a - b);
          }
        }

        // Separate keys override or fallback
        if (separateKeysMap.has(qNumber)) {
          detectedKeyIndices = separateKeysMap.get(qNumber)!;
        }

        if (detectedKeyIndices.length === 0) {
          detectedKeyIndices = [0]; // default A
        }

        // Detect PG vs PGK
        const isPGK = detectedKeyIndices.length > 1;

        // Extract The King Formula
        let theKing: string | undefined = undefined;
        const theKingMatch = fullContent.match(/(?:The King|Solusi Kilat|Rumus Cepat)\s*[\:\-]\s*([\s\S]*?)(?=\n\s*(?:Solusi|Kunci|\d+[\.\)])|$)/i);
        if (theKingMatch) {
          theKing = theKingMatch[1].trim();
        }

        const selectedCh = TKA_CHAPTERS.find((c) => c.id === chapterId);

        parsedList.push({
          id: `IMPORT_${Date.now()}_${qNumber}`,
          subject,
          chapterId,
          chapterName: selectedCh ? `${selectedCh.number}: ${selectedCh.title}` : 'Bab Pembahasan',
          question: questionText,
          passage,
          options: [optionA, optionB, optionC, optionD],
          questionType: isPGK ? 'PGK' : 'PG',
          correctAnswer: detectedKeyIndices[0] ?? 0,
          correctAnswers: detectedKeyIndices,
          theKingFormula: theKing || 'Analisis teliti kata kunci pada pertanyaan dan sesuaikan dengan konsep materi.',
          conventionalSolution: 'Selesaikan langkah demi langkah sesuai kaidah materi.',
        });
      });

      if (parsedList.length === 0) {
        return {
          questions: [],
          error: 'Tidak ada format nomor soal yang dikenali. Pastikan teks soal memiliki nomor (1., 2.) dan pilihan A., B., C., D.',
        };
      }

      return { questions: parsedList };
    } catch (err: unknown) {
      return {
        questions: [],
        error: `Gagal memproses teks: ${(err as Error).message || String(err)}`,
      };
    }
  };

  const handleParseSmartText = () => {
    setSmartParseError(null);
    if (!smartQuestionsText.trim()) {
      setSmartParseError('Silakan tempel (paste) teks soal terlebih dahulu.');
      return;
    }

    const result = parseQuestionsFromRawText(
      smartQuestionsText,
      smartKeysText,
      smartDefaultSubject,
      smartDefaultChapter
    );

    if (result.error) {
      setSmartParseError(result.error);
    } else {
      setParsedPreview(result.questions);
      showToast(`${result.questions.length} soal berhasil diparsing! Silakan periksa pratinjau sebelum menyimpan.`);
    }
  };

  const handleCommitSmartTextQuestions = () => {
    if (parsedPreview.length === 0) return;
    saveCustomQuestionsBatch(parsedPreview);
    refreshQuestions();
    onLogActivity?.('Import Soal Smart Text', `Mengimpor ${parsedPreview.length} soal (${smartDefaultSubject})`, 'MATERI');
    showToast(`${parsedPreview.length} soal berhasil ditambahkan ke Bank Soal!`);
    setParsedPreview([]);
    setSmartQuestionsText('');
    setSmartKeysText('');
    setActiveSubTab('LIST');
    fireConfetti({ particleCount: 30 });
  };

  const handleSmartTextLoadFromPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Mengekstrak teks dari PDF...', 'success');
      const text = await extractTextFromPdf(file);
      setSmartQuestionsText(text);
      showToast('Teks berhasil dimuat dari PDF!', 'success');
    } catch (err: unknown) {
      showToast((err as Error).message || 'Gagal mengekstrak PDF', 'error');
    } finally {
      e.target.value = '';
    }
  };

  // -------------------------------------------------------------
  // PDF UPLOAD & PARSER LOGIC
  // -------------------------------------------------------------
  const handleProcessPdf = async (soalFile: File | null, keysFile: File | null) => {
    if (!soalFile) {
      setPdfError('Silakan pilih berkas PDF soal terlebih dahulu.');
      return;
    }

    setIsExtractingPdf(true);
    setPdfError(null);
    setPdfStatusMsg('Mengekstrak teks dari seluruh halaman file PDF soal...');

    try {
      const extractedSoal = await extractTextFromPdf(soalFile);
      setPdfExtractedText(extractedSoal);

      let extractedKeys = pdfKeysText;
      if (keysFile) {
        setPdfStatusMsg('Mengekstrak file PDF kunci jawaban terpisah...');
        const keysText = await extractTextFromPdf(keysFile);
        extractedKeys = keysText;
        setPdfKeysText(keysText);
      }

      setPdfStatusMsg('Menganalisis format soal, opsi A-D, dan kunci jawaban...');
      const parseResult = parseQuestionsFromRawText(extractedSoal, extractedKeys, pdfDefaultSubject, pdfDefaultChapter);

      if (parseResult.error) {
        setPdfError(parseResult.error);
        setPdfStatusMsg(null);
      } else {
        setPdfParsedPreview(parseResult.questions);
        setPdfStatusMsg(`Berhasil mengekstrak ${parseResult.questions.length} soal dari "${soalFile.name}"!`);
        showToast(`${parseResult.questions.length} soal berhasil diekstrak dari PDF!`);
      }
    } catch (err: unknown) {
      const msg = (err as Error).message || String(err);
      setPdfError(msg);
      setPdfStatusMsg(null);
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleReparsePdfText = () => {
    if (!pdfExtractedText.trim()) {
      setPdfError('Teks hasil ekstraksi PDF kosong.');
      return;
    }
    setPdfError(null);
    const parseResult = parseQuestionsFromRawText(pdfExtractedText, pdfKeysText, pdfDefaultSubject, pdfDefaultChapter);
    if (parseResult.error) {
      setPdfError(parseResult.error);
    } else {
      setPdfParsedPreview(parseResult.questions);
      showToast(`${parseResult.questions.length} soal berhasil diperbarui.`);
    }
  };

  const handleCommitPdfQuestions = () => {
    if (pdfParsedPreview.length === 0) return;
    saveCustomQuestionsBatch(pdfParsedPreview);
    refreshQuestions();
    onLogActivity?.('Import Soal PDF', `Mengimpor ${pdfParsedPreview.length} soal dari PDF (${pdfDefaultSubject})`, 'MATERI');
    showToast(`${pdfParsedPreview.length} soal berhasil disimpan ke Bank Soal!`);
    setPdfParsedPreview([]);
    setPdfSoalFile(null);
    setPdfKeysFile(null);
    setPdfExtractedText('');
    setPdfKeysText('');
    setActiveSubTab('LIST');
    fireConfetti({ particleCount: 35 });
  };

  // -------------------------------------------------------------
  // EXCEL / CSV IMPORT & EXPORT
  // -------------------------------------------------------------
  const handleDownloadExcelTemplate = async () => {
    const templateRows = [
      {
        Nomor: 1,
        Mata_Pelajaran: 'IPA',
        Bab: 'Bab 1: Biologi Manusia',
        Tipe_Soal: 'PG',
        Wacana: '',
        Pertanyaan: 'Organ tubuh yang berfungsi memompa darah ke seluruh tubuh adalah...',
        Pilihan_A: 'Jantung',
        Pilihan_B: 'Paru-paru',
        Pilihan_C: 'Ginjal',
        Pilihan_D: 'Hati',
        Kunci_Jawaban: 'A',
        Rumus_The_King: 'Pompa Darah = Jantung (Sentral Sirkulasi)',
        Solusi_Konvensional: 'Jantung memiliki 4 ruang yang memompa darah ke sirkulasi pulmonal dan sistemik.',
      },
      {
        Nomor: 2,
        Mata_Pelajaran: 'IPA',
        Bab: 'Bab 1: Biologi Manusia',
        Tipe_Soal: 'PGK',
        Wacana: 'Perhatikan fungsi organ ekskresi pada manusia berikut.',
        Pertanyaan: 'Manakah dari pernyataan berikut yang BENAR terkait fungsi ginjal? (Pilih semua yang tepat)',
        Pilihan_A: 'Menyaring limbah metabolik dari darah',
        Pilihan_B: 'Menghasilkan empedu untuk pencernaan lemak',
        Pilihan_C: 'Mengatur keseimbangan cairan dan elektrolit tubuh',
        Pilihan_D: 'Memproduksi hormon insulin',
        Kunci_Jawaban: 'A, C',
        Rumus_The_King: 'Ginjal = Filtrasi limbah + Regulasi cairan tubuh (A & C)',
        Solusi_Konvensional: 'Pilihan B adalah fungsi hati, dan pilihan D adalah fungsi pankreas.',
      },
      {
        Nomor: 3,
        Mata_Pelajaran: 'B_INDO',
        Bab: 'Bab 1: Menelaah Teks Berita & Eksposisi',
        Tipe_Soal: 'PG',
        Wacana: 'Kementerian Pendidikan meluncurkan program literasi digital di Bojongsari guna mengoptimalkan keterampilan abad ke-21.',
        Pertanyaan: 'Unsur berita "Di mana" (Where) pada kutipan teks di atas adalah...',
        Pilihan_A: 'Kementerian Pendidikan',
        Pilihan_B: 'Di Bojongsari',
        Pilihan_C: 'Program literasi digital',
        Pilihan_D: 'Keterampilan abad ke-21',
        Kunci_Jawaban: 'B',
        Rumus_The_King: 'Kata kunci "Di mana" langsung rujuk keterangan tempat: Di Bojongsari',
        Solusi_Konvensional: 'Keterangan tempat jelas tertera pada kata "di Bojongsari".',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Soal_TKA');

    await saveExcelWorkbook(wb, 'Template_Bank_Soal_TKA_IXH.xlsx', 'Unduh Template Soal TKA');
    showToast('Template Excel berhasil diunduh!');
  };

  const handleExportAllToExcel = async () => {
    if (questions.length === 0) {
      alert('Bank soal kosong!');
      return;
    }

    const exportRows = questions.map((q, idx) => {
      const keysText = (q.correctAnswers || [q.correctAnswer])
        .map((k) => String.fromCharCode(65 + k))
        .join(', ');

      return {
        Nomor: idx + 1,
        ID_Soal: q.id,
        Mata_Pelajaran: q.subject,
        Bab: q.chapterName || q.chapterId,
        Subtopik: q.subtopic || '',
        Tipe_Soal: q.questionType || 'PG',
        Wacana: q.passage || '',
        Pertanyaan: q.question,
        Pilihan_A: q.options[0] || '',
        Pilihan_B: q.options[1] || '',
        Pilihan_C: q.options[2] || '',
        Pilihan_D: q.options[3] || '',
        Kunci_Jawaban: keysText,
        Rumus_The_King: q.theKingFormula || '',
        Solusi_Konvensional: q.conventionalSolution || '',
        Audio_Listening: q.listeningScript || '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bank_Soal_TKA');

    await saveExcelWorkbook(wb, `Bank_Soal_TKA_IXH_Export_${new Date().toISOString().slice(0, 10)}.xlsx`, 'Ekspor Bank Soal');
    showToast(`Berhasil mengekspor ${questions.length} soal ke Excel!`);
  };

  // Parse Excel File
  const handleProcessExcelFiles = async () => {
    if (!excelFile) {
      setExcelStatusMsg('Silakan pilih file Excel/CSV soal terlebih dahulu.');
      return;
    }

    setExcelStatusMsg('Membaca berkas...');
    try {
      // 1. If there is a separate keys file, read it first
      const separateKeysMap = new Map<number, number[]>();
      if (excelKeysFile) {
        const keysBuffer = await excelKeysFile.arrayBuffer();
        const keysWb = XLSX.read(keysBuffer, { type: 'array' });
        const firstSheetName = keysWb.SheetNames[0];
        const keysSheet = keysWb.Sheets[firstSheetName];
        const keysJson: any[] = XLSX.utils.sheet_to_json(keysSheet);

        keysJson.forEach((row) => {
          const rawNum = row['Nomor'] || row['No'] || row['no'] || row['nomor'];
          const rawKey = row['Kunci'] || row['Kunci_Jawaban'] || row['kunci'] || row['Jawaban'];
          if (rawNum !== undefined && rawKey !== undefined) {
            const num = parseInt(String(rawNum), 10);
            const letters = String(rawKey).toUpperCase().match(/[A-D]/g);
            if (letters && letters.length > 0) {
              const numSet = new Set<number>(letters.map((l) => l.charCodeAt(0) - 65));
              const indices: number[] = Array.from(numSet).sort((a, b) => a - b);
              separateKeysMap.set(num, indices);
            }
          }
        });
      }

      // 2. Read Main Excel file
      const fileBuffer = await excelFile.arrayBuffer();
      const wb = XLSX.read(fileBuffer, { type: 'array' });
      const firstSheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[firstSheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!rows || rows.length === 0) {
        setExcelStatusMsg('Berkas Excel kosong atau tidak memiliki baris data.');
        return;
      }

      const parsedQuestions: TkaQuestion[] = [];

      rows.forEach((row, idx) => {
        const rowNum = parseInt(String(row['Nomor'] || row['No'] || idx + 1), 10);
        const rawSubject = String(row['Mata_Pelajaran'] || row['Mapel'] || 'IPA').toUpperCase();
        let mappedSubject: TkaSubject = 'IPA';
        if (rawSubject.includes('INDO')) mappedSubject = 'B_INDO';
        else if (rawSubject.includes('INGG') || rawSubject.includes('ENG')) mappedSubject = 'B_INGGRIS';
        else if (rawSubject.includes('MAT') || rawSubject.includes('MTK')) mappedSubject = 'MATEMATIKA';

        const questionText = String(row['Pertanyaan'] || row['Soal'] || '').trim();
        if (!questionText) return;

        const optA = String(row['Pilihan_A'] || row['Opsi_A'] || row['A'] || '').trim();
        const optB = String(row['Pilihan_B'] || row['Opsi_B'] || row['B'] || '').trim();
        const optC = String(row['Pilihan_C'] || row['Opsi_C'] || row['C'] || '').trim();
        const optD = String(row['Pilihan_D'] || row['Opsi_D'] || row['D'] || '').trim();

        const passage = row['Wacana'] || row['Bacaan'] ? String(row['Wacana'] || row['Bacaan']).trim() : undefined;
        const rawBab = String(row['Bab'] || row['Materi'] || 'Bab Pembahasan').trim();

        // Kunci Jawaban
        let keyIndices: number[] = [];
        if (separateKeysMap.has(rowNum)) {
          keyIndices = separateKeysMap.get(rowNum)!;
        } else {
          const rawKey = String(row['Kunci_Jawaban'] || row['Kunci'] || row['Jawaban'] || 'A').toUpperCase();
          const letters = rawKey.match(/[A-D]/g);
          if (letters) {
            const numSet = new Set<number>(letters.map((l) => l.charCodeAt(0) - 65));
            keyIndices = Array.from(numSet).sort((a, b) => a - b);
          }
        }
        if (keyIndices.length === 0) keyIndices = [0];

        // Tipe Soal
        const declaredType = String(row['Tipe_Soal'] || '').toUpperCase();
        const isPGK = declaredType === 'PGK' || keyIndices.length > 1;

        const theKingFormula = row['Rumus_The_King'] || row['The_King'] ? String(row['Rumus_The_King'] || row['The_King']).trim() : undefined;
        const conventionalSolution = row['Solusi_Konvensional'] || row['Pembahasan'] ? String(row['Solusi_Konvensional'] || row['Pembahasan']).trim() : undefined;

        parsedQuestions.push({
          id: `IMPORT_XLS_${Date.now()}_${rowNum}`,
          subject: mappedSubject,
          chapterId: `${mappedSubject}_BAB_1`,
          chapterName: rawBab,
          question: questionText,
          passage,
          options: [optA || 'Pilihan A', optB || 'Pilihan B', optC || 'Pilihan C', optD || 'Pilihan D'],
          questionType: isPGK ? 'PGK' : 'PG',
          correctAnswer: keyIndices[0] ?? 0,
          correctAnswers: keyIndices,
          theKingFormula: theKingFormula || 'Terapkan eliminasi pilihan ekstrim dan perhatikan pola kata kunci.',
          conventionalSolution: conventionalSolution || 'Pembahasan terstruktur sesuai konsep materi.',
        });
      });

      if (parsedQuestions.length === 0) {
        setExcelStatusMsg('Tidak dapat mengekstrak soal dari tabel. Pastikan nama kolom sesuai format template.');
        return;
      }

      setExcelParsedPreview(parsedQuestions);
      setExcelStatusMsg(`Berhasil memuat ${parsedQuestions.length} soal dari Excel! Silakan periksa tabel pratinjau di bawah.`);
    } catch (err: unknown) {
      setExcelStatusMsg(`Gagal memproses berkas Excel: ${(err as Error).message || String(err)}`);
    }
  };

  const handleCommitExcelQuestions = () => {
    if (excelParsedPreview.length === 0) return;
    saveCustomQuestionsBatch(excelParsedPreview);
    refreshQuestions();
    onLogActivity?.('Import Soal Excel', `Mengimpor ${excelParsedPreview.length} soal dari Excel`, 'MATERI');
    showToast(`${excelParsedPreview.length} soal berhasil ditambahkan ke Bank Soal!`);
    setExcelParsedPreview([]);
    setExcelFile(null);
    setExcelKeysFile(null);
    setExcelStatusMsg(null);
    setActiveSubTab('LIST');
    fireConfetti({ particleCount: 30 });
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3 rounded-2xl text-xs font-heading font-bold flex items-center gap-2 shadow-lg transition-all animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Banner & Quick Stats */}
      <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/70 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h4 className="font-heading font-extrabold text-base sm:text-lg text-[#1F3A5F]">
                Kelola Bank Soal TKA (TOBK & Latihan)
              </h4>
            </div>
            <p className="text-xs text-[#5C6F84] mt-0.5">
              Manajemen komprehensif: Soal Pilihan Ganda (PG), Pilihan Ganda Kompleks (PGK), Smart Text, & Import Excel/CSV.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenCreateModal}
              className="neu-btn-active bg-[#1C5FE0] hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Soal</span>
            </button>
            <button
              onClick={() => setActiveSubTab('PDF_UPLOAD')}
              className="neu-btn bg-white/80 hover:bg-rose-50 text-rose-800 border border-rose-300 px-3 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Upload & Ekstraksi Dokumen Soal dari Format PDF"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Upload PDF</span>
            </button>
            <button
              onClick={handleDownloadExcelTemplate}
              className="neu-btn bg-white/80 hover:bg-white text-emerald-800 border border-emerald-300 px-3 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Unduh Format Template Excel"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Template Excel</span>
            </button>
            <button
              onClick={handleExportAllToExcel}
              className="neu-btn bg-white/80 hover:bg-white text-blue-900 border border-blue-200 px-3 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Ekspor Seluruh Bank Soal ke Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>Ekspor Excel</span>
            </button>
            <button
              onClick={handleResetDefault}
              className="neu-btn bg-white/80 hover:bg-rose-50 text-rose-700 border border-rose-200 px-3 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Kembalikan ke Bank Soal Default"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-white/70 border border-white/90">
            <span className="text-[10px] font-bold text-gray-500 block uppercase">Total Soal</span>
            <span className="text-base font-extrabold text-[#1F3A5F]">{stats.total}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100">
            <span className="text-[10px] font-bold text-blue-700 block uppercase">PG Biasa (1 Kunci)</span>
            <span className="text-base font-extrabold text-blue-900">{stats.pgCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-100">
            <span className="text-[10px] font-bold text-purple-700 block uppercase">PGK Kompleks</span>
            <span className="text-base font-extrabold text-purple-900">{stats.pgkCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-700 block uppercase">IPA</span>
            <span className="text-base font-extrabold text-emerald-900">{stats.ipaCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-700 block uppercase">B. Indo</span>
            <span className="text-base font-extrabold text-indigo-900">{stats.bindoCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-100">
            <span className="text-[10px] font-bold text-amber-700 block uppercase">B. Inggris</span>
            <span className="text-base font-extrabold text-amber-900">{stats.bingCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-50/80 border border-cyan-100">
            <span className="text-[10px] font-bold text-cyan-700 block uppercase">Matematika</span>
            <span className="text-base font-extrabold text-cyan-900">{stats.mtkCount}</span>
          </div>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#DDE3F0] border border-white/60 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('LIST')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'LIST'
              ? 'bg-white text-[#1C5FE0] shadow-sm'
              : 'text-[#5C6F84] hover:text-[#1F3A5F]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Daftar & Edit Soal ({filteredQuestions.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('PACKAGES')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'PACKAGES'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-[#5C6F84] hover:text-[#1F3A5F]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>Kelola Paket TOBK ({packages.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('PDF_UPLOAD')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'PDF_UPLOAD'
              ? 'bg-white text-rose-700 shadow-sm'
              : 'text-[#5C6F84] hover:text-[#1F3A5F]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-rose-600" />
          <span>Upload PDF (Otomatis)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('SMART_TEXT')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'SMART_TEXT'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-[#5C6F84] hover:text-[#1F3A5F]'
          }`}
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Smart Text (Copy-Paste)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('EXCEL_UPLOAD')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'EXCEL_UPLOAD'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-[#5C6F84] hover:text-[#1F3A5F]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Excel / CSV</span>
        </button>
      </div>

      {/* ---------------- SUBTAB 1: DAFTAR SOAL ---------------- */}
      {activeSubTab === 'LIST' && (
        <div className="space-y-3">
          {/* Filters Bar */}
          <div className="neu-flat rounded-2xl p-3.5 bg-[#E7EBF5] border border-white/70 flex flex-col md:flex-row items-center gap-3">
            {/* Search */}
            <div className="neu-inset rounded-xl p-2 flex items-center gap-2 border border-white/50 w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-[#5C6F84] ml-1 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari soal, materi, The King..."
                className="w-full bg-transparent text-xs text-[#1F3A5F] placeholder-[#8B9BB0] focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Mapel */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-gray-500 shrink-0">Mapel:</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="neu-inset px-3 py-1.5 rounded-xl text-xs font-bold text-[#1F3A5F] focus:outline-none w-full md:w-auto"
              >
                <option value="ALL">Semua Mapel</option>
                <option value="IPA">IPA</option>
                <option value="B_INDO">B. Indonesia</option>
                <option value="B_INGGRIS">B. Inggris</option>
                <option value="MATEMATIKA">Matematika</option>
              </select>
            </div>

            {/* Filter Tipe Soal */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-gray-500 shrink-0">Tipe:</span>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="neu-inset px-3 py-1.5 rounded-xl text-xs font-bold text-[#1F3A5F] focus:outline-none w-full md:w-auto"
              >
                <option value="ALL">Semua Tipe (PG & PGK)</option>
                <option value="PG">Pilihan Ganda (PG)</option>
                <option value="PGK">Pilihan Ganda Kompleks (PGK)</option>
              </select>
            </div>

            {/* Filter Paket TOBK */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] font-bold text-gray-500 shrink-0">Paket:</span>
              <select
                value={selectedPackageFilter}
                onChange={(e) => setSelectedPackageFilter(e.target.value)}
                className="neu-inset px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-900 bg-indigo-50/50 focus:outline-none w-full md:w-auto max-w-[200px] truncate"
              >
                <option value="ALL">Semua Paket & Soal Bebas</option>
                <option value="UNASSIGNED">Khusus Soal Belum Masuk Paket</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions List Card Items */}
          <div className="space-y-2.5">
            {filteredQuestions.length === 0 ? (
              <div className="neu-flat rounded-2xl p-8 bg-[#E7EBF5] text-center space-y-2 border border-white/80">
                <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
                <p className="font-heading font-bold text-sm text-gray-700">Tidak ada soal yang sesuai</p>
                <p className="text-xs text-gray-500">
                  Coba ubah kata kunci pencarian atau gunakan tombol Tambah Soal / Import di atas.
                </p>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const isComplex = q.questionType === 'PGK';
                const keys = q.correctAnswers || [q.correctAnswer];
                const keyLetters = keys.map((k) => String.fromCharCode(65 + k)).join(', ');
                const matchedPkg = q.packageId ? packages.find((p) => p.id === q.packageId) : null;

                return (
                  <div
                    key={q.id}
                    className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 hover:border-blue-200 transition-all space-y-2.5"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-lg bg-[#1C5FE0] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-900">
                          {q.subject}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isComplex ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {isComplex ? 'PGK (Pilihan Ganda Kompleks)' : 'PG Biasa'}
                        </span>
                        {matchedPkg && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-indigo-600" />
                            <span>{matchedPkg.title}</span>
                          </span>
                        )}
                        <span className="text-xs font-semibold text-gray-600">
                          {q.chapterName || q.chapterId} {q.subtopic && `• ${q.subtopic}`}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(q)}
                          className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-blue-800 border border-gray-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q)}
                          className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                        >
                          <Trash2 className="w-3 h-3 text-rose-600" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>

                    {/* Passage if any */}
                    {q.passage && (
                      <div className="p-2.5 rounded-xl bg-white/70 border border-blue-100 text-xs text-gray-700 italic max-h-24 overflow-y-auto">
                        <strong className="not-italic text-[10px] uppercase text-blue-800 font-bold block mb-0.5">
                          Wacana:
                        </strong>
                        {q.passage}
                      </div>
                    )}

                    {/* Question Text */}
                    <p className="text-xs sm:text-sm font-medium text-[#1F3A5F] leading-relaxed">
                      {q.question}
                    </p>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isKey = keys.includes(optIdx);
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-xl text-xs flex items-start gap-2 border transition-all ${
                              isKey
                                ? 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold'
                                : 'bg-white/50 text-gray-700 border-white/80'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                isKey ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 leading-snug">{opt}</span>
                            {isKey && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800 uppercase font-bold">
                                Kunci
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* The King Formula & Solution Summary */}
                    {(q.theKingFormula || q.conventionalSolution) && (
                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-start gap-2">
                        <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Metode The King: </strong>
                          <span>{q.theKingFormula || q.conventionalSolution}</span>
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

      {/* ---------------- SUBTAB 2: UPLOAD & EXTRACT PDF ---------------- */}
      {activeSubTab === 'PDF_UPLOAD' && (
        <div className="space-y-4">
          {/* New Interactive PDF Wizard Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <span className="font-heading font-extrabold text-sm sm:text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-200" />
                <span>Wizard Impor PDF Berbasis AI (KaTeX &amp; HOTS Ready)</span>
              </span>
              <p className="text-xs text-rose-100 max-w-2xl leading-relaxed">
                Ekstraksi otomatis teks PDF di browser, pemecahan per-chunk, analisis AI dengan deteksi confidence tingkat keyakinan (⚠️ Perlu dicek ulang vs Cek sekilas vs Akurat), pemformatan rumus KaTeX ($...$), dan assign langsung ke paket TOBK.
              </p>
            </div>
            <button
              onClick={() => handleOpenPdfImport()}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-800 font-heading font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all shrink-0 active:scale-98"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span>Buka Wizard Impor PDF</span>
            </button>
          </div>

          <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/70 space-y-4">
            <div className="space-y-1">
              <h5 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Ekstraksi Teks Mentah Dokumen PDF</span>
              </h5>
              <p className="text-xs text-gray-600 leading-relaxed">
                Gunakan formulir cepat di bawah ini untuk mengekstrak teks PDF secara langsung dan meninjau baris demi baris di layar editor.
              </p>
            </div>

          {/* Defaults for Imported Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-white/70 border border-gray-200">
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">Mata Pelajaran Target:</label>
              <select
                value={pdfDefaultSubject}
                onChange={(e) => {
                  const s = e.target.value as TkaSubject;
                  setPdfDefaultSubject(s);
                  const firstCh = TKA_CHAPTERS.find((c) => c.subject === s);
                  if (firstCh) setPdfDefaultChapter(firstCh.id);
                }}
                className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
              >
                <option value="IPA">IPA</option>
                <option value="B_INDO">B. Indonesia</option>
                <option value="B_INGGRIS">B. Inggris</option>
                <option value="MATEMATIKA">Matematika</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">Bab / Topik Target:</label>
              <select
                value={pdfDefaultChapter}
                onChange={(e) => setPdfDefaultChapter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
              >
                {TKA_CHAPTERS.filter((c) => c.subject === pdfDefaultSubject).map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.number}: {ch.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2 PDF Upload Zones: File Soal & File Kunci Terpisah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File PDF Soal */}
            <div className="p-4 rounded-2xl bg-white/80 border-2 border-dashed border-rose-300 hover:border-rose-500 transition-colors space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>1. Dokumen PDF Soal (Wajib)</span>
                </span>
                {pdfSoalFile && (
                  <button
                    onClick={() => {
                      setPdfSoalFile(null);
                      setPdfExtractedText('');
                      setPdfParsedPreview([]);
                      if (pdfInputRef.current) pdfInputRef.current.value = '';
                    }}
                    className="text-[10px] text-gray-400 hover:text-rose-600 cursor-pointer"
                  >
                    Ganti
                  </button>
                )}
              </div>

              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPdfSoalFile(file);
                  if (file) {
                    handleProcessPdf(file, pdfKeysFile);
                  }
                }}
                className="text-xs text-gray-700 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-600 file:text-white file:cursor-pointer"
              />

              {pdfSoalFile ? (
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between">
                  <span className="truncate max-w-[200px] font-semibold">{pdfSoalFile.name}</span>
                  <span className="text-[10px] text-rose-700 shrink-0 font-mono">
                    {(pdfSoalFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 italic">
                  Pilih atau drag & drop file PDF soal ujian/latihan Anda di sini.
                </p>
              )}
            </div>

            {/* File PDF Kunci Jawaban Terpisah (Opsional) */}
            <div className="p-4 rounded-2xl bg-white/80 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. PDF Kunci Jawaban (Opsional)</span>
                </span>
                {pdfKeysFile && (
                  <button
                    onClick={() => {
                      setPdfKeysFile(null);
                      setPdfKeysText('');
                      if (pdfKeysInputRef.current) pdfKeysInputRef.current.value = '';
                    }}
                    className="text-[10px] text-gray-400 hover:text-blue-600 cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <input
                ref={pdfKeysInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPdfKeysFile(file);
                  if (file && pdfSoalFile) {
                    handleProcessPdf(pdfSoalFile, file);
                  }
                }}
                className="text-xs text-gray-700 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white file:cursor-pointer"
              />

              {pdfKeysFile ? (
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                  <span className="truncate max-w-[200px] font-semibold">{pdfKeysFile.name}</span>
                  <span className="text-[10px] text-blue-700 shrink-0 font-mono">
                    {(pdfKeysFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 italic">
                  Kosongkan jika kunci jawaban sudah tertulis di dalam file PDF soal atau ingin diisi manual.
                </p>
              )}
            </div>
          </div>

          {/* Action Button & Status */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleProcessPdf(pdfSoalFile, pdfKeysFile)}
              disabled={!pdfSoalFile || isExtractingPdf}
              className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 transition-all"
            >
              {isExtractingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang Mengekstrak PDF...</span>
                </>
              ) : (
                <>
                  <FileUp className="w-4 h-4" />
                  <span>Ekstrak Teks & Analisis Soal PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Progress / Status Message */}
          {pdfStatusMsg && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2 animate-fade-in">
              {isExtractingPdf && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />}
              <span>{pdfStatusMsg}</span>
            </div>
          )}

          {/* Error Message */}
          {pdfError && (
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold">Kendala ekstraksi PDF:</p>
                <p>{pdfError}</p>
                <p className="text-[11px] text-rose-700 mt-1">
                  Tips: Jika PDF berupa hasil scan/foto murni, pastikan dokumen memiliki layer teks digital (OCR). Anda juga bisa langsung menyalin teks lewat tab <strong>Smart Text</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Extracted Text Inspector Accordion */}
          {pdfExtractedText && (
            <div className="border border-gray-300 rounded-2xl p-3.5 bg-white/70 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsPdfTextExpanded(!isPdfTextExpanded)}
                  className="font-heading font-bold text-xs text-gray-800 flex items-center gap-1.5 cursor-pointer hover:text-blue-600"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isPdfTextExpanded ? 'Tutup' : 'Buka'} Teks Hasil Ekstraksi PDF ({pdfExtractedText.length} karakter)</span>
                </button>
                <button
                  onClick={handleReparsePdfText}
                  className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Terapkan ulang hasil edit teks ke pratinjau soal"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Perbarui Pratinjau</span>
                </button>
              </div>

              {isPdfTextExpanded && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-[11px] text-gray-500">
                    Anda dapat mengedit atau merapikan nomor soal dan opsi langsung di kotak teks berikut jika diperlukan:
                  </p>
                  <textarea
                    rows={8}
                    value={pdfExtractedText}
                    onChange={(e) => setPdfExtractedText(e.target.value)}
                    className="w-full p-2.5 rounded-xl neu-inset text-xs font-mono text-gray-800 border border-gray-200 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* PDF Parsed Preview Section */}
          {pdfParsedPreview.length > 0 && (
            <div className="pt-3 border-t border-gray-300 space-y-3 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-heading font-extrabold text-sm text-gray-900 block">
                    Pratinjau Hasil: {pdfParsedPreview.length} Soal Terdeteksi dari PDF
                  </span>
                  <span className="text-xs text-gray-500">
                    Periksa kembali data di bawah sebelum disimpan permanen ke Bank Soal.
                  </span>
                </div>
                <button
                  onClick={handleCommitPdfQuestions}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Semua ({pdfParsedPreview.length} Soal) ke Bank Soal</span>
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                {pdfParsedPreview.map((q, i) => {
                  const isComplex = q.questionType === 'PGK';
                  const keys = q.correctAnswers || [q.correctAnswer];
                  return (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-rose-200 shadow-xs text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-rose-950 font-heading">
                            Soal #{i + 1}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isComplex
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {isComplex ? 'Pilihan Ganda Kompleks (PGK)' : 'Pilihan Ganda (PG)'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Kunci: {keys.map((k) => String.fromCharCode(65 + k)).join(', ')}
                        </span>
                      </div>

                      {q.passage && (
                        <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200 text-gray-700 italic">
                          <strong>Wacana:</strong> {q.passage.slice(0, 160)}...
                        </div>
                      )}

                      <p className="font-medium text-gray-900">{q.question}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = keys.includes(optIdx);
                          return (
                            <div
                              key={optIdx}
                              className={`p-1.5 rounded-lg flex items-center gap-1.5 ${
                                isCorrect
                                  ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                                  : 'bg-gray-50 text-gray-700 border border-gray-100'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0 ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-800'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {q.theKingFormula && (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-[11px] flex items-center gap-1.5">
                          <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>
                            <strong>The King:</strong> {q.theKingFormula}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* ---------------- SUBTAB 3: SMART TEXT IMPORT ---------------- */}
      {activeSubTab === 'SMART_TEXT' && (
        <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/70 space-y-4">
          <div className="space-y-1">
            <h5 className="font-heading font-bold text-sm text-[#1F3A5F] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Smart Text Importer (Copy-Paste Cerdas)</span>
            </h5>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cukup tempel (copy-paste) kumpulan teks soal dari dokumen Word/PDF. Sistem secara otomatis mendeteksi nomor soal, teks pertanyaan, wacana, opsi A..D, dan trik The King. Jika kunci jawaban terpisah, tempelkan di kotak sebelah kanan.
            </p>
          </div>

          {/* Defaults for Imported Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-white/70 border border-gray-200">
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">Mata Pelajaran Default:</label>
              <select
                value={smartDefaultSubject}
                onChange={(e) => {
                  const s = e.target.value as TkaSubject;
                  setSmartDefaultSubject(s);
                  const firstCh = TKA_CHAPTERS.find((c) => c.subject === s);
                  if (firstCh) setSmartDefaultChapter(firstCh.id);
                }}
                className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
              >
                <option value="IPA">IPA</option>
                <option value="B_INDO">B. Indonesia</option>
                <option value="B_INGGRIS">B. Inggris</option>
                <option value="MATEMATIKA">Matematika</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">Bab / Topik Default:</label>
              <select
                value={smartDefaultChapter}
                onChange={(e) => setSmartDefaultChapter(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
              >
                {TKA_CHAPTERS.filter((c) => c.subject === smartDefaultSubject).map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.number}: {ch.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Two Input Boxes: Questions & Separate Keys */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>1. Teks Kumpulan Soal & Opsi (Wajib)</span>
                  <input
                    ref={smartPdfInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleSmartTextLoadFromPdf}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => smartPdfInputRef.current?.click()}
                    className="text-[10px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    title="Ekstrak langsung dari file PDF ke kotak teks ini"
                  >
                    <FileText className="w-3 h-3 text-rose-600" />
                    <span>Muat dari PDF</span>
                  </button>
                </span>
                <span className="text-[10px] font-normal text-gray-500">Format: 1. Soal ... A. ... B. ... Kunci: A</span>
              </label>
              <textarea
                rows={12}
                value={smartQuestionsText}
                onChange={(e) => setSmartQuestionsText(e.target.value)}
                placeholder={`Contoh format:
1. Perhatikan pernyataan tentang organ tubuh manusia!
A. Jantung memompa darah ke seluruh tubuh
B. Hati berfungsi menampung oksigen
C. Ginjal menghasilkan insulin
D. Paru-paru memompa limbah darah
Kunci: A
The King: Jantung adalah pusat pompa darah

2. Manakah sifat-sifat bangun datar belah ketupat? (Pilih semua yang tepat)
A. Keempat sisinya sama panjang
B. Semua sudutnya 90 derajat
C. Kedua diagonalnya berpotongan tegak lurus
D. Memiliki 4 simetri putar
Kunci: A, C
The King: Belah ketupat = 4 sisi sama & diagonal tegak lurus`}
                className="w-full p-3 rounded-2xl neu-inset text-xs font-mono text-gray-800 border border-white/60 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                <span>2. Kunci Jawaban Terpisah (Opsional)</span>
                <span className="text-[10px] font-normal text-gray-500">Jika terpisah</span>
              </label>
              <textarea
                rows={12}
                value={smartKeysText}
                onChange={(e) => setSmartKeysText(e.target.value)}
                placeholder={`Jika file kunci jawaban terpisah, tempel di sini:
1. A
2. A, C
3. B
4. D
5. B, D`}
                className="w-full p-3 rounded-2xl neu-inset text-xs font-mono text-gray-800 border border-white/60 focus:outline-none"
              />
            </div>
          </div>

          {smartParseError && (
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{smartParseError}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleParseSmartText}
              className="py-2.5 px-5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analisis & Pratinjau Soal</span>
            </button>
          </div>

          {/* Parsed Preview Table */}
          {parsedPreview.length > 0 && (
            <div className="pt-3 border-t border-gray-200 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-xs text-gray-800">
                  Pratinjau Hasil Parse: {parsedPreview.length} Soal Terdeteksi
                </span>
                <button
                  onClick={handleCommitSmartTextQuestions}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Semua ({parsedPreview.length}) ke Bank Soal</span>
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {parsedPreview.map((q, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-purple-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900">Soal #{i + 1} ({q.questionType})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Kunci: {(q.correctAnswers || [q.correctAnswer]).map((k) => String.fromCharCode(65 + k)).join(', ')}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 line-clamp-2">{q.question}</p>
                    <div className="text-[11px] text-gray-500 flex gap-2">
                      <span>A: {q.options[0]?.slice(0, 20)}...</span>
                      <span>B: {q.options[1]?.slice(0, 20)}...</span>
                      <span>C: {q.options[2]?.slice(0, 20)}...</span>
                      <span>D: {q.options[3]?.slice(0, 20)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- SUBTAB 3: EXCEL / CSV UPLOAD ---------------- */}
      {activeSubTab === 'EXCEL_UPLOAD' && (
        <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/70 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="space-y-0.5">
              <span className="font-heading font-extrabold text-sm flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>Wizard Impor Excel Standar TOBK (KaTeX &amp; HOTS Ready)</span>
              </span>
              <p className="text-xs text-emerald-100">
                Gunakan wizard interaktif untuk validasi per-baris, render rumus KaTeX, edit inline, dan assign langsung ke paket TOBK.
              </p>
            </div>
            <button
              onClick={() => handleOpenExcelImport()}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all shrink-0 active:scale-98"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Buka Wizard Impor Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Soal */}
            <div className="p-4 rounded-2xl bg-white/70 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-950 block">1. File Berkas Soal (.xlsx / .csv)</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                className="text-xs text-gray-700 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white file:cursor-pointer"
              />
              {excelFile && (
                <p className="text-[11px] text-emerald-700 font-semibold">
                  Terpilih: {excelFile.name} ({(excelFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* File Kunci Terpisah (Opsional) */}
            <div className="p-4 rounded-2xl bg-white/70 border border-blue-200 space-y-2">
              <span className="text-xs font-bold text-blue-950 block">2. File Kunci Jawaban Terpisah (Opsional)</span>
              <input
                ref={keysFileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => setExcelKeysFile(e.target.files?.[0] || null)}
                className="text-xs text-gray-700 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white file:cursor-pointer"
              />
              {excelKeysFile && (
                <p className="text-[11px] text-blue-700 font-semibold">
                  Terpilih: {excelKeysFile.name} ({(excelKeysFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>

          {excelStatusMsg && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
              {excelStatusMsg}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleProcessExcelFiles}
              disabled={!excelFile}
              className="py-2.5 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>Proses & Pratinjau Berkas Excel</span>
            </button>
            <button
              onClick={handleDownloadExcelTemplate}
              className="py-2.5 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 font-heading font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-gray-50"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh Template Format (.xlsx)</span>
            </button>
          </div>

          {/* Excel Preview Table */}
          {excelParsedPreview.length > 0 && (
            <div className="pt-3 border-t border-gray-200 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-xs text-emerald-950">
                  Pratinjau Data Excel: {excelParsedPreview.length} Soal Siap Diimpor
                </span>
                <button
                  onClick={handleCommitExcelQuestions}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Semua ({excelParsedPreview.length}) ke Bank Soal</span>
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {excelParsedPreview.map((q, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950">
                        #{i + 1} &bull; {q.subject} &bull; {q.questionType}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Kunci: {(q.correctAnswers || [q.correctAnswer]).map((k) => String.fromCharCode(65 + k)).join(', ')}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- SUBTAB 5: KELOLA PAKET TOBK ---------------- */}
      {activeSubTab === 'PACKAGES' && (
        <div className="space-y-4 animate-fade-in">
          {/* Header Bar */}
          <div className="neu-flat rounded-2xl p-4 sm:p-5 bg-[#E7EBF5] border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Layers className="w-4 h-4" />
                </span>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#1F3A5F]">
                  Kelola Paket TOBK &amp; Sesi Ujian
                </h4>
              </div>
              <p className="text-xs text-[#5C6F84]">
                Pantau progres kelengkapan soal per sesi (target 30 soal/sesi) dan buat paket simulasi TOBK baru.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleOpenExcelImport()}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all shrink-0 active:scale-98"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>📥 Impor dari Excel</span>
              </button>
              <button
                onClick={() => handleOpenPdfImport()}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all shrink-0 active:scale-98"
              >
                <FileText className="w-4 h-4 text-rose-200" />
                <span>📄 Impor dari PDF</span>
              </button>
              <button
                onClick={() => handleOpenBatchGenerate()}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-[#1C5FE0] hover:from-indigo-700 hover:to-blue-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all shrink-0 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>✨ Generate Soal AI per Paket</span>
              </button>
              <button
                onClick={() => setIsCreatePkgModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-[#1F3A5F] border border-gray-200 font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Paket Baru</span>
              </button>
            </div>
          </div>

          {/* Packages List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {packages.map((pkg) => {
              const isDefault = TRY_OUT_PACKAGES.some((def) => def.id === pkg.id);

              // Hitung progress masing-masing sesi
              const sessionStats = pkg.sessions.map((sess) => {
                const inBank = questions.filter(
                  (q) => q.packageId === pkg.id && q.subject === sess.subject
                ).length;
                const explicit = sess.questionIds ? sess.questionIds.length : 0;
                const currentCount = inBank > 0 ? inBank : explicit;
                const target = sess.questionCount || 30;
                const isComplete = currentCount >= target;

                let label = 'IPA';
                let colorBg = 'bg-emerald-50 text-emerald-900 border-emerald-200';
                let barColor = 'bg-emerald-500';
                if (sess.subject === 'B_INDO') {
                  label = 'B.Indo';
                  colorBg = 'bg-indigo-50 text-indigo-900 border-indigo-200';
                  barColor = 'bg-indigo-500';
                } else if (sess.subject === 'B_INGGRIS') {
                  label = 'B.Inggris';
                  colorBg = 'bg-amber-50 text-amber-900 border-amber-200';
                  barColor = 'bg-amber-500';
                } else if (sess.subject === 'MATEMATIKA') {
                  label = 'Matematika';
                  colorBg = 'bg-cyan-50 text-cyan-900 border-cyan-200';
                  barColor = 'bg-cyan-500';
                }

                return {
                  subject: sess.subject,
                  label,
                  currentCount,
                  target,
                  isComplete,
                  durationMinutes: sess.durationMinutes,
                  colorBg,
                  barColor,
                };
              });

              // Summary Text sesuai format yang diminta:
              // "IPA: 18/30 soal · B.Indo: 30/30 ✅ · B.Inggris: 5/30 · Matematika: 0/30"
              const summaryLine = sessionStats
                .map((s) => `${s.label}: ${s.currentCount}/${s.target}${s.isComplete ? ' ✅' : ' soal'}`)
                .join(' · ');

              const totalAssigned = sessionStats.reduce((acc, s) => acc + s.currentCount, 0);
              const totalTarget = sessionStats.reduce((acc, s) => acc + s.target, 0);
              const overallPercent = Math.min(100, Math.round((totalAssigned / totalTarget) * 100));

              return (
                <div
                  key={pkg.id}
                  className="neu-flat rounded-2xl p-4 bg-[#E7EBF5] border border-white/80 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Tags & Type */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#1C5FE0]/10 text-[#1C5FE0] border border-[#1C5FE0]/20">
                          {pkg.tag}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isDefault
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}
                        >
                          {isDefault ? 'Paket Bawaan (Resmi)' : 'Paket Custom Admin'}
                        </span>
                      </div>

                      <span className="text-[11px] font-extrabold text-[#1F3A5F]">
                        {totalAssigned}/{totalTarget} Soal ({overallPercent}%)
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#1F3A5F]">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-[#5C6F84] leading-relaxed line-clamp-2 mt-0.5">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Progress Text Single Line (Required Format) */}
                    <div className="p-2.5 rounded-xl bg-white/70 border border-white/90 text-xs text-[#1F3A5F] font-semibold leading-relaxed">
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                        Status Kuota Sesi:
                      </span>
                      {summaryLine}
                    </div>

                    {/* Progress Detail Cards per Session */}
                    <div className="grid grid-cols-2 gap-2">
                      {sessionStats.map((sess) => {
                        const pct = Math.min(100, Math.round((sess.currentCount / sess.target) * 100));
                        return (
                          <div
                            key={sess.subject}
                            className={`p-2 rounded-xl border ${sess.colorBg} space-y-1.5`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span>{sess.label}</span>
                              <span>
                                {sess.currentCount}/{sess.target}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
                              <div
                                className={`h-full ${sess.barColor} transition-all duration-300`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-white/60 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedPackageFilter(pkg.id);
                          setActiveSubTab('LIST');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[#1C5FE0] border border-blue-200 text-xs font-heading font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                      >
                        <Search className="w-3 h-3" />
                        <span>Lihat Soal ({totalAssigned})</span>
                      </button>

                      <button
                        onClick={() => handleOpenExcelImport(pkg.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-heading font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                        title="Import Soal Excel untuk paket ini"
                      >
                        <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                        <span>Impor Excel</span>
                      </button>

                      <button
                        onClick={() => handleOpenPdfImport(pkg.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-heading font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                        title="Import Soal PDF untuk paket ini"
                      >
                        <FileText className="w-3 h-3 text-rose-600" />
                        <span>Impor PDF</span>
                      </button>

                      <button
                        onClick={() => handleOpenBatchGenerate(pkg.id)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-heading font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                        title="Generate Soal AI untuk paket ini"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>Batch AI</span>
                      </button>
                    </div>

                    {!isDefault ? (
                      <button
                        onClick={() => handleDeletePackage(pkg)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3 h-3 text-rose-500" />
                        <span>Hapus Paket</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium italic">
                        Paket Resmi Sistem
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- MODAL FORM CREATE NEW PACKAGE ---------------- */}
      {isCreatePkgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/90 max-w-lg w-full space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#1C5FE0] text-white flex items-center justify-center font-bold text-sm">
                  <Package className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                    Buat Paket TOBK Baru
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Otomatis membuat 4 sesi ujian standar (120 soal).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreatePkgModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-gray-500 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePackage} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Judul Paket TOBK:
                </label>
                <input
                  type="text"
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  placeholder="Contoh: Paket TOBK Akbar Semester Genap"
                  className="w-full px-3 py-2 rounded-xl neu-inset text-xs text-[#1F3A5F] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Tag / Label Singkat:
                </label>
                <input
                  type="text"
                  value={newPkgTag}
                  onChange={(e) => setNewPkgTag(e.target.value)}
                  placeholder="Contoh: Try Out 2, Simulasi Sekolah"
                  className="w-full px-3 py-2 rounded-xl neu-inset text-xs text-[#1F3A5F]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Deskripsi Paket:
                </label>
                <textarea
                  rows={2}
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  placeholder="Keterangan mengenai kisi-kisi atau sasaran paket ujian ini..."
                  className="w-full p-2.5 rounded-xl neu-inset text-xs text-gray-800"
                />
              </div>

              {/* 4 Sessions Auto-Gen Info */}
              <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-950 space-y-1.5">
                <span className="font-heading font-bold text-[11px] flex items-center gap-1.5 text-indigo-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>4 Sesi Standar Terpadu (Blocking Time Otomatis Dibuat):</span>
                </span>
                <ul className="text-[11px] text-indigo-800 space-y-0.5 list-disc pl-4">
                  <li>Sesi 1: IPA (35 Menit · Target 30 Soal)</li>
                  <li>Sesi 2: Literasi Bahasa Indonesia (30 Menit · Target 30 Soal)</li>
                  <li>Sesi 3: Bahasa Inggris (30 Menit · Target 30 Soal)</li>
                  <li>Sesi 4: Penalaran Matematika (40 Menit · Target 30 Soal)</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreatePkgModalOpen(false)}
                  className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-gray-600 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C5FE0] hover:bg-blue-700 text-white text-xs font-heading font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Buat &amp; Simpan Paket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL FORM CREATE / EDIT QUESTION ---------------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="neu-flat rounded-3xl p-5 sm:p-6 bg-[#E7EBF5] border border-white/90 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#1C5FE0] text-white flex items-center justify-center font-bold text-sm">
                  {editingQuestion ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
                <div>
                  <h4 className="font-heading font-bold text-sm text-[#1F3A5F]">
                    {editingQuestion ? 'Edit Soal Bank TKA' : 'Tambah Soal Baru'}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Mendukung Pilihan Ganda (PG) & Pilihan Ganda Kompleks (PGK).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-gray-500 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="space-y-3.5">
              {/* Assign ke Paket TOBK */}
              <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Assign ke Paket TOBK:</span>
                  </label>
                  <span className="text-[10px] text-indigo-700 font-medium">Opsional</span>
                </div>
                <select
                  value={formPackageId}
                  onChange={(e) => setFormPackageId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-indigo-300 bg-white text-xs font-semibold text-[#1F3A5F] focus:outline-none focus:ring-2 focus:ring-[#1C5FE0]"
                >
                  <option value="">— Soal Latihan Biasa (Tidak Masuk Paket Manapun) —</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.tag})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Mata Pelajaran:</label>
                  <select
                    value={formSubject}
                    onChange={(e) => {
                      const s = e.target.value as TkaSubject;
                      setFormSubject(s);
                      const firstCh = TKA_CHAPTERS.find((c) => c.subject === s);
                      if (firstCh) {
                        setFormChapterId(firstCh.id);
                        setFormChapterName(`${firstCh.number}: ${firstCh.title}`);
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                  >
                    <option value="IPA">IPA</option>
                    <option value="B_INDO">B. Indonesia</option>
                    <option value="B_INGGRIS">B. Inggris</option>
                    <option value="MATEMATIKA">Matematika</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Bab / Modul:</label>
                  <select
                    value={formChapterId}
                    onChange={(e) => {
                      setFormChapterId(e.target.value);
                      const ch = TKA_CHAPTERS.find((c) => c.id === e.target.value);
                      if (ch) setFormChapterName(`${ch.number}: ${ch.title}`);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-[#1F3A5F]"
                  >
                    {TKA_CHAPTERS.filter((c) => c.subject === formSubject).map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.number}: {ch.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 block mb-1">Tipe Soal:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as TkaQuestionType)}
                    className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs font-bold text-purple-900 bg-purple-50"
                  >
                    <option value="PG">Pilihan Ganda (1 Jawaban)</option>
                    <option value="PGK">Pilihan Ganda Kompleks (Multi Jawaban)</option>
                  </select>
                </div>
              </div>

              {/* Subtopic */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Subtopik / Konsep Spesifik (Opsional):</label>
                <input
                  type="text"
                  value={formSubtopic}
                  onChange={(e) => setFormSubtopic(e.target.value)}
                  placeholder="Contoh: Hukum Archimedes, Ide Pokok Paragraf"
                  className="w-full px-3 py-1.5 rounded-xl neu-inset text-xs text-[#1F3A5F]"
                />
              </div>

              {/* Reading Passage (Wacana) */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Wacana / Teks Bacaan (Opsional):
                </label>
                <textarea
                  rows={3}
                  value={formPassage}
                  onChange={(e) => setFormPassage(e.target.value)}
                  placeholder="Kutipan artikel berita, teks narasi, atau instruksi wacana..."
                  className="w-full p-2.5 rounded-xl neu-inset text-xs text-gray-800"
                />
              </div>

              {/* Question Text */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Teks Pertanyaan <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Tuliskan pertanyaan secara lengkap dan jelas..."
                  className="w-full p-2.5 rounded-xl neu-inset text-xs text-gray-800"
                  required
                />
              </div>

              {/* Options A, B, C, D with Key Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700">
                    Pilihan Jawaban & Kunci:
                  </label>
                  <span className="text-[10px] text-purple-700 font-bold">
                    {formType === 'PG'
                      ? 'Pilih 1 Radio Button untuk Kunci'
                      : 'Centang Checkbox untuk Kunci (Bisa Lebih Dari Satu)'}
                  </span>
                </div>

                {formOptions.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isChecked =
                    formType === 'PG'
                      ? formCorrectSingle === idx
                      : formCorrectMulti.includes(idx);

                  const toggleMulti = () => {
                    if (formCorrectMulti.includes(idx)) {
                      setFormCorrectMulti(formCorrectMulti.filter((i) => i !== idx));
                    } else {
                      setFormCorrectMulti([...formCorrectMulti, idx].sort((a, b) => a - b));
                    }
                  };

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                        isChecked ? 'bg-emerald-50 border border-emerald-300' : 'bg-white/70 border border-gray-200'
                      }`}
                    >
                      {/* Key selector button */}
                      {formType === 'PG' ? (
                        <button
                          type="button"
                          onClick={() => setFormCorrectSingle(idx)}
                          className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                            isChecked ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {letter}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={toggleMulti}
                          className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                            isChecked ? 'bg-purple-700 text-white shadow-xs' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {isChecked ? '✓' : letter}
                        </button>
                      )}

                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[idx] = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Pilihan ${letter}`}
                        className="w-full bg-transparent text-xs text-gray-800 focus:outline-none"
                        required
                      />

                      {isChecked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                          Kunci Benar
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* The King Formula & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-amber-900 flex items-center gap-1 mb-1">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Metode THE KING (Trik Kilat):</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formTheKing}
                    onChange={(e) => setFormTheKing(e.target.value)}
                    placeholder="Rumus cepat atau jembatan keledai untuk menyelesaikan soal dalam 15 detik..."
                    className="w-full p-2 rounded-xl neu-inset text-xs text-amber-950"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Solusi Konvensional / Pembahasan Rinci:
                  </label>
                  <textarea
                    rows={2}
                    value={formConventional}
                    onChange={(e) => setFormConventional(e.target.value)}
                    placeholder="Langkah formal matematis atau teoretis..."
                    className="w-full p-2 rounded-xl neu-inset text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* Listening script for English */}
              {formSubject === 'B_INGGRIS' && (
                <div>
                  <label className="text-[11px] font-bold text-blue-900 block mb-1">
                    Skrip Audio Listening (Opsional - TTS Natural):
                  </label>
                  <textarea
                    rows={2}
                    value={formListeningScript}
                    onChange={(e) => setFormListeningScript(e.target.value)}
                    placeholder="Dialog percakapan bahasa Inggris yang akan dibacakan oleh mesin suara..."
                    className="w-full p-2 rounded-xl neu-inset text-xs text-blue-950"
                  />
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C5FE0] hover:bg-blue-700 text-white text-xs font-heading font-bold shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{editingQuestion ? 'Simpan Perubahan' : 'Tambah ke Bank Soal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch AI Generator Modal */}
      <AdminTkaBatchGenerateModal
        isOpen={isBatchModalOpen}
        initialPackageId={batchTargetPkgId}
        onClose={() => setIsBatchModalOpen(false)}
        onSuccess={(msg) => {
          refreshQuestions();
          refreshPackages();
          showToast(msg, 'success');
          onLogActivity?.('BATCH_AI_GENERATE', msg, 'TKA_AI');
        }}
      />

      {/* Excel Import Modal (KaTeX, Validation, Batch Assign) */}
      <AdminTkaExcelImportModal
        isOpen={isExcelImportModalOpen}
        initialPackageId={excelImportTargetPkgId}
        onClose={() => setIsExcelImportModalOpen(false)}
        onSuccess={(msg) => {
          refreshQuestions();
          refreshPackages();
          showToast(msg, 'success');
          onLogActivity?.('EXCEL_IMPORT', msg, 'TKA_EXCEL');
        }}
      />

      {/* PDF Import Modal (AI Extractor, KaTeX, Confidence Badges, Batch Assign) */}
      <AdminTkaPdfImportModal
        isOpen={isPdfImportModalOpen}
        initialPackageId={pdfImportTargetPkgId}
        onClose={() => setIsPdfImportModalOpen(false)}
        onSuccess={(msg) => {
          refreshQuestions();
          refreshPackages();
          showToast(msg, 'success');
          onLogActivity?.('PDF_IMPORT', msg, 'TKA_PDF');
        }}
      />
    </div>
  );
};
