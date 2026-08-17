const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(process.cwd(), 'public', 'camera-lens-black-center-hero.jpg');
const outputPath = path.join(process.cwd(), 'public', 'camera-lens-transparent-cutout.png');

async function cutoutLens() {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width;
  const height = metadata.height;

  const cx = width / 2;
  const cy = height / 2;
  // Precise radius preserving the outer circular rim cleanly
  const radius = width * 0.415;

  const svgMask = Buffer.from(
    `<svg width="${width}" height="${height}">
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="white" />
    </svg>`
  );

  const maskPng = await sharp(svgMask).png().toBuffer();

  await image
    .ensureAlpha()
    .composite([{ input: maskPng, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log('Successfully generated transparent camera lens cutout PNG!');
}

cutoutLens().catch(console.error);
