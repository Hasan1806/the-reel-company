const sharp = require('sharp');

async function process() {
  const file = 'public/hero-camera-full.jpg';
  const meta = await sharp(file).metadata();
  console.log('Original image dimensions:', meta.width, 'x', meta.height);

  const widths = [480, 768, 1280, 1920];

  for (const w of widths) {
    await sharp(file)
      .resize(w)
      .webp({ quality: 82 })
      .toFile(`public/hero-camera-full-${w}.webp`);

    await sharp(file)
      .resize(w)
      .avif({ quality: 78, effort: 4 })
      .toFile(`public/hero-camera-full-${w}.avif`);
  }

  await sharp(file)
    .webp({ quality: 85 })
    .toFile('public/hero-camera-full.webp');

  await sharp(file)
    .avif({ quality: 80, effort: 4 })
    .toFile('public/hero-camera-full.avif');

  console.log('All responsive AVIF and WebP sizes generated!');
}

process().catch(console.error);
