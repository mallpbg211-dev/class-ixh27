import confetti from 'canvas-confetti';

/**
 * Optimized confetti shooter that automatically scales particle counts
 * based on the device's CPU/GPU capabilities (hardwareConcurrency & memory).
 * Prevents sluggishness on low-end phones like Redmi 9A.
 */
export function fireConfetti(opts?: confetti.Options) {
  let isLowEnd = false;
  if (typeof navigator !== 'undefined') {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
      isLowEnd = true;
    }
    const navWithMem = navigator as unknown as { deviceMemory?: number };
    if (navWithMem.deviceMemory && navWithMem.deviceMemory <= 4) {
      isLowEnd = true;
    }
  }

  const baseCount = opts?.particleCount || 40;
  const count = isLowEnd ? Math.min(18, Math.round(baseCount * 0.45)) : baseCount;

  try {
    confetti({
      spread: 55,
      origin: { y: 0.65 },
      ...opts,
      particleCount: count,
      disableForReducedMotion: true,
    });
  } catch {
    // Canvas confetti might fail if canvas is disabled; ignore safely
  }
}
