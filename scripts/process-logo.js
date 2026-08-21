const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '../public/trc-logo-full.jpg');
const jpegData = fs.readFileSync(inputPath);
const rawImage = jpeg.decode(jpegData, { useTArray: true });
const { width, height, data } = rawImage;

function createCroppedTransparentPng(cropX, cropY, cropW, cropH, outFileName) {
  const png = new PNG({ width: cropW, height: cropH });

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcX = cropX + x;
      const srcY = cropY + y;
      const srcIdx = (srcY * width + srcX) * 4;
      const dstIdx = (y * cropW + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Clean background separation:
      // Dark background is < 28 lum
      let alpha = 255;
      if (lum <= 24) {
        alpha = 0;
      } else if (lum < 52) {
        const t = (lum - 24) / (52 - 24);
        alpha = Math.round(t * t * 255);
      } else {
        alpha = 255;
      }

      // Slightly enhance silver metallic highlights
      const boost = alpha > 0 ? 1.05 : 1.0;
      png.data[dstIdx] = Math.min(255, Math.round(r * boost));
      png.data[dstIdx + 1] = Math.min(255, Math.round(g * boost));
      png.data[dstIdx + 2] = Math.min(255, Math.round(b * boost));
      png.data[dstIdx + 3] = alpha;
    }
  }

  const outPath = path.join(__dirname, '../public', outFileName);
  fs.writeFileSync(outPath, PNG.sync.write(png));
  console.log(`Generated ${outFileName} (${cropW}x${cropH})`);
}

// 1. Full logo (TRC + THE REEL COMPANY) with 12px padding
const padX = 12;
const padY = 10;
const fullX = Math.max(0, 269 - padX);
const fullY = Math.max(0, 161 - padY);
const fullW = (756 - 269) + padX * 2;
const fullH = (464 - 161) + padY * 2;

createCroppedTransparentPng(fullX, fullY, fullW, fullH, 'trc-logo.png');

// 2. Mark only (TRC emblem)
const markX = Math.max(0, 269 - padX);
const markY = Math.max(0, 161 - padY);
const markW = (756 - 269) + padX * 2;
const markH = (360 - 161) + padY * 2;

createCroppedTransparentPng(markX, markY, markW, markH, 'trc-logo-mark.png');
