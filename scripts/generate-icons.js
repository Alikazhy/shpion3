/**
 * Генерация PNG-иконок для App Store и PWA
 * Запуск: node scripts/generate-icons.js
 */
const fs = require('fs');
const path = require('path');

const sizes = [152, 167, 180, 192, 512, 1024];
const outDir = path.join(__dirname, '..', 'icons');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a14"/>
      <stop offset="50%" style="stop-color:#0d0d12"/>
      <stop offset="100%" style="stop-color:#0a0a1a"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff375f"/>
      <stop offset="100%" style="stop-color:#bf5af2"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="24" flood-color="#ff375f" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="1024" height="1024" rx="226" fill="url(#bg)"/>
  <circle cx="512" cy="512" r="380" fill="url(#glow)" opacity="0.08"/>
  <g transform="translate(512,480) scale(14)" fill="none" stroke="url(#glow)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow)">
    <path d="M12 2C8.5 2 6 4.2 6 7.5c0 2.1 1 3.9 2.5 5.1V22h7v-9.4C17 10.4 18 8.6 18 7.5 18 4.2 15.5 2 12 2z"/>
    <circle cx="12" cy="7.5" r="2.5"/>
    <path d="M8 14.5h8M10 17h4"/>
    <path d="M4 10l2 1M20 10l-2 1M4 14l2-1M20 14l-2-1" opacity="0.7"/>
  </g>
  <text x="512" y="820" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="72" font-weight="700" fill="#ffffff" letter-spacing="12">ШПИОН</text>
</svg>`;

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'icon.svg'), svg);

async function generate() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('Установите sharp: npm install sharp');
    console.log('SVG сохранён: icons/icon.svg');
    console.log('Конвертируйте в PNG вручную или через https://cloudconvert.com');
    return;
  }

  for (const size of sizes) {
    const out = path.join(outDir, `icon-${size}.png`);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
    console.log('Created', out);
  }
  console.log('Done!');
}

generate().catch(console.error);
