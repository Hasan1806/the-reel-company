const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, 'public');
const sourceImages = ['lens-hd-cutout.png', 'camera-hero.png', 'lens-eye-bg.png'];

async function convertImages() {
  for (const file of sourceImages) {
    const filePath = path.join(publicDir, file);
    if (!fs.existsSync(filePath)) continue;

    const baseName = path.parse(file).name;
    const metadata = await sharp(filePath).metadata();
    const origWidth = metadata.width;

    console.log(`Processing ${file} (${origWidth}x${metadata.height})...`);

    const widths = [380, 680];

    for (const w of widths) {
      if (w < origWidth) {
        await sharp(filePath)
          .resize(w)
          .webp({ quality: 80 })
          .toFile(path.join(publicDir, `${baseName}-${w}.webp`));

        await sharp(filePath)
          .resize(w)
          .avif({ quality: 75, effort: 4 })
          .toFile(path.join(publicDir, `${baseName}-${w}.avif`));
      }
    }

    await sharp(filePath)
      .webp({ quality: 82 })
      .toFile(path.join(publicDir, `${baseName}.webp`));

    await sharp(filePath)
      .avif({ quality: 78, effort: 4 })
      .toFile(path.join(publicDir, `${baseName}.avif`));
  }
}

convertImages().then(() => console.log('Done')).catch(err => console.error(err));
