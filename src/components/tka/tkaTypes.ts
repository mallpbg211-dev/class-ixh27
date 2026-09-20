export type TkaSubject = 'IPA' | 'B_INDO' | 'B_INGGRIS' | 'MATEMATIKA';

export type TkaSkill = 'LISTENING' | 'READING' | 'WRITING' | 'GENERAL';

export type TkaQuestionType = 'PG' | 'PGK'; // PG = Pilihan Ganda Biasa (1 Jawaban), PGK = Pilihan Ganda Kompleks (Jawaban > 1)

export interface TkaChapter {
  id: string;
  subject: TkaSubject;
  number: number | string;
  title: string;
  description: string;
}

export interface TkaQuestion {
  id: string;
  subject: TkaSubject;
  chapterId: string;
  chapterName: string;
  subtopic?: string;
  skill?: TkaSkill;
  questionType?: TkaQuestionType; // 'PG' or 'PGK'
  listeningScript?: string; // Text to be read aloud via Web Speech API TTS
  passage?: string; // Reading passage if any
  question: string;
  options: string[]; // 4 options [A, B, C, D]
  correctAnswer: number; // 0=A, 1=B, 2=C, 3=D (primary or single answer)
  correctAnswers?: number[]; // Array of indices for PGK (e.g. [0, 2] for A & C)
  theKingFormula: string; // Metode The King (solusi kilat)
  conventionalSolution: string; // Pembahasan biasa / buku sekolah
  source?: 'BANK' | 'AI' | 'ADMIN';
  packageId?: string; // id TryOutPackage tempat soal ini di-assign (kosong = soal latihan biasa, bukan soal TOBK)
}

export interface TryOutSessionConfig {
  subject: TkaSubject;
  title: string;
  durationMinutes: number;
  questionCount: number;
  questionIds?: string[];
}

export interface TryOutPackage {
  id: string;
  title: string;
  tag: string;
  description: string;
  totalQuestions: number; // typically 120 (30 per session) or adjustable
  sessions: TryOutSessionConfig[];
}

export interface SessionResult {
  subject: TkaSubject;
  correct: number;
  total: number;
  unanswered: number;
  wrong: number;
  score100: number;
  score1000: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, number | number[]>;
}

export interface ChapterEvaluation {
  chapterId: string;
  chapterName: string;
  subject: TkaSubject;
  correct: number;
  total: number;
  percentage: number;
  status: 'KUASAI' | 'SEDANG' | 'PERLU_BELAJAR'; // Mastery status
}

export interface TryOutHistoryRecord {
  id: string;
  packageId: string;
  packageName: string;
  date: string; // Localized date string
  timestamp: number; // Epoch ms for sorting & graph
  studentId?: number;
  studentName?: string;
  totalScore1000: number;
  totalScore100: number;
  totalCorrect: number;
  totalQuestions: number;
  totalTimeSpentSeconds: number;
  sessions: SessionResult[];
  chapterBreakdowns: ChapterEvaluation[];
  weakChapters: string[]; // List of chapter names < 60%
  strongChapters: string[]; // List of chapter names >= 80%
}

export interface LeaderboardStudent {
  studentId: number;
  name: string;
  avatarUrl?: string;
  dreamSchool: string;
  tryOutCount: number;
  highestScore: number;
  averageScore: number;
  lastTryOutDate: string;
}
