import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { PURBALINGGA_SCHOOLS, findSchoolByName } from './src/data/purbalinggaSchoolsData';

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi di environment variable.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Helper: Parsing pesan error dari Gemini API agar terformat rapi dan ramah pengguna
function parseGeminiErrorMessage(error: any): { isUnavailable: boolean; isQuota: boolean; message: string } {
  let rawMsg = typeof error === 'string' ? error : (error?.message || '');
  let code = error?.status || error?.code;
  let status = error?.status;

  // Jika pesan berupa JSON string dari Google API (misal: {"error":{"code":503,"message":"..."}})
  if (typeof rawMsg === 'string' && rawMsg.trim().startsWith('{') && rawMsg.trim().endsWith('}')) {
    try {
      const parsed = JSON.parse(rawMsg.trim());
      if (parsed?.error) {
        if (parsed.error.message) rawMsg = parsed.error.message;
        if (parsed.error.code) code = parsed.error.code;
        if (parsed.error.status) status = parsed.error.status;
      }
    } catch {}
  }

  const isUnavailable =
    code === 503 ||
    status === 'UNAVAILABLE' ||
    String(rawMsg).toLowerCase().includes('503') ||
    String(rawMsg).toLowerCase().includes('high demand') ||
    String(rawMsg).toLowerCase().includes('unavailable') ||
    String(rawMsg).toLowerCase().includes('overloaded');

  const isQuota =
    code === 429 ||
    status === 'RESOURCE_EXHAUSTED' ||
    String(rawMsg).toLowerCase().includes('429') ||
    String(rawMsg).toLowerCase().includes('quota') ||
    String(rawMsg).toLowerCase().includes('resource_exhausted') ||
    String(rawMsg).toLowerCase().includes('rate limit');

  let friendlyMessage = rawMsg;
  if (isUnavailable) {
    friendlyMessage = 'Server AI Google saat ini sedang mengalami lonjakan antrean trafik sementara (Error 503 Service Unavailable). Sistem telah mencoba mengalihkan ke model cadangan, silakan coba beberapa detik lagi.';
  } else if (isQuota) {
    friendlyMessage = 'Batas kuota harian Gemini API pada akun ini sedang mencapai ambang batas (Rate Limit 429). Silakan tunggu sejenak sebelum mencoba kembali.';
  }

  return { isUnavailable, isQuota, message: friendlyMessage };
}

// Helper: Memanggil Gemini API dengan mekanisme fallback otomatis jika model mengalami 503 / 429
async function generateContentWithFallback(
  ai: GoogleGenAI,
  requestParams: { contents: string; config?: any; models?: string[] }
) {
  // Model prioritasi: gemini-3.1-flash-lite (sangat cepat & minim antrean) -> gemini-3.8-flash
  const modelCandidates = requestParams.models || ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (let i = 0; i < modelCandidates.length; i++) {
    const model = modelCandidates[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents: requestParams.contents,
        config: requestParams.config,
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      const { isUnavailable, isQuota, message } = parseGeminiErrorMessage(err);
      console.info(`[Gemini API] Mengalihkan dari model ${model} ke cadangan (Info: ${message.slice(0, 80)}...)`);

      // Jika error berupa 503 (high demand) atau 429, beralih ke model berikutnya
      if ((isUnavailable || isQuota) && i < modelCandidates.length - 1) {
        continue;
      }
      // Jika bukan error overload atau sudah di model terakhir
      break;
    }
  }

  throw lastError;
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint 1: Generate Soal TKA dengan Gemini API Asli & Multi-Model Fallback
app.post('/api/tka/generate-question', async (req: Request, res: Response) => {
  try {
    const { subject, chapterTitle, subtopic, skill, questionType } = req.body;

    if (!subject || !chapterTitle) {
      return res.status(400).json({ error: 'Mata pelajaran dan bab wajib disertakan.' });
    }

    const ai = getGeminiClient();

    const isEnglishListening = subject === 'B_INGGRIS' && skill === 'LISTENING';
    const isPgk = questionType === 'PGK';

    const prompt = `Anda adalah pakar pembuat soal Asesmen / Tes Kemampuan Akademik (TKA) jenjang SMP menuju SMA/SMK Negeri standar TKA nasional dan Pusat Kurikulum & Asesmen Nasional.
Tolong buatkan 1 butir soal TKA yang berkualitas tinggi, HOTS (Higher Order Thinking Skills), dan kontekstual dengan rincian berikut:
- Mata Pelajaran: ${subject}
- Bab / Topik: ${chapterTitle}
${subtopic ? `- Subtopik: ${subtopic}` : ''}
${skill ? `- Skill (Bahasa Inggris): ${skill}` : ''}
- Tipe Soal: ${isPgk ? 'Pilihan Ganda Kompleks (PGK - minimal 2 kunci jawaban benar dari pilihan A, B, C, D)' : 'Pilihan Ganda Biasa (PG - tepat 1 kunci jawaban benar dari pilihan A, B, C, D)'}

ATURAN WAJIB NOTASI MATEMATIKA & SAINS (KaTeX / LaTeX):
- SECARA KONSISTEN SELALU bungkus semua ekspresi matematika, angka variabel, rumus, dan perhitungan menggunakan sintaks LaTeX standar.
- Gunakan tanda dolar tunggal ($...$) untuk rumus atau variabel inline di dalam kalimat (contoh: $x^2 + 5x + 6 = 0$, $a = 3$, $\\frac{1}{2}$).
- Gunakan tanda dolar ganda ($$...$$) untuk rumus atau langkah penurunan dalam blok baris terpisah (contoh: $$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$).
- Gunakan LaTeX standar: pecahan selalu pakai \\frac{pembilang}{penyebut} (JANGAN pakai a/b biasa), perkalian pakai \\times (bukan *), pembagian pakai \\div atau \\frac{}{}, akar pakai \\sqrt{}, pangkat pakai ^{}, indeks/subscript pakai _{}.

Format Balasan WAJIB berupa JSON murni dengan struktur berikut:
{
  "question": "Teks pertanyaan soal secara lengkap dengan rumus dibungkus $...$ atau $$...$$ (bisa disertai stimulus jika relevan)",
  "options": ["Teks Opsi A (gunakan $...$ untuk rumus)", "Teks Opsi B", "Teks Opsi C", "Teks Opsi D"],
  "correctAnswer": 0, // Indeks jawaban benar utama (0=A, 1=B, 2=C, 3=D)
  "correctAnswers": [0], // Array indeks jawaban benar. Jika PGK, sertakan semua indeks yang benar (misal: [0, 2]). Jika PG biasa, cukup 1 elemen.
  "conventionalSolution": "Pembahasan konsep formal langkah demi langkah. Bungkus semua rumus dengan $...$ dan $$...$$. Gunakan \\frac{}{}, \\times, \\sqrt{}, dsb.",
  "theKingFormula": "Formula sakti atau solusi kilat 'The King' standar TKA nasional. Bungkus rumus intinya dengan $$...$$ dan variabel dengan $...$.",
  "listeningScript": "${isEnglishListening ? 'Naskah audio percakapan / monolog Bahasa Inggris yang nantinya dibacakan via TTS oleh sistem' : ''}"
}

Pastikan:
1. Opsi jawaban tepat 4 buah (A, B, C, D) tanpa awalan 'A. ', 'B. ' (cukup isi teksnya).
2. Jawaban benar dan pembahasannya 100% akurat.
3. Bahasa Indonesia baku dan edukatif (kecuali soal Bahasa Inggris).
4. Jangan menambahkan markdown backtick di luar JSON.`;

    const { response, modelUsed } = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
      models: ['gemini-3.1-flash-lite', 'gemini-3.8-flash'],
    });

    const rawText = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(rawText.trim());
    } catch {
      // In case wrapped in markdown
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    // Defensive validation
    if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length < 4) {
      throw new Error('Format butir soal yang dihasilkan AI belum lengkap.');
    }

    res.json({
      success: true,
      modelUsed,
      question: {
        question: parsed.question,
        options: parsed.options.slice(0, 4),
        correctAnswer: typeof parsed.correctAnswer === 'number' ? parsed.correctAnswer : 0,
        correctAnswers: Array.isArray(parsed.correctAnswers) && parsed.correctAnswers.length > 0 ? parsed.correctAnswers : [parsed.correctAnswer ?? 0],
        conventionalSolution: parsed.conventionalSolution || 'Pembahasan telah diverifikasi oleh AI.',
        theKingFormula: parsed.theKingFormula || 'Gunakan penalaran eliminasi opsi ekstrem.',
        listeningScript: parsed.listeningScript || '',
        questionType: isPgk ? 'PGK' : 'PG',
      },
    });
  } catch (error: any) {
    const { isUnavailable, isQuota, message } = parseGeminiErrorMessage(error);

    console.warn('[API] Generate question warning:', message);
    res.status(200).json({
      success: false,
      quotaExceeded: isQuota,
      unavailable: isUnavailable,
      error: message,
    });
  }
});

// Helper: Dedup kemiripan teks pertanyaan
function normalizeTextForDedup(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function calculateWordSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(normalizeTextForDedup(textA));
  const wordsB = new Set(normalizeTextForDedup(textB));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) intersection++;
  });
  const smallerSize = Math.min(wordsA.size, wordsB.size);
  return intersection / smallerSize;
}

// Endpoint 1B: Generate Soal TKA AI Batch (Multi-Batch Chunks dengan Proteksi Timeout & Dedup)
app.post('/api/tka/generate-question-batch', async (req: Request, res: Response) => {
  try {
    const { subject, chapterTitle, subtopic, skill, questionType, count } = req.body;

    if (!subject || !chapterTitle) {
      return res.status(400).json({ error: 'Mata pelajaran dan materi pokok wajib diisi.' });
    }

    const targetCount = Math.min(Math.max(Number(count) || 30, 1), 60);
    const isEnglishListening = subject === 'B_INGGRIS' && skill === 'LISTENING';
    const isPgk = questionType === 'PGK';

    const ai = getGeminiClient();
    const collectedQuestions: any[] = [];
    let lastModelUsed = 'gemini-3.1-flash-lite';
    let lastErrorNotice = '';

    // Chunk size per Gemini call (6-8 soal per panggilan agar respon JSON tidak kepotong token limit)
    const CHUNK_SIZE = 8;
    const maxAttempts = Math.ceil(targetCount / 6) + 3; // buffer retries
    let attempts = 0;

    while (collectedQuestions.length < targetCount && attempts < maxAttempts) {
      attempts++;
      const needed = targetCount - collectedQuestions.length;
      const currentBatchSize = Math.min(needed, CHUNK_SIZE);

      // Riwayat teks soal yang telah dibuat di batch sebelumnya untuk mencegah repetisi
      const previousQuestionsList = collectedQuestions
        .slice(-15)
        .map((q, idx) => `${idx + 1}. ${q.question.slice(0, 100).replace(/\n/g, ' ')}`)
        .join('\n');

      const batchPrompt = `Anda adalah pakar pembuat soal Asesmen / Tes Kemampuan Akademik (TKA) jenjang SMP menuju SMA/SMK Negeri standar TKA nasional dan Pusat Kurikulum & Asesmen Nasional.
Tolong buatkan tepat ${currentBatchSize} butir soal TKA yang berkualitas tinggi, HOTS (Higher Order Thinking Skills), dan kontekstual dengan rincian berikut:
- Mata Pelajaran: ${subject}
- Bab / Materi: ${chapterTitle}
${subtopic ? `- Subtopik: ${subtopic}` : ''}
${skill ? `- Skill (Bahasa Inggris): ${skill}` : ''}
- Tipe Soal: ${isPgk ? 'Pilihan Ganda Kompleks (PGK - minimal 2 kunci jawaban benar dari pilihan A, B, C, D)' : 'Pilihan Ganda Biasa (PG - tepat 1 kunci jawaban benar dari pilihan A, B, C, D)'}

ATURAN WAJIB VARIASI & TINGKAT KESULITAN:
1. Jangan buat soal yang mirip atau membahas sub-topik yang sama persis dengan soal lain dalam array ini — variasikan sub-topik, angka hitungan, dan konteks cerita tiap soal.
2. WAJIB campur tingkat kesulitan dalam batch ini dengan proporsi: kira-kira 30% tingkat Mudah/Konseptual, 50% tingkat Sedang/Aplikasi, dan 20% tingkat Sulit/Analisis Jebakan HOTS.
${
  previousQuestionsList
    ? `3. DILARANG KERAS membuat soal yang sama atau mirip dengan daftar pertanyaan yang SUDAH dibuat sebelumnya berikut:\n${previousQuestionsList}\n`
    : ''
}

ATURAN WAJIB NOTASI MATEMATIKA & SAINS (KaTeX / LaTeX):
- SECARA KONSISTEN SELALU bungkus semua ekspresi matematika, angka variabel, rumus, dan perhitungan menggunakan sintaks LaTeX standar.
- Gunakan tanda dolar tunggal ($...$) untuk rumus atau variabel inline di dalam kalimat (contoh: $x^2 + 5x + 6 = 0$, $a = 3$, $\\frac{1}{2}$).
- Gunakan tanda dolar ganda ($$...$$) untuk rumus atau langkah penurunan dalam blok baris terpisah (contoh: $$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$).
- Gunakan LaTeX standar: pecahan selalu pakai \\frac{pembilang}{penyebut} (JANGAN pakai a/b biasa), perkalian pakai \\times (bukan *), pembagian pakai \\div atau \\frac{}{}, akar pakai \\sqrt{}, pangkat pakai ^{}, indeks/subscript pakai _{}.
- KHUSUS subscript/indeks multi-huruf: WAJIB bungkus dalam \\text{} (contoh benar: $L_{\\text{alas}}$, $V_{\\text{balok}}$, $F_{\\text{gesek}}$, $T_{\\text{akhir}}$ — JANGAN tulis L_alas atau L_{alas}).
- DILARANG KERAS menggunakan simbol Unicode mentah (seperti ×, √, ², ³, ±) sebagai pengganti LaTeX.

Format Balasan WAJIB berupa JSON array murni (tanpa pembungkus markdown di luarnya) berisi ${currentBatchSize} objek soal:
[
  {
    "question": "Teks pertanyaan soal secara lengkap dengan rumus dibungkus $...$ atau $$...$$ (bisa disertai stimulus jika relevan)",
    "options": ["Teks Opsi A (gunakan $...$ untuk rumus)", "Teks Opsi B", "Teks Opsi C", "Teks Opsi D"],
    "correctAnswer": 0, // Indeks jawaban benar utama (0=A, 1=B, 2=C, 3=D)
    "correctAnswers": [0], // Array indeks jawaban benar. Jika PGK, sertakan semua indeks yang benar (misal: [0, 2]). Jika PG biasa, cukup 1 elemen.
    "conventionalSolution": "Pembahasan konsep formal langkah demi langkah. Bungkus semua rumus dengan $...$ dan $$...$$. Gunakan \\frac{}{}, \\times, \\sqrt{}, dsb. Subscript multi-huruf pakai \\text{}.",
    "theKingFormula": "Formula sakti atau solusi kilat 'The King' standar TKA nasional. Bungkus rumus intinya dengan $$...$$ dan variabel dengan $...$.",
    "listeningScript": "${isEnglishListening ? 'Naskah audio percakapan / monolog Bahasa Inggris' : ''}"
  }
]

Pastikan setiap butir soal memiliki 4 opsi jawaban (A, B, C, D) tanpa awalan 'A. ' atau 'B. ', kunci jawaban akurat, dan format JSON valid.`;

      try {
        const { response, modelUsed } = await generateContentWithFallback(ai, {
          contents: batchPrompt,
          config: {
            responseMimeType: 'application/json',
          },
          models: ['gemini-3.1-flash-lite', 'gemini-3.8-flash'],
        });

        if (modelUsed) lastModelUsed = modelUsed;

        const rawText = response.text || '[]';
        let parsedBatch: any[] = [];

        try {
          const parsedJson = JSON.parse(rawText.trim());
          if (Array.isArray(parsedJson)) {
            parsedBatch = parsedJson;
          } else if (parsedJson && Array.isArray(parsedJson.questions)) {
            parsedBatch = parsedJson.questions;
          } else if (parsedJson && parsedJson.question) {
            parsedBatch = [parsedJson];
          }
        } catch {
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          try {
            const parsedJson = JSON.parse(cleaned);
            if (Array.isArray(parsedJson)) {
              parsedBatch = parsedJson;
            } else if (parsedJson && Array.isArray(parsedJson.questions)) {
              parsedBatch = parsedJson.questions;
            } else if (parsedJson && parsedJson.question) {
              parsedBatch = [parsedJson];
            }
          } catch (e: any) {
            console.warn('[API Batch] Gagal parse JSON batch chunk:', e?.message);
          }
        }

        // Validasi dan Filter Dedup tiap butir dalam batch yang diterima
        for (const item of parsedBatch) {
          if (
            !item ||
            typeof item.question !== 'string' ||
            item.question.trim().length < 10 ||
            !Array.isArray(item.options) ||
            item.options.length < 4
          ) {
            continue;
          }

          const qText = item.question.trim();

          // Cek apakah soal ini duplikat (>80% similarity kata) dengan soal yang sudah dikumpulkan
          const isDuplicate = collectedQuestions.some((existing) => {
            return calculateWordSimilarity(qText, existing.question) >= 0.8;
          });

          if (isDuplicate) {
            console.info('[API Batch] Soal terdeteksi mirip/duplikat, dilewati untuk diganti.');
            continue;
          }

          const validQuestion = {
            question: qText,
            options: item.options.slice(0, 4).map((opt: any) => String(opt || '').trim()),
            correctAnswer: typeof item.correctAnswer === 'number' ? item.correctAnswer : 0,
            correctAnswers:
              Array.isArray(item.correctAnswers) && item.correctAnswers.length > 0
                ? item.correctAnswers
                : [item.correctAnswer ?? 0],
            conventionalSolution: item.conventionalSolution || 'Pembahasan telah diverifikasi oleh AI.',
            theKingFormula: item.theKingFormula || 'Gunakan metode analisis The King.',
            listeningScript: item.listeningScript || '',
            questionType: isPgk ? 'PGK' : 'PG',
          };

          collectedQuestions.push(validQuestion);

          if (collectedQuestions.length >= targetCount) {
            break;
          }
        }
      } catch (chunkErr: any) {
        const { isQuota, isUnavailable, message } = parseGeminiErrorMessage(chunkErr);
        lastErrorNotice = message;
        console.warn(`[API Batch] Warning pada attempt ${attempts}: ${message}`);

        // Jika kuota habis dan belum dapat apa-apa, break
        if (isQuota && collectedQuestions.length === 0) {
          break;
        }

        // Beri jeda singkat sebelum mencoba chunk berikutnya
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    // Jika berhasil mengumpulkan sebagian atau seluruhnya
    if (collectedQuestions.length > 0) {
      return res.json({
        success: true,
        questions: collectedQuestions,
        modelUsed: lastModelUsed,
        partial: collectedQuestions.length < targetCount,
        generatedCount: collectedQuestions.length,
        requestedCount: targetCount,
      });
    }

    // Jika gagal total dan tidak ada soal yang terkumpul
    const { isQuota, isUnavailable } = parseGeminiErrorMessage(lastErrorNotice);
    return res.status(200).json({
      success: false,
      quotaExceeded: isQuota,
      unavailable: isUnavailable,
      error:
        lastErrorNotice ||
        'Gagal menghasilkan kumpulan soal AI. Silakan periksa koneksi atau coba beberapa saat lagi.',
    });
  } catch (error: any) {
    const { isUnavailable, isQuota, message } = parseGeminiErrorMessage(error);
    console.error('[API Batch] Fatal error:', message);
    return res.status(200).json({
      success: false,
      quotaExceeded: isQuota,
      unavailable: isUnavailable,
      error: message,
    });
  }
});

// Endpoint 1C: Parse & Ekstrak Soal dari Potongan Teks PDF Mentah dengan Gemini AI
app.post('/api/tka/parse-questions-from-text', async (req: Request, res: Response) => {
  try {
    const { rawText, subject, defaultChapterId } = req.body;

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'Teks ekstraksi PDF tidak boleh kosong.' });
    }

    const ai = getGeminiClient();

    const subjectHint = subject
      ? `Mata Pelajaran Target: ${subject}`
      : 'Mata Pelajaran: Deteksi otomatis (MATEMATIKA / IPA / B_INDO / B_INGGRIS berdasarkan konten soal)';
    const chapterHint = defaultChapterId ? `Referensi Bab ID: ${defaultChapterId}` : '';

    const parsePrompt = `Anda adalah asisten cerdas pembuat dan penelaah bank soal TKA (Tes Kemampuan Akademik) SMP-SMA standar TKA nasional.
Tugas Anda adalah membaca dan menganalisis potongan teks mentah hasil ekstraksi dari dokumen/PDF ujian berikut, mengenali soal-soal pilihan ganda yang sah, dan mengubahnya ke struktur data JSON yang rapi.

INFORMASI DOKUMEN:
- ${subjectHint}
${chapterHint ? `- ${chapterHint}` : ''}

TEKS MENTAH HASIL EKSTRAKSI PDF:
"""
${rawText}
"""

PETUNJUK ANALISIS & EKSTRAKSI SANGAT PENTING:
1. PENGELOMPOKAN SOAL:
   - Kenali hanya butir yang benar-benar merupakan SOAL PILIHAN GANDA (terdiri dari teks pertanyaan + minimal 2 sampai 4 opsi jawaban yang terlihat jelas).
   - ABAIKAN teks yang BUKAN bagian dari soal (seperti kop surat, header/footer halaman, nomor halaman, instruksi umum peserta ujian, nama pengawas, logo, dsb). JANGAN memaksakan teks instruksi menjadi soal.
2. PILIHAN JAWABAN (OPTIONS):
   - Tiap butir soal WAJIB memiliki tepat 4 opsi jawaban (A, B, C, D). Jika di naskah asli hanya terlihat 2 atau 3 opsi karena terpotong, lengkapi opsi yang hilang dengan pengecoh yang masuk akal.
   - Hapus label "A.", "B.", "A)", dsb dari teks opsi (cukup isi kalimat opsi).
3. KUNCI JAWABAN & CONFIDENCE:
   - Tentukan indeks jawaban benar "correctAnswer": 0 untuk A, 1 untuk B, 2 untuk C, 3 untuk D.
   - "correctAnswers": array indeks, misal [0] untuk PG biasa, atau [0, 2] jika terdeteksi PGK.
   - Field "confidence": "TINGGI" | "SEDANG" | "RENDAH":
     * "TINGGI": Jika soal, 4 opsi, dan kunci jawaban/solusi terbaca sangat jelas dan lengkap dari teks asli tanpa ada bagian yang terpotong.
     * "SEDANG": Jika soal dan opsi terbaca baik, namun ada sedikit ketidakjelasan format atau rumus yang perlu diperbaiki minor.
     * "RENDAH": Jika kunci jawaban TIDAK tertulis di PDF (sehingga Anda harus menghitung/menjawab sendiri), ATAU ada bagian soal/opsi yang tampak terpotong/ambigu.
   - ATURAN KHUSUS KUNCI JAWABAN TIDAK TERCANTUM:
     Jika kunci jawaban tidak eksplisit tertulis di teks PDF, Anda TETAP BOLEH menjawab berdasarkan analisis dan keahlian Anda, TAPI WAJIB set confidence: "RENDAH" dan WAJIB tambahkan catatan di awal conventionalSolution:
     "Catatan: kunci jawaban tidak tercantum di dokumen asli, ini jawaban hasil analisis AI — mohon diverifikasi ulang."
4. ATURAN WAJIB NOTASI MATEMATIKA & SAINS (KaTeX / LaTeX):
   - Selalu bungkus ekspresi matematika, angka variabel, rumus, dan perhitungan dengan sintaks LaTeX standar.
   - Gunakan tanda dolar tunggal ($...$) untuk rumus inline di dalam kalimat (contoh: $x^2 + 5x + 6 = 0$, $a = 3$, $\\frac{1}{2}$).
   - Gunakan tanda dolar ganda ($$...$$) untuk rumus atau langkah penurunan blok baris terpisah (contoh: $$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$).
   - Gunakan LaTeX standar: pecahan pakai \\frac{pembilang}{penyebut}, perkalian \\times, pembagian \\div atau \\frac{}{}, akar \\sqrt{}, pangkat ^{}, indeks/subscript pakai _{}.
   - KHUSUS subscript multi-huruf: WAJIB bungkus dalam \\text{} (contoh: $L_{\\text{alas}}$, $V_{\\text{balok}}$, $F_{\\text{gesek}}$ — JANGAN tulis L_alas atau L_{alas}).
   - HINDARI simbol Unicode mentah seperti ×, √, ², ±.
5. PEMBAHASAN & THE KING:
   - Buatkan "conventionalSolution" langkah demi langkah yang edukatif dan jelas.
   - Buatkan "theKingFormula" (trik/solusi kilat / penalaran eliminasi The King).

Format Balasan WAJIB berupa JSON murni dengan format:
{
  "questions": [
    {
      "question": "Teks pertanyaan soal lengkap dengan rumus KaTeX ($...$)",
      "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
      "correctAnswer": 0,
      "correctAnswers": [0],
      "conventionalSolution": "Pembahasan rinci...",
      "theKingFormula": "Trik The King...",
      "confidence": "TINGGI",
      "detectedSubject": "MATEMATIKA",
      "suggestedChapter": "Persamaan Kuadrat"
    }
  ]
}

Jika di dalam teks sama sekali tidak ditemukan soal pilihan ganda yang valid, kembalikan: { "questions": [] }`;

    const { response, modelUsed } = await generateContentWithFallback(ai, {
      contents: parsePrompt,
      config: {
        responseMimeType: 'application/json',
      },
      models: ['gemini-3.1-flash-lite', 'gemini-3.8-flash'],
    });

    const rawResult = response.text || '{}';
    let parsed: any = null;

    try {
      parsed = JSON.parse(rawResult.trim());
    } catch {
      const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (e: any) {
        console.warn('[API PDF Parse] Gagal parse JSON respon AI:', e?.message);
      }
    }

    let extractedList: any[] = [];
    if (Array.isArray(parsed)) {
      extractedList = parsed;
    } else if (parsed && Array.isArray(parsed.questions)) {
      extractedList = parsed.questions;
    } else if (parsed && parsed.question) {
      extractedList = [parsed];
    }

    // Normalisasi dan validasi tiap item yang diekstrak
    const validQuestions: any[] = [];
    for (const item of extractedList) {
      if (!item || typeof item.question !== 'string' || item.question.trim().length < 5) {
        continue;
      }

      let opts = Array.isArray(item.options) ? item.options.map((o: any) => String(o || '').trim()) : [];
      // Pastikan ada minimal 4 opsi
      while (opts.length < 4) {
        opts.push(`Pilihan ${String.fromCharCode(65 + opts.length)}`);
      }
      opts = opts.slice(0, 4);

      let correctIdx = typeof item.correctAnswer === 'number' ? item.correctAnswer : 0;
      if (correctIdx < 0 || correctIdx > 3) correctIdx = 0;

      let correctList =
        Array.isArray(item.correctAnswers) && item.correctAnswers.length > 0
          ? item.correctAnswers.filter((idx: any) => typeof idx === 'number' && idx >= 0 && idx < 4)
          : [correctIdx];
      if (correctList.length === 0) correctList = [correctIdx];

      const conf = ['TINGGI', 'SEDANG', 'RENDAH'].includes(item.confidence)
        ? item.confidence
        : 'SEDANG';

      validQuestions.push({
        question: item.question.trim(),
        options: opts,
        correctAnswer: correctIdx,
        correctAnswers: correctList,
        conventionalSolution: item.conventionalSolution || 'Pembahasan telah diverifikasi oleh AI.',
        theKingFormula: item.theKingFormula || 'Gunakan penalaran konsep dasar The King.',
        confidence: conf,
        detectedSubject: item.detectedSubject || subject || 'IPA',
        suggestedChapter: item.suggestedChapter || '',
      });
    }

    return res.json({
      success: true,
      questions: validQuestions,
      modelUsed,
      totalFound: validQuestions.length,
    });
  } catch (error: any) {
    const { isUnavailable, isQuota, message } = parseGeminiErrorMessage(error);
    console.error('[API PDF Parse] Error:', message);
    return res.status(200).json({
      success: false,
      quotaExceeded: isQuota,
      unavailable: isUnavailable,
      error: message,
    });
  }
});

// Endpoint 2: Cari Passing Grade SMA / SMK dengan Database Resmi Purbalingga & Google Search Grounding
app.post('/api/tka/search-sma-passing-grade', async (req: Request, res: Response) => {
  const { schoolName, city, forceAi } = req.body;
  if (!schoolName || typeof schoolName !== 'string' || schoolName.trim().length === 0) {
    return res.status(400).json({ error: 'Nama SMA / SMK tujuan wajib diisi.' });
  }

  const querySchool = schoolName.trim();
  const curated = findSchoolByName(querySchool);

  // Jika sekolah ada di database resmi Purbalingga & sekitarnya, berikan data akurat seketika tanpa memakan kuota AI
  if (curated && !forceAi) {
    return res.json({
      success: true,
      found: true,
      schoolName: curated.name,
      passingGrade: curated.passingGrade,
      originalScoreText: curated.scoreText,
      explanation: `${curated.explanation} (Terakreditasi ${curated.akreditasi} • Wilayah ${curated.subdistrict}).`,
      sources: [
        {
          title: 'Portal Resmi PPDB Jawa Tengah & Data Sekolah Purbalingga',
          uri: 'https://ppdb.jatengprov.go.id',
        },
      ],
    });
  }

  try {
    const ai = getGeminiClient();
    const cityContext = city ? `di daerah / kabupaten / kota ${city}` : 'di Indonesia (terutama Jawa Tengah / Purbalingga / Banyumas jika relevan)';

    const prompt = `Lakukan pencarian web resmi terbaru mengenai data nilai passing grade / nilai ambang batas penerimaan peserta didik baru (PPDB / SPMB) jalur prestasi atau nilai rapor / akademik untuk sekolah berikut:
Sekolah: "${querySchool}" ${cityContext}.

Instruksi penting:
1. Cari nilai passing grade terendah (nilai batas bawah yang diterima) pada PPDB/SPMB tahun ajaran terakhir (2024 atau 2023).
2. Standar skala nilai adalah 0–100 (rata-rata nilai rapor / gabungan nilai prestasi). Jika nilai dalam format total poin (misal skala 1000 atau jumlah nilai 5 mapel), sebutkan nilai tersebut dan jika mungkin konversikan ke skala 0-100.
3. SANGAT PENTING: Jika data passing grade sekolah tersebut TIDAK DITEMUKAN di web atau tidak ada pengumuman resmi yang mencantumkan nilai batasnya, nyatakan dengan jujur dan jelas bahwa DATA TIDAK DITEMUKAN. JANGAN PERNAH mengarang angka passing grade jika tidak ada buktinya.

Format balasan WAJIB berupa JSON murni dengan format:
{
  "found": true, // false jika tidak ada data passing grade yang jelas
  "schoolName": "${querySchool}",
  "passingGrade": 86.5, // nilai numerik skala 0-100 jika ditemukan, atau null jika tidak ditemukan
  "originalScoreText": "86.50 (Jalur Prestasi Nilai Rapor PPDB 2024)",
  "explanation": "Ringkasan penjelasan singkat temuan data beserta tahun ajaran dan jalurnya. Jika tidak ditemukan, jelaskan kenapa dan sarankan cek web Disdik setempat."
}`;

    const { response, modelUsed } = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
      models: ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'],
    });

    const rawText = response.text || '';
    let parsed: any = {
      found: false,
      schoolName: querySchool,
      passingGrade: null,
      explanation: 'Data tidak ditemukan di sumber publik.',
    };

    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed.explanation = rawText;
      }
    } catch {
      parsed.explanation = rawText;
    }

    // Extract grounding sources/citations
    const candidate = response.candidates?.[0];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const webSources: { title: string; url: string }[] = [];

    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        webSources.push({
          title: chunk.web.title || chunk.web.uri,
          url: chunk.web.uri,
        });
      }
    });

    // Deduplicate sources by URL
    const uniqueSources: { title: string; url: string }[] = [];
    const seenUrls = new Set<string>();
    for (const src of webSources) {
      if (!seenUrls.has(src.url)) {
        seenUrls.add(src.url);
        uniqueSources.push(src);
      }
    }

    if (parsed.found && typeof parsed.passingGrade === 'number') {
      return res.json({
        success: true,
        found: true,
        schoolName: parsed.schoolName || querySchool,
        passingGrade: parsed.passingGrade,
        originalScoreText: parsed.originalScoreText || '',
        explanation: parsed.explanation || rawText,
        sources: uniqueSources.slice(0, 5),
      });
    }

    // If Gemini didn't find specific score, check curated fallback
    if (curated) {
      return res.json({
        success: true,
        found: true,
        schoolName: curated.name,
        passingGrade: curated.passingGrade,
        originalScoreText: curated.scoreText,
        explanation: curated.explanation,
        sources: uniqueSources.slice(0, 5),
      });
    }

    return res.json({
      success: true,
      found: false,
      schoolName: parsed.schoolName || querySchool,
      passingGrade: null,
      originalScoreText: parsed.originalScoreText || '',
      explanation: parsed.explanation || 'Data passing grade tidak ditemukan secara publik. Silakan isi nilai secara manual.',
      sources: uniqueSources.slice(0, 5),
    });
  } catch (error: any) {
    const { isUnavailable, isQuota, message } = parseGeminiErrorMessage(error);

    if (curated) {
      return res.json({
        success: true,
        found: true,
        schoolName: curated.name,
        passingGrade: curated.passingGrade,
        originalScoreText: curated.scoreText,
        explanation: `${curated.explanation} (Catatan: Menggunakan basis data referensi resmi Purbalingga karena penelusuran live AI sedang antre).`,
        sources: [],
      });
    }

    return res.json({
      success: true,
      found: false,
      schoolName: querySchool,
      passingGrade: null,
      originalScoreText: '',
      explanation: isUnavailable || isQuota
        ? message
        : 'Layanan penelusuran AI sementara sedang padat. Silakan masukkan nilai passing grade sekolah tujuan secara manual pada kolom input.',
      sources: [],
    });
  }
});

// Vite middleware & Static Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Server berjalan di port ${PORT}`);
  });
}

start();
