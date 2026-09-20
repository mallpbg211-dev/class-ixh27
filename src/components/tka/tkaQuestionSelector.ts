import { TkaQuestion } from './tkaTypes';

/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32).
 * Menghasilkan angka acak [0, 1) yang 100% konsisten untuk seed yang sama.
 */
function createMulberry32(seed: number): () => number {
  let s = Math.floor(seed) || 1;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates Shuffle berbasis Seeded PRNG.
 * Menghasilkan susunan acak yang deterministik (tidak berubah saat direload).
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const copy = [...array];
  const rng = createMulberry32(seed);

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
}

/**
 * Seleksi soal deterministik untuk paket latihan tertentu (Grid 12 Paket).
 *
 * @param pool Daftar soal yang sudah difilter berdasarkan subject & chapterId
 * @param packageIndex Nomor paket latihan (1-12) sebagai seed deterministik
 * @param targetCount Target jumlah soal per paket (default: 30)
 * @returns Kumpulan soal untuk paket tersebut (maksimal targetCount butir, tanpa duplikasi)
 */
export function getQuestionsForPracticePackage(
  pool: TkaQuestion[],
  packageIndex: number,
  targetCount: number = 30
): TkaQuestion[] {
  if (!pool || pool.length === 0) {
    return [];
  }

  // 1. Acak pool dengan seed nomor paket
  const shuffled = seededShuffle(pool, packageIndex);

  // 2. Ambil hingga targetCount butir soal
  // 3. Jika pool.length < targetCount, kembalikan semua yang ada (tanpa kloning/duplikasi buatan)
  return shuffled.slice(0, Math.max(1, targetCount));
}
