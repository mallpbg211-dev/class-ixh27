import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Layers,
  BookOpen,
  Sparkles,
  CheckSquare,
  Square,
  HelpCircle,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import * as XLSX from 'xlsx';
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
  saveCustomQuestion,
} from './tkaStorage';
import { MathRenderer } from './MathFormulaDisplay';
import { saveExcelWorkbook } from '../../utils/fileDownloader';
import { soundManager } from '../../lib/gameAudio';
import { fireConfetti } from '../../utils/confettiHelper';

interface AdminTkaExcelImportModalProps {
  isOpen: boolean;
  initialPackageId?: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface ParsedValidQuestionItem {
  tempId: string;
  rowNumber: number;
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
  selected: boolean;
  isExpanded: boolean;
  isEditing?: boolean;
}

interface ParsedErrorRowItem {
  rowNumber: number;
  rawMapel: string;
  rawBabId: string;
  rawSoal: string;
  errors: string[];
}

export const AdminTkaExcelImportModal: React.FC<AdminTkaExcelImportModalProps> = ({
  isOpen,
  initialPackageId,
  onClose,
  onSuccess,
}) => {
  // Master Packages & Bank Soal
  const [packages, setPackages] = useState<TryOutPackage[]>([]);
  const [allQuestions, setAllQuestions] = useState<TkaQuestion[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatusMsg, setParseStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parsing Result State
  const [hasParsed, setHasParsed] = useState(false);
  const [validQuestions, setValidQuestions] = useState<ParsedValidQuestionItem[]>([]);
  const [errorRows, setErrorRows] = useState<ParsedErrorRowItem[]>([]);
  const [activeViewTab, setActiveViewTab] = useState<'VALID' | 'ERRORS'>('VALID');

  // Inline Editing State
  const [editingItem, setEditingItem] = useState<ParsedValidQuestionItem | null>(null);

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

      // Reset parsing state jika modal baru dibuka
      setSelectedFile(null);
      setHasParsed(false);
      setValidQuestions([]);
      setErrorRows([]);
      setParseStatusMsg(null);
      setEditingItem(null);
    }
  }, [isOpen, initialPackageId]);

  // Selected package details
  const currentPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId);
  }, [packages, selectedPackageId]);

  // Statistik per sesi untuk paket yang dipilih
  const sessionStats = useMemo(() => {
    if (!currentPackage) return [];
    return currentPackage.sessions.map((sess) => {
      const inBank = allQuestions.filter(
        (q) => q.packageId === currentPackage.id && q.subject === sess.subject
      ).length;
      const explicit = sess.questionIds ? sess.questionIds.length : 0;
      const currentCount = inBank > 0 ? inBank : explicit;
      return {
        subject: sess.subject,
        title: sess.title,
        currentCount,
        target: sess.questionCount || 30,
      };
    });
  }, [currentPackage, allQuestions]);

  // --------------------------------------------------------------------------
  // TUGAS 1: UNDUH TEMPLATE EXCEL DINAMIS
  // --------------------------------------------------------------------------
  const handleDownloadTemplate = async () => {
    try {
      soundManager.playClick();

      // Sheet 1: Template_Soal_TKA dengan 1 baris contoh terisi
      const templateRows = [
        {
          Mapel: 'MATEMATIKA',
          BabId: 'MAT_BAB_1',
          Subtopik: 'Volume Bangun Ruang Sisi Datar',
          Soal: 'Sebuah prisma memiliki luas alas $L_{\\text{alas}} = 24\\text{ cm}^2$ dan tinggi $t = 10\\text{ cm}$. Berapakah volume prisma tersebut?',
          OpsiA: '$120\\text{ cm}^3$',
          OpsiB: '$240\\text{ cm}^3$',
          OpsiC: '$360\\text{ cm}^3$',
          OpsiD: '$480\\text{ cm}^3$',
          JawabanBenar: 'B',
          TrikTheKing: '$V = L_{\\text{alas}} \\times t = 24 \\times 10 = 240\\text{ cm}^3$',
          Pembahasan: 'Volume prisma dihitung dengan rumus $V = L_{\\text{alas}} \\times t$. Substitusi $L_{\\text{alas}} = 24$ dan $t = 10$, sehingga didapat $V = 240\\text{ cm}^3$.',
        },
      ];

      // Sheet 2: Petunjuk Pengisian & Referensi BabId Resmi
      const petunjukRows: Array<{ Kategori: string; Parameter_Valid: string; Keterangan: string }> = [
        {
          Kategori: '1. Format Mapel',
          Parameter_Valid: 'MATEMATIKA, B_INDO, B_INGGRIS, IPA',
          Keterangan: 'Wajib diisi salah satu dari 4 nama mapel ini (huruf kapital).',
        },
        {
          Kategori: '2. Kunci Jawaban',
          Parameter_Valid: 'A, B, C, atau D',
          Keterangan: 'Wajib diisi tepat 1 huruf kapital A, B, C, atau D.',
        },
        {
          Kategori: '3. Rumus LaTeX/KaTeX',
          Parameter_Valid: '$...$ (inline) atau $$...$$ (blok)',
          Keterangan: 'Gunakan tanda $ untuk rumus (misal: $\\frac{a}{b}$, $\\sqrt{x}$, $\\times$). Gunakan \\text{} untuk subscript multi-huruf (contoh: L_{\\text{alas}}).',
        },
        {
          Kategori: '4. Format Opsi',
          Parameter_Valid: 'OpsiA, OpsiB, OpsiC, OpsiD',
          Keterangan: 'Semua 4 opsi wajib terisi teks atau rumus.',
        },
      ];

      // Tambahkan seluruh referensi BabId ke sheet Petunjuk
      TKA_CHAPTERS.forEach((ch) => {
        petunjukRows.push({
          Kategori: `Referensi Bab [${ch.subject}]`,
          Parameter_Valid: ch.id,
          Keterangan: `${ch.number}: ${ch.title} — ${ch.description}`,
        });
      });

      const wb = XLSX.utils.book_new();

      const wsTemplate = XLSX.utils.json_to_sheet(templateRows);
      // Atur lebar kolom sheet 1 agar nyaman dibaca
      wsTemplate['!cols'] = [
        { wch: 14 }, // Mapel
        { wch: 14 }, // BabId
        { wch: 25 }, // Subtopik
        { wch: 45 }, // Soal
        { wch: 18 }, // OpsiA
        { wch: 18 }, // OpsiB
        { wch: 18 }, // OpsiC
        { wch: 18 }, // OpsiD
        { wch: 14 }, // JawabanBenar
        { wch: 35 }, // TrikTheKing
        { wch: 45 }, // Pembahasan
      ];
      XLSX.utils.book_append_sheet(wb, wsTemplate, 'Template_Soal_TKA');

      const wsPetunjuk = XLSX.utils.json_to_sheet(petunjukRows);
      wsPetunjuk['!cols'] = [
        { wch: 22 },
        { wch: 35 },
        { wch: 60 },
      ];
      XLSX.utils.book_append_sheet(wb, wsPetunjuk, 'Petunjuk');

      await saveExcelWorkbook(wb, 'Template_Import_Soal_TKA_SMP.xlsx', 'Unduh Template Soal TKA');
    } catch (err: unknown) {
      console.error('Gagal mengunduh template:', err);
      alert('Gagal mengunduh template: ' + ((err as Error).message || String(err)));
    }
  };

  // --------------------------------------------------------------------------
  // TUGAS 2 & 3: UPLOAD, PARSING & VALIDASI PER BARIS
  // --------------------------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processExcelFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      processExcelFile(file);
    }
  };

  const processExcelFile = async (file: File) => {
    setIsParsing(true);
    setParseStatusMsg('Membaca berkas Excel / Spreadsheet...');
    setHasParsed(false);
    setValidQuestions([]);
    setErrorRows([]);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });

      // Cari sheet pertama yang bukan bernama "Petunjuk"
      let targetSheetName = wb.SheetNames.find(
        (name) => name.toLowerCase().trim() !== 'petunjuk'
      );
      if (!targetSheetName) {
        targetSheetName = wb.SheetNames[0];
      }

      const sheet = wb.Sheets[targetSheetName];
      if (!sheet) {
        throw new Error('Lembar kerja (sheet) tidak ditemukan di dalam berkas.');
      }

      // Parse baris-baris data
      const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
        defval: '',
      });

      if (!rawRows || rawRows.length === 0) {
        throw new Error('Berkas Excel kosong atau tidak memuat baris data.');
      }

      setParseStatusMsg(`Memvalidasi ${rawRows.length} baris data soal...`);

      const validList: ParsedValidQuestionItem[] = [];
      const errorList: ParsedErrorRowItem[] = [];

      const VALID_SUBJECTS: TkaSubject[] = ['IPA', 'B_INDO', 'B_INGGRIS', 'MATEMATIKA'];

      rawRows.forEach((row, idx) => {
        const rowNumber = idx + 2; // Baris 1 = Header Excel

        // 1. Cek apakah seluruh baris kosong -> Skip diam-diam
        const hasAnyContent = Object.values(row).some(
          (val) => String(val ?? '').trim().length > 0
        );
        if (!hasAnyContent) {
          return; // Skip baris kosong
        }

        // Helper ekstraksi kolom dengan fleksibilitas nama kolom
        const getCol = (...keys: string[]): string => {
          for (const k of keys) {
            for (const rowKey of Object.keys(row)) {
              if (rowKey.toLowerCase().replace(/[\s_-]/g, '') === k.toLowerCase().replace(/[\s_-]/g, '')) {
                return String(row[rowKey] ?? '').trim();
              }
            }
          }
          return '';
        };

        const rawMapel = getCol('Mapel', 'MataPelajaran', 'Mata_Pelajaran', 'Subject');
        const rawBabId = getCol('BabId', 'Bab_Id', 'Bab', 'ChapterId', 'Chapter_Id');
        const rawSubtopic = getCol('Subtopik', 'Sub_Topik', 'Subtopic');
        const rawSoal = getCol('Soal', 'Pertanyaan', 'Question');
        const rawOpsiA = getCol('OpsiA', 'Opsi_A', 'PilihanA', 'Pilihan_A', 'A');
        const rawOpsiB = getCol('OpsiB', 'Opsi_B', 'PilihanB', 'Pilihan_B', 'B');
        const rawOpsiC = getCol('OpsiC', 'Opsi_C', 'PilihanC', 'Pilihan_C', 'C');
        const rawOpsiD = getCol('OpsiD', 'Opsi_D', 'PilihanD', 'Pilihan_D', 'D');
        const rawJawaban = getCol('JawabanBenar', 'Jawaban_Benar', 'KunciJawaban', 'Kunci_Jawaban', 'Kunci', 'Jawaban');
        const rawTheKing = getCol('TrikTheKing', 'Trik_The_King', 'RumusTheKing', 'Rumus_The_King', 'TheKingFormula');
        const rawPembahasan = getCol('Pembahasan', 'SolusiKonvensional', 'Solusi_Konvensional', 'Pembahasan_Soal', 'Penjelasan');

        const rowErrors: string[] = [];

        // Validasi 1: Mapel
        let normalizedSubject: TkaSubject | null = null;
        const upperMapel = rawMapel.toUpperCase();
        if (VALID_SUBJECTS.includes(upperMapel as TkaSubject)) {
          normalizedSubject = upperMapel as TkaSubject;
        } else if (upperMapel.includes('INDO')) {
          normalizedSubject = 'B_INDO';
        } else if (upperMapel.includes('INGG') || upperMapel.includes('ENG')) {
          normalizedSubject = 'B_INGGRIS';
        } else if (upperMapel.includes('MAT') || upperMapel.includes('MTK')) {
          normalizedSubject = 'MATEMATIKA';
        } else if (upperMapel.includes('IPA') || upperMapel.includes('SAINS')) {
          normalizedSubject = 'IPA';
        }

        if (!normalizedSubject) {
          rowErrors.push(
            `Mapel tidak valid ('${rawMapel || 'KOSONG'}'). Wajib diisi salah satu: MATEMATIKA, B_INDO, B_INGGRIS, atau IPA.`
          );
        }

        // Validasi 2: BabId
        let matchedChapter = TKA_CHAPTERS.find(
          (c) => c.id.toUpperCase() === rawBabId.toUpperCase()
        );

        if (!matchedChapter && normalizedSubject) {
          // Coba fallback matching nomor bab atau judul jika admin mengisi "Bab 1"
          matchedChapter = TKA_CHAPTERS.find(
            (c) =>
              c.subject === normalizedSubject &&
              (c.id.toLowerCase().includes(rawBabId.toLowerCase()) ||
                c.title.toLowerCase().includes(rawBabId.toLowerCase()) ||
                String(c.number).toLowerCase().includes(rawBabId.toLowerCase()))
          );
        }

        if (!rawBabId) {
          rowErrors.push('Kolom BabId kosong. Lihat sheet Petunjuk untuk daftar BabId resmi.');
        } else if (!matchedChapter) {
          rowErrors.push(
            `BabId '${rawBabId}' tidak ditemukan di daftar bab resmi. Lihat sheet Petunjuk untuk referensi ID yang valid.`
          );
        } else if (normalizedSubject && matchedChapter.subject !== normalizedSubject) {
          rowErrors.push(
            `BabId '${rawBabId}' terdaftar untuk mapel ${matchedChapter.subject}, tidak cocok dengan kolom Mapel '${normalizedSubject}'.`
          );
        }

        // Validasi 3: Teks Soal
        if (!rawSoal) {
          rowErrors.push('Teks Soal tidak boleh kosong.');
        }

        // Validasi 4: Opsi A, B, C, D
        if (!rawOpsiA || !rawOpsiB || !rawOpsiC || !rawOpsiD) {
          const missingOpts: string[] = [];
          if (!rawOpsiA) missingOpts.push('A');
          if (!rawOpsiB) missingOpts.push('B');
          if (!rawOpsiC) missingOpts.push('C');
          if (!rawOpsiD) missingOpts.push('D');
          rowErrors.push(`Pilihan jawaban opsi [${missingOpts.join(', ')}] tidak boleh kosong.`);
        }

        // Validasi 5: JawabanBenar (A, B, C, atau D)
        const cleanKey = rawJawaban.toUpperCase().trim();
        const validKeyLetters = ['A', 'B', 'C', 'D'];
        let answerIndex = -1;

        if (validKeyLetters.includes(cleanKey)) {
          answerIndex = cleanKey.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        } else {
          rowErrors.push(
            `JawabanBenar wajib satu huruf: A, B, C, atau D. Ditemukan '${rawJawaban || 'KOSONG'}'.`
          );
        }

        // Jika ada error pada baris ini, masukkan ke errorList
        if (rowErrors.length > 0 || !normalizedSubject || !matchedChapter || answerIndex === -1) {
          errorList.push({
            rowNumber,
            rawMapel: rawMapel || '-',
            rawBabId: rawBabId || '-',
            rawSoal: rawSoal ? (rawSoal.length > 80 ? rawSoal.slice(0, 80) + '...' : rawSoal) : '(Teks soal kosong)',
            errors: rowErrors,
          });
        } else {
          // Baris Valid -> Tambahkan ke validList
          const finalChapterName = `${matchedChapter.number}: ${matchedChapter.title}`;
          validList.push({
            tempId: `XLS_${normalizedSubject}_${Date.now()}_${rowNumber}`,
            rowNumber,
            subject: normalizedSubject,
            chapterId: matchedChapter.id,
            chapterName: finalChapterName,
            subtopic: rawSubtopic || matchedChapter.title,
            question: rawSoal,
            options: [rawOpsiA, rawOpsiB, rawOpsiC, rawOpsiD],
            correctAnswer: answerIndex,
            correctAnswers: [answerIndex],
            theKingFormula: rawTheKing || 'Analisis teliti kata kunci pada pertanyaan dan sesuaikan dengan kaidah materi.',
            conventionalSolution: rawPembahasan || 'Selesaikan langkah demi langkah sesuai konsep materi.',
            selected: true,
            isExpanded: false,
            isEditing: false,
          });
        }
      });

      setValidQuestions(validList);
      setErrorRows(errorList);
      setHasParsed(true);
      setActiveViewTab(validList.length > 0 ? 'VALID' : 'ERRORS');

      if (validList.length > 0) {
        soundManager.playCorrect();
      } else {
        soundManager.playWrong();
      }
    } catch (err: unknown) {
      console.error('Gagal memproses Excel:', err);
      setParseStatusMsg('Terjadi kesalahan saat memproses berkas Excel.');
      alert('Gagal memproses berkas: ' + ((err as Error).message || String(err)));
    } finally {
      setIsParsing(false);
    }
  };

  // --------------------------------------------------------------------------
  // LIST ACTIONS: TOGGLE SELECTION, EXPAND, DELETE, EDIT
  // --------------------------------------------------------------------------
  const handleToggleSelect = (tempId: string) => {
    soundManager.playClick();
    setValidQuestions((prev) =>
      prev.map((q) => (q.tempId === tempId ? { ...q, selected: !q.selected } : q))
    );
  };

  const handleSelectAll = (select: boolean) => {
    soundManager.playClick();
    setValidQuestions((prev) => prev.map((q) => ({ ...q, selected: select })));
  };

  const handleToggleExpand = (tempId: string) => {
    setValidQuestions((prev) =>
      prev.map((q) => (q.tempId === tempId ? { ...q, isExpanded: !q.isExpanded } : q))
    );
  };

  const handleDeleteItem = (tempId: string) => {
    soundManager.playClick();
    setValidQuestions((prev) => prev.filter((q) => q.tempId !== tempId));
  };

  // Inline Edit Item
  const handleStartEdit = (item: ParsedValidQuestionItem) => {
    soundManager.playClick();
    setEditingItem({ ...item, options: [...item.options] });
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
    setValidQuestions((prev) =>
      prev.map((q) => (q.tempId === editingItem.tempId ? { ...editingItem, isEditing: false } : q))
    );
    setEditingItem(null);
  };

  // --------------------------------------------------------------------------
  // TUGAS 4: FINAL COMMIT IMPORT KE BANK SOAL & PAKET
  // --------------------------------------------------------------------------
  const selectedValidQuestions = useMemo(() => {
    return validQuestions.filter((q) => q.selected);
  }, [validQuestions]);

  const handleCommitImport = () => {
    if (selectedValidQuestions.length === 0) {
      alert('Pilih setidaknya 1 soal yang valid untuk diimpor.');
      return;
    }

    try {
      soundManager.playCorrect();

      const questionsToSave: TkaQuestion[] = selectedValidQuestions.map((item, idx) => {
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
          source: 'ADMIN',
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
        `Berhasil mengimpor ${questionsToSave.length} butir soal dari Excel ke "${pkgTitle}"!`
      );
      onClose();
    } catch (err: unknown) {
      console.error('Gagal menyimpan hasil import:', err);
      alert('Gagal menyimpan soal: ' + ((err as Error).message || String(err)));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="neu-flat rounded-3xl bg-[#E7EBF5] border border-white/90 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* ================= HEADER ================= */}
        <div className="p-4 sm:p-5 border-b border-white/80 flex items-center justify-between gap-3 shrink-0 bg-[#E7EBF5]/95">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1F3A5F] flex items-center gap-2">
                <span>Import Soal TOBK dari Excel</span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-extrabold tracking-wider uppercase border border-emerald-200/80">
                  KaTeX &amp; HOTS Ready
                </span>
              </h3>
              <p className="text-xs text-[#5C6F84]">
                Unggah berkas Excel (.xlsx / .xls / .csv) untuk mengimpor puluhan butir soal sekaligus.
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
          {/* STEP 1: DOWNLOAD TEMPLATE & UPLOAD BOX */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Box Unduh Template */}
            <div className="neu-pressed rounded-2xl p-4 bg-[#DFE5F2] border border-white/60 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#1F3A5F]">
                  <Download className="w-4 h-4 text-[#1C5FE0]" />
                  <span>1. Unduh Template Excel</span>
                </div>
                <p className="text-[11px] text-[#5C6F84] leading-relaxed">
                  Format resmi dengan header standar, contoh rumus KaTeX ($...$), dan sheet petunjuk BabId.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-blue-50 text-[#1C5FE0] border border-blue-200/80 text-xs font-heading font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-98"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Template .XLSX</span>
              </button>
            </div>

            {/* Box Upload & Dropzone */}
            <div className="md:col-span-2">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`neu-pressed rounded-2xl p-4 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[120px] ${
                  isDragging
                    ? 'border-[#1C5FE0] bg-blue-50/80 scale-[0.99]'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/50'
                    : 'border-gray-300 hover:border-[#1C5FE0] bg-[#DFE5F2]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`p-2 rounded-xl ${
                      selectedFile ? 'bg-emerald-600 text-white' : 'bg-white text-[#1C5FE0]'
                    } shadow-xs`}
                  >
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-heading font-extrabold text-[#1F3A5F]">
                      {selectedFile ? selectedFile.name : '2. Pilih atau Seret File Excel ke Sini'}
                    </span>
                    <p className="text-[11px] text-[#5C6F84]">
                      {selectedFile
                        ? `Ukuran: ${(selectedFile.size / 1024).toFixed(1)} KB — Klik untuk ganti file`
                        : 'Mendukung format .xlsx, .xls, dan .csv'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATUS PARSING LOADING */}
          {isParsing && (
            <div className="neu-flat rounded-2xl p-4 bg-blue-50 border border-blue-200 text-center space-y-2 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-sm font-heading font-bold text-[#1C5FE0]">
                <FileUp className="w-4 h-4 animate-spin" />
                <span>{parseStatusMsg || 'Memproses berkas Excel...'}</span>
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW SCREEN (SETELAH PARSING) */}
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

              {/* TABS: VALID VS ERRORS */}
              <div className="flex items-center justify-between gap-2 border-b border-gray-300 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveViewTab('VALID');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeViewTab === 'VALID'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Siap Diimpor ({validQuestions.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveViewTab('ERRORS');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeViewTab === 'ERRORS'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : errorRows.length > 0
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 animate-bounce'
                        : 'bg-white text-gray-500 border border-gray-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Gagal Dibaca ({errorRows.length})</span>
                  </button>
                </div>

                {activeViewTab === 'VALID' && validQuestions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectAll(true)}
                      className="text-[11px] font-bold text-[#1C5FE0] hover:underline cursor-pointer"
                    >
                      Pilih Semua
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      onClick={() => handleSelectAll(false)}
                      className="text-[11px] font-bold text-[#5C6F84] hover:underline cursor-pointer"
                    >
                      Batal Semua
                    </button>
                  </div>
                )}
              </div>

              {/* TAB CONTENT 1: VALID QUESTIONS */}
              {activeViewTab === 'VALID' && (
                <div className="space-y-3">
                  {validQuestions.length === 0 ? (
                    <div className="p-8 text-center neu-pressed rounded-2xl bg-[#DFE5F2] border border-white/60 text-[#5C6F84] space-y-2">
                      <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                      <p className="text-sm font-bold">Tidak ada soal yang valid untuk diimpor.</p>
                      <p className="text-xs">
                        Silakan periksa tab &quot;Gagal Dibaca&quot; untuk melihat baris yang perlu diperbaiki pada berkas Excel.
                      </p>
                    </div>
                  ) : (
                    validQuestions.map((item, idx) => {
                      const isEditingThis = editingItem?.tempId === item.tempId;

                      return (
                        <div
                          key={item.tempId}
                          className={`neu-flat rounded-2xl p-4 border transition-all ${
                            item.selected
                              ? 'bg-[#E7EBF5] border-emerald-300'
                              : 'bg-gray-100/70 border-gray-300 opacity-60'
                          }`}
                        >
                          {/* Item Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 flex-1">
                              <button
                                type="button"
                                onClick={() => handleToggleSelect(item.tempId)}
                                className="mt-0.5 text-[#1C5FE0] cursor-pointer hover:scale-110 transition-transform shrink-0"
                              >
                                {item.selected ? (
                                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <Square className="w-5 h-5 text-gray-400" />
                                )}
                              </button>

                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-black font-heading px-2 py-0.5 rounded-lg bg-white text-[#1F3A5F] border border-gray-200">
                                    No. {idx + 1} (Baris Excel {item.rowNumber})
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                                    {item.subject}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                                    {item.chapterName}
                                  </span>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    Kunci: {String.fromCharCode(65 + item.correctAnswer)}
                                  </span>
                                </div>

                                {/* Preview Question Text with KaTeX */}
                                {!isEditingThis && (
                                  <div className="text-xs sm:text-sm font-medium text-[#1F3A5F] pt-1 leading-relaxed">
                                    <MathRenderer content={item.question} />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Item Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  isEditingThis ? setEditingItem(null) : handleStartEdit(item)
                                }
                                className="p-1.5 rounded-lg bg-white hover:bg-blue-50 text-[#1C5FE0] border border-blue-200 text-xs shadow-2xs cursor-pointer"
                                title="Edit Soal Inline"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.tempId)}
                                className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs shadow-2xs cursor-pointer"
                                title="Hapus dari Impor"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleExpand(item.tempId)}
                                className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 text-xs shadow-2xs cursor-pointer"
                                title={item.isExpanded ? 'Tutup Detail' : 'Buka Detail Opsi & Pembahasan'}
                              >
                                {item.isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* INLINE EDIT FORM */}
                          {isEditingThis && editingItem && (
                            <div className="mt-3 p-3.5 rounded-xl bg-white border border-blue-200 space-y-3 animate-fade-in text-xs">
                              <div>
                                <label className="font-bold text-gray-700 block mb-1">
                                  Teks Pertanyaan Soal (Mendukung KaTeX $...$):
                                </label>
                                <textarea
                                  value={editingItem.question}
                                  onChange={(e) =>
                                    setEditingItem({ ...editingItem, question: e.target.value })
                                  }
                                  className="w-full p-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1C5FE0] outline-none"
                                  rows={2}
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {editingItem.options.map((opt, optIdx) => (
                                  <div key={optIdx} className="space-y-0.5">
                                    <label className="font-bold text-gray-600 text-[11px]">
                                      Opsi {String.fromCharCode(65 + optIdx)}:
                                    </label>
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => {
                                        const newOpts = [...editingItem.options];
                                        newOpts[optIdx] = e.target.value;
                                        setEditingItem({ ...editingItem, options: newOpts });
                                      }}
                                      className="w-full p-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#1C5FE0] outline-none"
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center gap-3">
                                <label className="font-bold text-gray-700">Kunci Jawaban:</label>
                                <div className="flex items-center gap-2">
                                  {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                                    <label
                                      key={letter}
                                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                                        editingItem.correctAnswer === optIdx
                                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`editKey_${editingItem.tempId}`}
                                        checked={editingItem.correctAnswer === optIdx}
                                        onChange={() =>
                                          setEditingItem({
                                            ...editingItem,
                                            correctAnswer: optIdx,
                                            correctAnswers: [optIdx],
                                          })
                                        }
                                        className="hidden"
                                      />
                                      {letter}
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => setEditingItem(null)}
                                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                                >
                                  Batal
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSaveInlineEdit}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Simpan Perubahan</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* EXPANDED DETAILS (OPTIONS & SOLUTION) */}
                          {item.isExpanded && !isEditingThis && (
                            <div className="mt-3 pt-3 border-t border-white/80 space-y-2.5 text-xs">
                              {/* 4 Options Preview */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.options.map((opt, optIdx) => {
                                  const isCorrect = item.correctAnswer === optIdx;
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`p-2 rounded-xl border text-xs flex items-start gap-2 ${
                                        isCorrect
                                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                          : 'bg-white/70 border-gray-200 text-gray-700'
                                      }`}
                                    >
                                      <span
                                        className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                          isCorrect
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                        }`}
                                      >
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <div className="flex-1">
                                        <MathRenderer content={opt} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* The King Formula & Solution */}
                              <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] space-y-1">
                                <span className="font-extrabold text-amber-900 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
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
              )}

              {/* TAB CONTENT 2: ERROR ROWS */}
              {activeViewTab === 'ERRORS' && (
                <div className="space-y-3">
                  {errorRows.length === 0 ? (
                    <div className="p-8 text-center neu-pressed rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <p className="text-sm font-bold">Semua baris terbaca sempurna tanpa error!</p>
                      <p className="text-xs">
                        Tidak ada baris data yang ditolak. Anda dapat langsung mengimpor seluruh soal yang ada.
                      </p>
                    </div>
                  ) : (
                    errorRows.map((errItem) => (
                      <div
                        key={errItem.rowNumber}
                        className="neu-flat rounded-2xl p-4 bg-rose-50/90 border border-rose-300 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="font-heading font-black text-rose-900 px-2 py-0.5 rounded-md bg-rose-200 border border-rose-300">
                            Baris Excel {errItem.rowNumber}
                          </span>
                          <span className="text-[11px] font-bold text-rose-700">
                            Mapel: {errItem.rawMapel} | BabId: {errItem.rawBabId}
                          </span>
                        </div>

                        <p className="text-gray-700 italic text-[11px] bg-white/70 p-2 rounded-lg border border-rose-200">
                          &quot;{errItem.rawSoal}&quot;
                        </p>

                        <div className="space-y-1 pt-1">
                          <span className="font-bold text-rose-800 block text-[11px]">
                            Daftar Masalah yang Ditemukan:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-rose-700 text-[11px] font-medium">
                            {errItem.errors.map((err, errIdx) => (
                              <li key={errIdx}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
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
                dari {validQuestions.length} soal valid terpilih untuk diimpor
              </span>
            ) : (
              <span>Unggah berkas Excel di atas untuk memulai verifikasi soal.</span>
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
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white cursor-pointer active:scale-98'
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
    </div>
  );
};
