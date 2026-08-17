const sharp = require('sharp');
const path = require('path');

async function generateResponsiveImages() {
  const root = process.cwd();
  const file = path.join(root, 'public', 'camera-lens-transparent-cutout.png');
  const meta = await sharp(file).metadata();
  console.log('Cutout image dimensions:', meta.width, 'x', meta.height, 'Has Alpha:', meta.hasAlpha);

  const widths = [480, 768, 1280, 1920];

  for (const w of widths) {
    await sharp(file)
      .resize(w)
      .webp({ quality: 85, alphaQuality: 100 })
      .toFile(path.join(root, 'public', `camera-lens-transparent-cutout-${w}.webp`));

    await sharp(file)
      .resize(w)
      .avif({ quality: 80, effort: 4 })
      .toFile(path.join(root, 'public', `camera-lens-transparent-cutout-${w}.avif`));
  }

  await sharp(file)
    .webp({ quality: 88, alphaQuality: 100 })
    .toFile(path.join(root, 'public', 'camera-lens-transparent-cutout.webp'));

  await sharp(file)
    .avif({ quality: 82, effort: 4 })
    .toFile(path.join(root, 'public', 'camera-lens-transparent-cutout.avif'));

  console.log('Generated all responsive WebP and AVIF files with transparent alpha channels!');
}

generateResponsiveImages().catch(console.error);
