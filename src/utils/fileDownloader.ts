/**
 * Reliable file downloader and mobile share helper for PWA / Android WebView.
 * Solves the issue where synthetic <a download> clicks are silently blocked
 * in Android PWA standalone mode.
 */
import type { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export interface SaveFileResult {
  success: boolean;
  method: 'share' | 'download' | 'blob_url' | 'cancelled';
  error?: string;
}

/**
 * Checks if the current environment is mobile or Android
 */
export function isMobileOrAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Android|iPhone|iPad|iPod|Mobile|webOS/i.test(ua);
}

/**
 * Checks if running as standalone PWA
 */
export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * Bulletproof file saver that tries:
 * 1. Web Share API (if supported on mobile/standalone)
 * 2. Anchor click with Blob URL
 * 3. Fallback to opening Blob in a new tab or prompting the user
 */
export async function downloadOrShareBlob(
  blob: Blob,
  filename: string,
  title?: string
): Promise<SaveFileResult> {
  const mimeType = blob.type || 'application/octet-stream';
  const displayTitle = title || filename;

  // 1. Try Web Share API on mobile devices or standalone PWA
  if (isMobileOrAndroid() || isStandalonePWA()) {
    try {
      if (
        typeof navigator !== 'undefined' &&
        'canShare' in navigator &&
        'share' in navigator
      ) {
        const file = new File([blob], filename, { type: mimeType });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: displayTitle,
            text: `Unduh berkas: ${filename}`,
          });
          return { success: true, method: 'share' };
        }
      }
    } catch (shareErr: unknown) {
      const err = shareErr as Error;
      if (err.name === 'AbortError') {
        // User cancelled the native share picker
        return { success: true, method: 'cancelled' };
      }
      console.warn('Web Share API tidak tersedia / dibatalkan, beralih ke download langsung:', shareErr);
    }
  }

  // 2. Standard Blob Download via Anchor Click
  try {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);

    anchor.click();

    setTimeout(() => {
      try {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      } catch {
        // ignore cleanup error
      }
    }, 2000);

    return { success: true, method: 'download' };
  } catch (downloadErr: unknown) {
    console.error('Download anchor gagal:', downloadErr);

    // 3. Fallback: Open in new window/tab
    try {
      const url = URL.createObjectURL(blob);
      const newWin = window.open(url, '_blank');
      if (!newWin) {
        throw new Error('Pop-up terblokir oleh peramban');
      }
      return { success: true, method: 'blob_url' };
    } catch (openErr: unknown) {
      const finalErr = (openErr as Error).message || 'Gagal mengunduh berkas';
      return { success: false, method: 'download', error: finalErr };
    }
  }
}

/**
 * Saves a jsPDF instance reliably across Desktop, Android, and PWA
 */
export async function savePdfDoc(
  doc: jsPDF,
  filename: string,
  title?: string
): Promise<SaveFileResult> {
  try {
    const blob = doc.output('blob');
    const result = await downloadOrShareBlob(blob, filename, title);
    if (!result.success) {
      alert(`Gagal mengunduh PDF (${filename}): ${result.error || 'Terjadi kesalahan sistem'}`);
    }
    return result;
  } catch (err: unknown) {
    const errMsg = (err as Error).message || String(err);
    alert(`Gagal membuat berkas PDF: ${errMsg}`);
    return { success: false, method: 'download', error: errMsg };
  }
}

/**
 * Saves an XLSX WorkBook reliably across Desktop, Android, and PWA
 */
export async function saveExcelWorkbook(
  wb: XLSX.WorkBook,
  filename: string,
  title?: string
): Promise<SaveFileResult> {
  try {
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const result = await downloadOrShareBlob(blob, filename, title);
    if (!result.success) {
      alert(`Gagal mengunduh Excel (${filename}): ${result.error || 'Terjadi kesalahan sistem'}`);
    }
    return result;
  } catch (err: unknown) {
    const errMsg = (err as Error).message || String(err);
    alert(`Gagal membuat berkas Excel: ${errMsg}`);
    return { success: false, method: 'download', error: errMsg };
  }
}
