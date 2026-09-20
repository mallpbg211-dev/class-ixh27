import pdfToText from 'react-pdftotext';

/**
 * Normalizes raw text extracted from PDF to structure it cleanly for the TKA parser:
 * - Ensures question numbers (1., 2., etc.) start on new lines
 * - Ensures options (A., B., C., D.) start on new lines
 * - Ensures Kunci Jawaban and The King markers start on new lines
 */
export function normalizePdfExtractedText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // Normalize Windows/Mac line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Collapse excessive inline spaces
  text = text.replace(/[ \t]+/g, ' ');

  // Force newline before question numbers (e.g., " 1. ", " 2) ", " Soal 1: ")
  text = text.replace(/(?:\s|\n)(?=(?:Soal\s*)?\d+[\.\)\:\-]\s+[A-Z0-9\(\"\'\—])/g, '\n\n');

  // Force newline before Options A., B., C., D. (when preceded by space or tab)
  text = text.replace(/\s+([A-D])[\.\)]\s+/g, '\n$1. ');

  // Force newline before Kunci Jawaban markers
  text = text.replace(/\s+(Kunci(?:\s+Jawaban)?|Jawaban)\s*[\:\-]\s*/gi, '\nKunci: ');

  // Force newline before The King / Rumus Cepat markers
  text = text.replace(/\s+(The\s+King|Solusi\s+Kilat|Rumus\s+Cepat)\s*[\:\-]\s*/gi, '\nThe King: ');

  // Force newline before Wacana / Bacaan
  text = text.replace(/\s+(Wacana|Bacaan|Teks\s+Bacaan)\s*[\:\-]\s*/gi, '\nWacana: ');

  // Clean multiple blank lines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}

/**
 * Extracts text from a PDF file using react-pdftotext and returns normalized text.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const rawText = await pdfToText(file);
    if (!rawText || !rawText.trim()) {
      throw new Error('File PDF terbaca tetapi tidak ada teks yang dapat diekstrak (kemungkinan file berupa scan gambar murni tanpa OCR).');
    }
    return normalizePdfExtractedText(rawText);
  } catch (error: unknown) {
    const msg = (error as Error)?.message || String(error);
    if (msg.includes('scan') || msg.includes('OCR')) {
      throw error;
    }
    throw new Error(`Gagal mengekstrak teks dari PDF: ${msg}`);
  }
}
