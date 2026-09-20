import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { DailyAttendance, Student, ClassConfig, CashTransaction, LessonItem, PicketGroup } from '../types';
import { TkaQuestion, TryOutPackage, TryOutHistoryRecord } from '../components/tka/tkaTypes';

export const DEFAULT_CLASS_CONFIG: ClassConfig = {
  name: 'Kelas IX-H',
  waliKelas: 'Ibu Siti Nur Syamsyiah, S.Pd',
  waliKelasSubject: 'Guru Pengampu IPA / Biologi',
  waliKelasAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  motto: 'Kompak Tanpa Batas, Berprestasi Berkelas, Menuju Kelulusan Emas',
  adminPin: '9090',
  kasPin: '1234',
  examDate: '2026-11-23',
  graduationDate: '2027-06-15',
};

// Read config from Vite environment variables with fallback to project credentials
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA4AYFDa2qVHXGNRRmbNHKejCkdtTi7QRM';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'kelasixh-apkv2.firebaseapp.com';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'kelasixh-apkv2';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'kelasixh-apkv2.firebasestorage.app';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '300695583333';
const appId = import.meta.env.VITE_FIREBASE_APP_ID || '1:300695583333:android:31cf286b0681485f52248c';

export const isFirebaseConfigured = Boolean(apiKey && projectId);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

/**
 * Membersihkan objek dari field bernilai `undefined` sebelum dikirim ke Firestore.
 * Firestore akan menolak (error) dokumen yang mengandung properti dengan nilai `undefined`.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as any;
  }
  return data;
}

if (isFirebaseConfigured) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: storageBucket || `${projectId}.appspot.com`,
      messagingSenderId,
      appId,
    };

    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    console.log('[Firebase] Terhubung dengan project:', projectId);
  } catch (err) {
    console.error('[Firebase] Gagal inisialisasi Firebase:', err);
  }
}

export { db };

/**
 * Realtime Listener for Daily Attendance Collection
 */
export function subscribeAttendance(
  onUpdate: (attendanceMap: Record<string, DailyAttendance>) => void
) {
  if (!db) return () => {};

  try {
    const attendanceCol = collection(db, 'attendance');
    const unsubscribe = onSnapshot(
      attendanceCol,
      (snapshot) => {
        const result: Record<string, DailyAttendance> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as DailyAttendance;
          result[docSnap.id] = data;
        });
        if (Object.keys(result).length > 0) {
          onUpdate(result);
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada absensi:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe absensi:', error);
    return () => {};
  }
}

/**
 * Save / Update Single Day Attendance
 */
export async function saveAttendanceRecord(dailyAttendance: DailyAttendance): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'attendance', dailyAttendance.date);
    await setDoc(docRef, dailyAttendance, { merge: true });
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan presensi ke Firestore:', error);
  }
}

/**
 * Realtime Listener for Students Collection (for photo, bio, and dream school changes)
 */
export function subscribeStudents(onUpdate: (studentsMap: Record<number, Partial<Student>>) => void) {
  if (!db) return () => {};

  try {
    const studentsCol = collection(db, 'students');
    const unsubscribe = onSnapshot(
      studentsCol,
      (snapshot) => {
        const result: Record<number, Partial<Student>> = {};
        snapshot.forEach((docSnap) => {
          const id = Number(docSnap.id);
          if (!isNaN(id)) {
            result[id] = docSnap.data() as Partial<Student>;
          }
        });
        if (Object.keys(result).length > 0) {
          onUpdate(result);
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada data siswa:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe siswa:', error);
    return () => {};
  }
}

/**
 * Save Single Student Updates (photo, dream school, bio, etc.)
 */
export async function saveStudentData(studentId: number, data: Partial<Student>): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'students', studentId.toString());
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan profil siswa ke Firestore:', error);
  }
}

/**
 * Delete Single Student from Firestore
 */
export async function deleteStudentData(studentId: number): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'students', studentId.toString());
    await deleteDoc(docRef);
    console.log(`[Firebase] Data siswa #${studentId} berhasil dihapus dari Firestore`);
  } catch (error) {
    console.error(`[Firebase] Gagal menghapus siswa #${studentId} dari Firestore:`, error);
  }
}

/**
 * Realtime Listener for Class Settings Document (collection 'settings', doc 'classConfig')
 * Stores name, waliKelas, waliKelasSubject, motto, adminPin, kasPin
 */
export function subscribeClassSettings(onUpdate: (config: ClassConfig) => void) {
  if (!db) {
    onUpdate(DEFAULT_CLASS_CONFIG);
    return () => {};
  }

  try {
    const configDocRef = doc(db, 'settings', 'classConfig');
    const unsubscribe = onSnapshot(
      configDocRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const merged: ClassConfig = {
            name: (typeof data.name === 'string' && data.name) ? data.name : DEFAULT_CLASS_CONFIG.name,
            waliKelas: (typeof data.waliKelas === 'string' && data.waliKelas) ? data.waliKelas : DEFAULT_CLASS_CONFIG.waliKelas,
            waliKelasSubject: (typeof data.waliKelasSubject === 'string' && data.waliKelasSubject) ? data.waliKelasSubject : DEFAULT_CLASS_CONFIG.waliKelasSubject,
            waliKelasAvatarUrl: (typeof data.waliKelasAvatarUrl === 'string' && data.waliKelasAvatarUrl) ? data.waliKelasAvatarUrl : DEFAULT_CLASS_CONFIG.waliKelasAvatarUrl,
            motto: (typeof data.motto === 'string' && data.motto) ? data.motto : DEFAULT_CLASS_CONFIG.motto,
            adminPin: (typeof data.adminPin === 'string' && data.adminPin) ? data.adminPin : DEFAULT_CLASS_CONFIG.adminPin,
            kasPin: (typeof data.kasPin === 'string' && data.kasPin) ? data.kasPin : DEFAULT_CLASS_CONFIG.kasPin,
            examDate: typeof data.examDate === 'string' ? data.examDate : DEFAULT_CLASS_CONFIG.examDate,
            graduationDate: typeof data.graduationDate === 'string' ? data.graduationDate : DEFAULT_CLASS_CONFIG.graduationDate,
            countdownEvents: Array.isArray(data.countdownEvents) ? data.countdownEvents : undefined,
            updatedAt: data.updatedAt,
            createdAt: data.createdAt,
          };
          onUpdate(merged);
        } else {
          // Document does not exist yet -> Seed with default values (adminPin: '9090', kasPin: '1234')
          try {
            await setDoc(configDocRef, {
              ...DEFAULT_CLASS_CONFIG,
              createdAt: new Date().toISOString(),
            }, { merge: true });
            onUpdate(DEFAULT_CLASS_CONFIG);
          } catch (seedErr) {
            console.warn('[Firebase] Gagal seed classConfig:', seedErr);
            onUpdate(DEFAULT_CLASS_CONFIG);
          }
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada settings/classConfig:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe classConfig:', error);
    return () => {};
  }
}

/**
 * Save / Update Class Settings (collection 'settings', doc 'classConfig')
 */
export async function saveClassSettings(data: Partial<ClassConfig>): Promise<void> {
  if (!db) {
    console.warn('[Firebase] Database belum siap.');
    return;
  }

  // Defensive validation on client before pushing to Firestore
  if (data.adminPin !== undefined && (typeof data.adminPin !== 'string' || data.adminPin.trim().length < 4)) {
    throw new Error('PIN Admin harus berupa teks minimal 4 karakter');
  }
  if (data.kasPin !== undefined && (typeof data.kasPin !== 'string' || data.kasPin.trim().length < 4)) {
    throw new Error('PIN Kas harus berupa teks minimal 4 karakter');
  }
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length < 2)) {
    throw new Error('Nama kelas minimal 2 karakter');
  }

  try {
    const docRef = doc(db, 'settings', 'classConfig');
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log('[Firebase] Pengaturan kelas & PIN berhasil disimpan ke Firestore');
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan settings/classConfig ke Firestore:', error);
    throw error;
  }
}

/**
 * Realtime Listener for Cash Data (collection 'cash', doc 'main')
 */
export function subscribeCashData(
  onUpdate: (data: { nominalKas?: number; transactions?: CashTransaction[] }) => void
) {
  if (!db) return () => {};

  try {
    const cashDocRef = doc(db, 'cash', 'main');
    const unsubscribe = onSnapshot(
      cashDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate({
            nominalKas: typeof data.nominalKas === 'number' ? data.nominalKas : undefined,
            transactions: Array.isArray(data.transactions) ? data.transactions : undefined,
          });
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada cash/main:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe cash data:', error);
    return () => {};
  }
}

/**
 * Save / Update Cash Data (collection 'cash', doc 'main')
 */
export async function saveCashData(data: {
  nominalKas?: number;
  transactions?: CashTransaction[];
}): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'cash', 'main');
    const payload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (typeof data.nominalKas === 'number') {
      payload.nominalKas = data.nominalKas;
    }
    if (Array.isArray(data.transactions)) {
      payload.transactions = data.transactions;
    }
    await setDoc(docRef, payload, { merge: true });
    console.log('[Firebase] Data kas berhasil disimpan ke Firestore');
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan cash ke Firestore:', error);
  }
}

/**
 * Realtime Listener for Lesson Schedules (collection 'lessons', doc 'schedule')
 */
export function subscribeLessons(onUpdate: (lessons: LessonItem[]) => void) {
  if (!db) return () => {};

  try {
    const lessonsDocRef = doc(db, 'lessons', 'schedule');
    const unsubscribe = onSnapshot(
      lessonsDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.list) && data.list.length > 0) {
            onUpdate(data.list);
          }
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada lessons/schedule:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe jadwal pelajaran:', error);
    return () => {};
  }
}

/**
 * Save / Update Lesson Schedules (collection 'lessons', doc 'schedule')
 */
export async function saveLessonsData(lessons: LessonItem[]): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'lessons', 'schedule');
    await setDoc(
      docRef,
      {
        list: lessons,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log('[Firebase] Jadwal pelajaran berhasil disimpan ke Firestore');
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan jadwal ke Firestore:', error);
  }
}

/**
 * Realtime Listener for Picket Duties (collection 'picketDuties', doc 'roster')
 */
export function subscribePicketDuties(onUpdate: (picketDuties: PicketGroup[]) => void) {
  if (!db) return () => {};

  try {
    const picketDocRef = doc(db, 'picketDuties', 'roster');
    const unsubscribe = onSnapshot(
      picketDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.list) && data.list.length > 0) {
            onUpdate(data.list);
          }
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada picketDuties/roster:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe piket kelas:', error);
    return () => {};
  }
}

/**
 * Save / Update Picket Duties (collection 'picketDuties', doc 'roster')
 */
export async function savePicketDutiesData(picketDuties: PicketGroup[]): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'picketDuties', 'roster');
    await setDoc(
      docRef,
      {
        list: picketDuties,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log('[Firebase] Jadwal piket berhasil disimpan ke Firestore');
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan piket ke Firestore:', error);
  }
}

/**
 * Restore Full Class Backup into Firestore
 * Writes students, cash, lessons, picketDuties, attendance, and classConfig
 */
export async function restoreFullBackupToFirestore(backupData: any): Promise<{ success: boolean; message: string }> {
  if (!db) {
    return { success: false, message: 'Database Firestore belum terhubung.' };
  }
  try {
    const batch = writeBatch(db);

    // 1. Settings / Class Config
    if (backupData.classConfig || backupData.classInfo) {
      const src = backupData.classConfig || backupData.classInfo;
      const configRef = doc(db, 'settings', 'classConfig');
      const payload: any = {
        name: src.name || 'Kelas IX-H',
        waliKelas: src.waliKelas || 'Ibu Siti Nur Syamsyiah, S.Pd',
        waliKelasSubject: src.waliKelasSubject || 'Guru Pengampu IPA / Biologi',
        waliKelasAvatarUrl: src.waliKelasAvatarUrl || DEFAULT_CLASS_CONFIG.waliKelasAvatarUrl,
        motto: src.motto || 'Kompak Tanpa Batas, Berprestasi Berkelas, Menuju Kelulusan Emas',
        adminPin: src.adminPin || '9090',
        kasPin: src.kasPin || '1234',
        updatedAt: new Date().toISOString(),
      };
      if (src.examDate) payload.examDate = src.examDate;
      if (src.graduationDate) payload.graduationDate = src.graduationDate;
      batch.set(configRef, payload, { merge: true });
    }

    // 2. Cash data
    if (backupData.transactions || typeof backupData.nominalKas === 'number') {
      const cashRef = doc(db, 'cash', 'main');
      const cashPayload: any = { updatedAt: new Date().toISOString() };
      if (Array.isArray(backupData.transactions)) cashPayload.transactions = backupData.transactions;
      if (typeof backupData.nominalKas === 'number') cashPayload.nominalKas = backupData.nominalKas;
      batch.set(cashRef, cashPayload, { merge: true });
    }

    // 3. Lessons Schedule
    if (Array.isArray(backupData.lessons)) {
      const lessonsRef = doc(db, 'lessons', 'schedule');
      batch.set(
        lessonsRef,
        { list: backupData.lessons, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }

    // 4. Picket Duties
    if (Array.isArray(backupData.picketDuties)) {
      const picketRef = doc(db, 'picketDuties', 'roster');
      batch.set(
        picketRef,
        { list: backupData.picketDuties, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }

    // 5. Students Collection
    if (Array.isArray(backupData.students)) {
      backupData.students.forEach((s: any) => {
        if (s && s.id !== undefined) {
          const sRef = doc(db!, 'students', s.id.toString());
          batch.set(sRef, { ...s, updatedAt: new Date().toISOString() }, { merge: true });
        }
      });
    }

    // 6. Daily Attendance Collection
    if (backupData.attendance && typeof backupData.attendance === 'object') {
      Object.entries(backupData.attendance).forEach(([dateStr, record]: [string, any]) => {
        if (dateStr && record && record.records) {
          const attRef = doc(db!, 'attendance', dateStr);
          batch.set(attRef, { ...record, updatedAt: new Date().toISOString() }, { merge: true });
        }
      });
    }

    await batch.commit();
    return { success: true, message: 'Seluruh data backup berhasil dipulihkan ke Firestore!' };
  } catch (error: any) {
    console.error('[Firebase] Gagal restore backup ke Firestore:', error);
    return { success: false, message: error?.message || 'Terjadi kesalahan saat memulihkan backup.' };
  }
}

/**
 * =========================================================
 * TKA FIRESTORE INTEGRATION
 * =========================================================
 */

// 1. TKA Questions (Bank Soal)
export function subscribeTkaQuestions(onUpdate: (questions: TkaQuestion[]) => void) {
  if (!db) return () => {};

  try {
    const colRef = collection(db, 'tkaQuestions');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: TkaQuestion[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as TkaQuestion;
          list.push({ ...data, id: docSnap.id });
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada tkaQuestions:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe tkaQuestions:', error);
    return () => {};
  }
}

export async function saveTkaQuestionToFirestore(question: TkaQuestion): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'tkaQuestions', question.id);
    const cleaned = sanitizeForFirestore({ ...question, updatedAt: new Date().toISOString() });
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan soal TKA ke Firestore:', error);
  }
}

export async function saveTkaQuestionsBatchToFirestore(questions: TkaQuestion[]): Promise<void> {
  if (!db || questions.length === 0) return;
  try {
    const batch = writeBatch(db);
    questions.forEach((q) => {
      const docRef = doc(db!, 'tkaQuestions', q.id);
      const cleaned = sanitizeForFirestore({ ...q, updatedAt: new Date().toISOString() });
      batch.set(docRef, cleaned, { merge: true });
    });
    await batch.commit();
    console.log(`[Firebase] Berhasil menyimpan ${questions.length} soal TKA ke Firestore`);
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan batch soal TKA ke Firestore:', error);
  }
}

export async function deleteTkaQuestionFromFirestore(id: string): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'tkaQuestions', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('[Firebase] Gagal menghapus soal TKA dari Firestore:', error);
  }
}

// 2. TKA Packages (Paket Try Out)
export function subscribeTkaPackages(onUpdate: (packages: TryOutPackage[]) => void) {
  if (!db) return () => {};

  try {
    const colRef = collection(db, 'tkaPackages');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: TryOutPackage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as TryOutPackage;
          list.push({ ...data, id: docSnap.id });
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada tkaPackages:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe tkaPackages:', error);
    return () => {};
  }
}

export async function saveTkaPackageToFirestore(pkg: TryOutPackage): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'tkaPackages', pkg.id);
    const cleaned = sanitizeForFirestore({ ...pkg, updatedAt: new Date().toISOString() });
    await setDoc(docRef, cleaned, { merge: true });
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan paket TO ke Firestore:', error);
  }
}

export async function deleteTkaPackageFromFirestore(id: string): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'tkaPackages', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('[Firebase] Gagal menghapus paket TO dari Firestore:', error);
  }
}

// 3. TKA Results (Riwayat & Hasil Try Out Siswa)
export function subscribeTkaResults(onUpdate: (results: TryOutHistoryRecord[]) => void) {
  if (!db) return () => {};

  try {
    const colRef = collection(db, 'tkaResults');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: TryOutHistoryRecord[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as TryOutHistoryRecord;
          list.push({ ...data, id: docSnap.id });
        });
        // Sort newest first
        list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        onUpdate(list);
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada tkaResults:', error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe tkaResults:', error);
    return () => {};
  }
}

export async function saveTkaResultToFirestore(record: TryOutHistoryRecord): Promise<void> {
  if (!db) return;
  try {
    const docId = record.id || `rec_${Date.now()}_${record.studentId || 1}`;
    const docRef = doc(db, 'tkaResults', docId);
    const cleaned = sanitizeForFirestore({
      ...record,
      id: docId,
      studentId: record.studentId || 1,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, cleaned, { merge: true });
    console.log('[Firebase] Hasil try out berhasil disimpan ke Firestore');
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan hasil try out ke Firestore:', error);
  }
}

// 4. TKA Config & Bobot SPMB
export interface TkaSpmbConfig {
  bobotRapor: number; // default 50 (%)
  bobotTka: number;   // default 50 (%)
  updatedAt?: string;
}

export const DEFAULT_TKA_CONFIG: TkaSpmbConfig = {
  bobotRapor: 50,
  bobotTka: 50,
};

export function subscribeTkaConfig(onUpdate: (config: TkaSpmbConfig) => void) {
  if (!db) {
    onUpdate(DEFAULT_TKA_CONFIG);
    return () => {};
  }

  try {
    const docRef = doc(db, 'settings', 'tkaConfig');
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate({
            bobotRapor: typeof data.bobotRapor === 'number' ? data.bobotRapor : 50,
            bobotTka: typeof data.bobotTka === 'number' ? data.bobotTka : 50,
            updatedAt: data.updatedAt,
          });
        } else {
          onUpdate(DEFAULT_TKA_CONFIG);
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot error pada settings/tkaConfig:', error.message);
        onUpdate(DEFAULT_TKA_CONFIG);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('[Firebase] Gagal subscribe settings/tkaConfig:', error);
    onUpdate(DEFAULT_TKA_CONFIG);
    return () => {};
  }
}

export async function saveTkaConfig(config: TkaSpmbConfig): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'settings', 'tkaConfig');
    await setDoc(
      docRef,
      {
        bobotRapor: config.bobotRapor,
        bobotTka: config.bobotTka,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log('[Firebase] Bobot SPMB berhasil disimpan ke Firestore');
  } catch (error) {
    console.error('[Firebase] Gagal menyimpan settings/tkaConfig ke Firestore:', error);
  }
}




