import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard icon SVG (for desktop tabs & base rendering)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D72F6" />
      <stop offset="100%" stop-color="#1448B3" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0F2B66" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="110" fill="url(#bg)" />
  <!-- Inner soft neumorphic ring -->
  <circle cx="256" cy="230" r="145" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="12" />
  <!-- Main Emblem -->
  <g filter="url(#shadow)">
    <!-- Graduation / Class Shield icon -->
    <path d="M256 120 L370 176 L256 232 L142 176 Z" fill="#FFFFFF" />
    <path d="M340 200 L340 270 C340 310 256 344 256 344 C256 344 172 310 172 270 L172 200 L256 242 Z" fill="rgba(255,255,255,0.92)" />
    <!-- Text Badge IX-H -->
    <text x="256" y="278" font-family="'Poppins', system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="#1448B3" text-anchor="middle" letter-spacing="2">IX-H</text>
  </g>
  <!-- Bottom Banner label -->
  <rect x="136" y="380" width="240" height="56" rx="28" fill="#FFFFFF" />
  <text x="256" y="418" font-family="'Poppins', system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" fill="#1C5FE0" text-anchor="middle" letter-spacing="3">HUB KELAS</text>
</svg>`;

// 2. Maskable icon SVG (Android safe zone: center 80% circle, background bleeds 100%)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="maskableBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D72F6" />
      <stop offset="100%" stop-color="#1448B3" />
    </linearGradient>
  </defs>
  <!-- Full bleed background for maskable -->
  <rect width="512" height="512" fill="url(#maskableBg)" />
  <!-- Scaled content inside safe zone (padding around 15%) -->
  <g transform="translate(51, 51) scale(0.8)">
    <circle cx="256" cy="230" r="145" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="12" />
    <path d="M256 120 L370 176 L256 232 L142 176 Z" fill="#FFFFFF" />
    <path d="M340 200 L340 270 C340 310 256 344 256 344 C256 344 172 310 172 270 L172 200 L256 242 Z" fill="rgba(255,255,255,0.95)" />
    <text x="256" y="278" font-family="'Poppins', system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="#1448B3" text-anchor="middle" letter-spacing="2">IX-H</text>
    <rect x="136" y="380" width="240" height="56" rx="28" fill="#FFFFFF" />
    <text x="256" y="418" font-family="'Poppins', system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" fill="#1C5FE0" text-anchor="middle" letter-spacing="3">HUB KELAS</text>
  </g>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);

  // 192x192 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Apple touch icon 180x180 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Maskable 512x512 PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Favicon 48x48 PNG / ICO
  await sharp(Buffer.from(standardSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('Successfully generated all PWA icons in /public!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
