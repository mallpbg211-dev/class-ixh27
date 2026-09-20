import {
  TkaQuestion,
  TryOutPackage,
  TryOutHistoryRecord,
  LeaderboardStudent,
  ChapterEvaluation,
  TkaSubject,
} from './tkaTypes';
import { INITIAL_TKA_QUESTIONS, TKA_CHAPTERS, getQuestionsForSubject } from './tkaChaptersData';
import {
  SMPN1_BOJONGSARI_BINDO_QUESTIONS,
  SMPN1_BOJONGSARI_PACKAGE,
  SMPN1_BOJONGSARI_MTK_QUESTIONS,
  SMPN1_BOJONGSARI_MTK_PACKAGE,
} from './smpn1BojongsariData';
import { INITIAL_STUDENTS } from '../../data/classData';
import {
  saveTkaQuestionToFirestore,
  saveTkaQuestionsBatchToFirestore,
  deleteTkaQuestionFromFirestore,
  saveTkaPackageToFirestore,
  deleteTkaPackageFromFirestore,
  saveTkaResultToFirestore,
  subscribeTkaResults,
  subscribeTkaQuestions,
  subscribeTkaPackages,
} from '../../lib/firebase';
import { Student } from '../../types';

// Available Try Out Packages
export const TRY_OUT_PACKAGES: TryOutPackage[] = [
  SMPN1_BOJONGSARI_MTK_PACKAGE,
  SMPN1_BOJONGSARI_PACKAGE,
  {
    id: 'TO_PAKET_1',
    title: 'Paket TOBK 1 — Simulasi Akbar Masuk SMA/SMK Negeri',
    tag: 'Standar Nasional',
    description: 'Format komprehensif 4 sesi (IPA, B. Indo, B. Inggris, Matematika), 30 soal per sesi dengan timer mandiri.',
    totalQuestions: 120,
    sessions: [
      { subject: 'IPA', title: 'Sesi 1: Ilmu Pengetahuan Alam', durationMinutes: 35, questionCount: 30 },
      { subject: 'B_INDO', title: 'Sesi 2: Literasi Bahasa Indonesia', durationMinutes: 30, questionCount: 30 },
      { subject: 'B_INGGRIS', title: 'Sesi 3: Bahasa Inggris (3 Skills + Listening)', durationMinutes: 30, questionCount: 30 },
      { subject: 'MATEMATIKA', title: 'Sesi 4: Penalaran Matematika', durationMinutes: 40, questionCount: 30 },
    ],
  },
  {
    id: 'TO_PAKET_2',
    title: 'Paket TOBK 2 — Asesmen TKA Semester Genap',
    tag: 'Prediksi UTBK SMP',
    description: 'Fokus pada materi esensial semester genap dengan variasi soal berbasis analisis kontekstual.',
    totalQuestions: 120,
    sessions: [
      { subject: 'IPA', title: 'Sesi 1: Ilmu Pengetahuan Alam', durationMinutes: 35, questionCount: 30 },
      { subject: 'B_INDO', title: 'Sesi 2: Literasi Bahasa Indonesia', durationMinutes: 30, questionCount: 30 },
      { subject: 'B_INGGRIS', title: 'Sesi 3: Bahasa Inggris (3 Skills + Listening)', durationMinutes: 30, questionCount: 30 },
      { subject: 'MATEMATIKA', title: 'Sesi 4: Penalaran Matematika', durationMinutes: 40, questionCount: 30 },
    ],
  },
  {
    id: 'TO_PAKET_KILAT',
    title: 'Paket TOBK Kilat — Sprint 40 Soal (10 Soal/Sesi)',
    tag: 'Cepat & Intensif',
    description: 'Cocok untuk latihan simulasi cepat di sela-sela jam istirahat atau malam hari (10 soal per mapel).',
    totalQuestions: 40,
    sessions: [
      { subject: 'IPA', title: 'Sesi 1: IPA Kilat', durationMinutes: 12, questionCount: 10 },
      { subject: 'B_INDO', title: 'Sesi 2: B. Indo Kilat', durationMinutes: 10, questionCount: 10 },
      { subject: 'B_INGGRIS', title: 'Sesi 3: B. Inggris Kilat', durationMinutes: 10, questionCount: 10 },
      { subject: 'MATEMATIKA', title: 'Sesi 4: Matematika Kilat', durationMinutes: 15, questionCount: 10 },
    ],
  },
];

// Active Session state persistence for Auto-save
export interface ActiveTryOutSessionData {
  packageId: string;
  currentSessionIndex: number; // 0, 1, 2, 3
  sessionStartTime: number; // Date.now() timestamp
  sessionDurationMinutes: number;
  userAnswers: Record<string, number | number[]>; // questionId -> answer index (0..3) or number[] for PGK
  doubtfulIds: string[];
  completedSessions: {
    subject: TkaSubject;
    answers: Record<string, number | number[]>;
    timeSpentSeconds: number;
    lockedAt: number;
  }[];
}

const STORAGE_ACTIVE_TO = 'ixh_tka_active_session';
const STORAGE_HISTORY = 'ixh_tka_history';
const STORAGE_BANK_QUESTIONS_V2 = 'ixh_tka_bank_questions_v2';
const STORAGE_CUSTOM_QUESTIONS = 'ixh_tka_custom_questions';
const STORAGE_CUSTOM_PACKAGES = 'ixh_tka_custom_packages';
const STORAGE_LEADERBOARD_ENABLED = 'ixh_tka_leaderboard_enabled';

export function getDefaultQuestions(): TkaQuestion[] {
  return [
    ...SMPN1_BOJONGSARI_MTK_QUESTIONS,
    ...SMPN1_BOJONGSARI_BINDO_QUESTIONS,
    ...INITIAL_TKA_QUESTIONS,
  ];
}

// Load all questions (defaults + custom/imported questions)
export function loadAllQuestions(): TkaQuestion[] {
  const defaults = getDefaultQuestions();
  try {
    const saved = localStorage.getItem(STORAGE_BANK_QUESTIONS_V2);
    if (saved) {
      const parsed: TkaQuestion[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-merge new default questions (e.g. SMPN 1 Bojongsari MTK) if not yet in saved cache
        const existingIds = new Set(parsed.map((q) => q.id));
        const missingDefaults = defaults.filter((q) => !existingIds.has(q.id));
        if (missingDefaults.length > 0) {
          const merged = [...missingDefaults, ...parsed];
          localStorage.setItem(STORAGE_BANK_QUESTIONS_V2, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    }
    // Backward compatibility with legacy custom questions
    const legacySaved = localStorage.getItem(STORAGE_CUSTOM_QUESTIONS);
    if (legacySaved) {
      const parsedLegacy: TkaQuestion[] = JSON.parse(legacySaved);
      if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
        const merged = [...parsedLegacy, ...defaults];
        localStorage.setItem(STORAGE_BANK_QUESTIONS_V2, JSON.stringify(merged));
        return merged;
      }
    }
  } catch {
    // fallback
  }
  try {
    localStorage.setItem(STORAGE_BANK_QUESTIONS_V2, JSON.stringify(defaults));
  } catch {}
  return defaults;
}

export function saveAllQuestions(questions: TkaQuestion[]): void {
  try {
    localStorage.setItem(STORAGE_BANK_QUESTIONS_V2, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save bank questions:', err);
  }
}

export function saveCustomQuestion(question: TkaQuestion): void {
  const all = loadAllQuestions();
  const existingIdx = all.findIndex((q) => q.id === question.id);
  if (existingIdx >= 0) {
    all[existingIdx] = question;
  } else {
    all.unshift(question);
  }
  saveAllQuestions(all);
  saveTkaQuestionToFirestore(question).catch((err) => {
    console.warn('[TKA Storage] Gagal sync soal ke Firestore:', err);
  });
}

export function saveCustomQuestionsBatch(questions: TkaQuestion[]): void {
  const all = loadAllQuestions();
  const newIds = new Set(questions.map((q) => q.id));
  const filteredExisting = all.filter((q) => !newIds.has(q.id));
  saveAllQuestions([...questions, ...filteredExisting]);
  saveTkaQuestionsBatchToFirestore(questions).catch((err) => {
    console.warn('[TKA Storage] Gagal sync batch soal ke Firestore:', err);
  });
}

export function updateTkaQuestion(question: TkaQuestion): void {
  const all = loadAllQuestions();
  const idx = all.findIndex((q) => q.id === question.id);
  if (idx >= 0) {
    all[idx] = question;
    saveAllQuestions(all);
  } else {
    saveCustomQuestion(question);
  }
  saveTkaQuestionToFirestore(question).catch((err) => {
    console.warn('[TKA Storage] Gagal sync update soal ke Firestore:', err);
  });
}

export function deleteTkaQuestion(id: string): void {
  const all = loadAllQuestions();
  const updated = all.filter((q) => q.id !== id);
  saveAllQuestions(updated);
  deleteTkaQuestionFromFirestore(id).catch((err) => {
    console.warn('[TKA Storage] Gagal sync hapus soal ke Firestore:', err);
  });
}

export function resetTkaQuestionsToDefault(): TkaQuestion[] {
  const defaults = getDefaultQuestions();
  saveAllQuestions(defaults);
  return defaults;
}

// Packages management
export function loadAllTryOutPackages(): TryOutPackage[] {
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_PACKAGES);
    if (saved) {
      const parsed: TryOutPackage[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const customIds = new Set(parsed.map((p) => p.id));
        const nonOverriddenDefaults = TRY_OUT_PACKAGES.filter((p) => !customIds.has(p.id));
        return [...parsed, ...nonOverriddenDefaults];
      }
    }
  } catch {}
  return TRY_OUT_PACKAGES;
}

export function saveCustomTryOutPackage(pkg: TryOutPackage): void {
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_PACKAGES);
    const list: TryOutPackage[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((p) => p.id === pkg.id);
    if (idx >= 0) {
      list[idx] = pkg;
    } else {
      list.unshift(pkg);
    }
    localStorage.setItem(STORAGE_CUSTOM_PACKAGES, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save tryout package:', err);
  }
  saveTkaPackageToFirestore(pkg).catch((err) => {
    console.warn('[TKA Storage] Gagal sync paket ke Firestore:', err);
  });
}

export function deleteCustomTryOutPackage(id: string): void {
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_PACKAGES);
    if (saved) {
      const list: TryOutPackage[] = JSON.parse(saved);
      const filtered = list.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_CUSTOM_PACKAGES, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Failed to delete tryout package:', err);
  }
  deleteTkaPackageFromFirestore(id).catch((err) => {
    console.warn('[TKA Storage] Gagal hapus paket di Firestore:', err);
  });
}

// Active session auto-save
export function saveActiveTryOutSession(data: ActiveTryOutSessionData): void {
  try {
    localStorage.setItem(STORAGE_ACTIVE_TO, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to auto-save active tryout session:', err);
  }
}

export function loadActiveTryOutSession(): ActiveTryOutSessionData | null {
  try {
    const saved = localStorage.getItem(STORAGE_ACTIVE_TO);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return null;
}

export function clearActiveTryOutSession(): void {
  try {
    localStorage.removeItem(STORAGE_ACTIVE_TO);
  } catch {
    // fallback
  }
}

// Student identity helper
const STORAGE_MY_STUDENT_ID = 'ixh_my_student_id';

export function getMyStudentId(): number {
  try {
    const saved = localStorage.getItem(STORAGE_MY_STUDENT_ID);
    if (saved) {
      const num = Number(saved);
      if (!isNaN(num) && num >= 1 && num <= 32) return num;
    }
  } catch {}
  return 1;
}

export function setMyStudentId(id: number): void {
  try {
    localStorage.setItem(STORAGE_MY_STUDENT_ID, String(id));
  } catch {}
}

// History persistence (localStorage cache + Firestore durable)
export function loadTryOutHistory(): TryOutHistoryRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_HISTORY);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return [];
}

export function saveTryOutResult(record: TryOutHistoryRecord): void {
  try {
    const history = loadTryOutHistory();
    history.unshift(record);
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
    clearActiveTryOutSession();
  } catch (err) {
    console.error('Failed to save tryout history to localStorage:', err);
  }

  // Wajib simpan ke Firestore
  saveTkaResultToFirestore(record).catch((err) => {
    console.error('[TKA Storage] Gagal menyimpan riwayat ke Firestore:', err);
  });
}

// Real-time Firestore Sync helper
export function initTkaFirestoreSync(onResultsUpdate?: (results: TryOutHistoryRecord[]) => void): () => void {
  const unsubResults = subscribeTkaResults((results) => {
    if (Array.isArray(results) && results.length > 0) {
      try {
        localStorage.setItem(STORAGE_HISTORY, JSON.stringify(results));
      } catch {}
      if (onResultsUpdate) onResultsUpdate(results);
    }
  });

  const unsubQuestions = subscribeTkaQuestions((questions) => {
    if (Array.isArray(questions) && questions.length > 0) {
      try {
        const current = loadAllQuestions();
        const firestoreIds = new Set(questions.map((q) => q.id));
        const nonFirestore = current.filter((q) => !firestoreIds.has(q.id));
        const merged = [...questions, ...nonFirestore];
        localStorage.setItem(STORAGE_BANK_QUESTIONS_V2, JSON.stringify(merged));
      } catch {}
    }
  });

  const unsubPackages = subscribeTkaPackages((packages) => {
    if (Array.isArray(packages) && packages.length > 0) {
      try {
        localStorage.setItem(STORAGE_CUSTOM_PACKAGES, JSON.stringify(packages));
      } catch {}
    }
  });

  return () => {
    unsubResults();
    unsubQuestions();
    unsubPackages();
  };
}

// Leaderboard Admin Toggle
export function isLeaderboardEnabled(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_LEADERBOARD_ENABLED);
    if (val === null) return true; // Enabled by default
    return val === 'true';
  } catch {
    return true;
  }
}

export function setLeaderboardEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_LEADERBOARD_ENABLED, String(enabled));
  } catch {
    // fallback
  }
}

// Leaderboard calculation based on history + 32 Class Students
export function getLeaderboardData(customHistory?: TryOutHistoryRecord[], customStudents?: Student[]): LeaderboardStudent[] {
  const history = customHistory && Array.isArray(customHistory) ? customHistory : loadTryOutHistory();
  const baseStudents = customStudents && Array.isArray(customStudents) && customStudents.length > 0 ? customStudents : INITIAL_STUDENTS;

  // Create real scores map aggregated by studentId from all tryout results in Firestore
  const studentScores: Record<number, { scores: number[]; lastDate: string }> = {};

  history.forEach((rec) => {
    const sid = rec.studentId || 1;
    if (!studentScores[sid]) {
      studentScores[sid] = { scores: [], lastDate: rec.date };
    }
    studentScores[sid].scores.push(rec.totalScore1000);
  });

  const result: (LeaderboardStudent & { hasRealData: boolean })[] = baseStudents.map((st, idx) => {
    const realData = studentScores[st.id];
    if (realData && realData.scores.length > 0) {
      const highest = Math.max(...realData.scores);
      const avg = Math.round(realData.scores.reduce((a, b) => a + b, 0) / realData.scores.length);
      return {
        studentId: st.id,
        name: st.name,
        avatarUrl: st.avatarUrl,
        dreamSchool: st.dreamSchool,
        tryOutCount: realData.scores.length,
        highestScore: highest,
        averageScore: avg,
        lastTryOutDate: realData.lastDate,
        hasRealData: true,
      };
    }

    // Benchmark sample score for initial excitement if student hasn't taken a test yet
    const mockHighest = Math.max(500, 850 - idx * 20);
    const mockAvg = Math.round(mockHighest - 25);
    return {
      studentId: st.id,
      name: st.name,
      avatarUrl: st.avatarUrl,
      dreamSchool: st.dreamSchool,
      tryOutCount: 0,
      highestScore: mockHighest,
      averageScore: mockAvg,
      lastTryOutDate: '-',
      hasRealData: false,
    };
  });

  // Students with real tryout results rank higher, sorted by highestScore descending
  return result
    .sort((a, b) => {
      if (a.hasRealData !== b.hasRealData) {
        return a.hasRealData ? -1 : 1;
      }
      return b.highestScore - a.highestScore;
    })
    .map(({ hasRealData, ...rest }) => rest);
}

// Comprehensive Chapter Evaluation Calculator for Weakness Report
export function calculateChapterBreakdown(
  questions: TkaQuestion[],
  answers: Record<string, number | number[]>
): {
  breakdowns: ChapterEvaluation[];
  weakChapters: string[];
  strongChapters: string[];
} {
  const map: Record<string, { chapterId: string; chapterName: string; subject: TkaSubject; total: number; correct: number }> = {};

  questions.forEach((q) => {
    const key = q.chapterId;
    if (!map[key]) {
      map[key] = {
        chapterId: q.chapterId,
        chapterName: q.chapterName,
        subject: q.subject,
        total: 0,
        correct: 0,
      };
    }
    map[key].total += 1;

    const userAns = answers[q.id];
    let isCorrect = false;
    if (q.questionType === 'PGK') {
      const targetKeys = (q.correctAnswers || [q.correctAnswer]).slice().sort((a, b) => a - b);
      const userKeys = Array.isArray(userAns)
        ? userAns.slice().sort((a, b) => a - b)
        : userAns !== undefined
        ? [userAns]
        : [];
      isCorrect =
        targetKeys.length === userKeys.length &&
        targetKeys.every((v, i) => v === userKeys[i]);
    } else {
      isCorrect = userAns === q.correctAnswer;
    }

    if (isCorrect) {
      map[key].correct += 1;
    }
  });

  const breakdowns: ChapterEvaluation[] = Object.values(map).map((item) => {
    const pct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    let status: ChapterEvaluation['status'] = 'SEDANG';
    if (pct >= 75) status = 'KUASAI';
    else if (pct < 50) status = 'PERLU_BELAJAR';

    return {
      chapterId: item.chapterId,
      chapterName: item.chapterName,
      subject: item.subject,
      correct: item.correct,
      total: item.total,
      percentage: pct,
      status,
    };
  });

  const weakChapters = breakdowns
    .filter((b) => b.percentage < 60)
    .map((b) => `${b.subject} - ${b.chapterName} (${b.percentage}%)`);

  const strongChapters = breakdowns
    .filter((b) => b.percentage >= 80)
    .map((b) => `${b.subject} - ${b.chapterName} (${b.percentage}%)`);

  return { breakdowns, weakChapters, strongChapters };
}
