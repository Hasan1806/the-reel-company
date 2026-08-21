const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const inputPath = path.join(__dirname, '../public/trc-logo-full.jpg');
const jpegData = fs.readFileSync(inputPath);
const rawImage = jpeg.decode(jpegData, { useTArray: true });
const { width, height, data } = rawImage;

// TRC emblem coordinates
const padX = 16;
const padY = 14;
const cropX = Math.max(0, 270 - padX);
const cropY = Math.max(0, 162 - padY);
const cropW = (755 - 270) + padX * 2;
const cropH = (360 - 162) + padY * 2;

console.log('Generating TRC emblem:', { cropX, cropY, cropW, cropH });

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

    let alpha = 0;
    // Letter pixels have high silver luminance (> 90)
    if (lum > 88) {
      alpha = Math.min(255, Math.round(((lum - 88) / 32) * 255));
    }

    // Filter out any warm spotlight artifacts at the top edge
    if (y < 20 && r > b + 12 && lum < 210) {
      alpha = 0;
    }

    if (alpha > 0) {
      const boost = 1.04;
      png.data[dstIdx] = Math.min(255, Math.round(r * boost));
      png.data[dstIdx + 1] = Math.min(255, Math.round(g * boost));
      png.data[dstIdx + 2] = Math.min(255, Math.round(b * boost));
      png.data[dstIdx + 3] = alpha;
    } else {
      png.data[dstIdx] = 0;
      png.data[dstIdx + 1] = 0;
      png.data[dstIdx + 2] = 0;
      png.data[dstIdx + 3] = 0;
    }
  }
}

// 3x3 anti-aliasing feathering for ultra-smooth edges
const smoothed = new PNG({ width: cropW, height: cropH });
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const idx = (y * cropW + x) * 4;
    smoothed.data[idx] = png.data[idx];
    smoothed.data[idx + 1] = png.data[idx + 1];
    smoothed.data[idx + 2] = png.data[idx + 2];

    if (png.data[idx + 3] === 0) {
      let sum = 0, count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < cropH && nx >= 0 && nx < cropW) {
            const nIdx = (ny * cropW + nx) * 4;
            if (png.data[nIdx + 3] > 0) {
              sum += png.data[nIdx + 3];
              count++;
              smoothed.data[idx] = png.data[nIdx];
              smoothed.data[idx + 1] = png.data[nIdx + 1];
              smoothed.data[idx + 2] = png.data[nIdx + 2];
            }
          }
        }
      }
      smoothed.data[idx + 3] = count > 0 ? Math.round(sum / 9) : 0;
    } else {
      smoothed.data[idx + 3] = png.data[idx + 3];
    }
  }
}

const outPngPath = path.join(__dirname, '../public/trc-logo.png');
fs.writeFileSync(outPngPath, PNG.sync.write(smoothed));
console.log('Saved transparent TRC logo to:', outPngPath);

// Also update trc-logo-mark.png
fs.writeFileSync(path.join(__dirname, '../public/trc-logo-mark.png'), PNG.sync.write(smoothed));
