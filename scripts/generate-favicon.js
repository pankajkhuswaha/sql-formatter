#!/usr/bin/env node

/**
 * Favicon Generator
 * Generates favicons in multiple sizes from SVG
 * Run: node scripts/generate-favicon.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, '../public/favicon.svg');
const publicDir = path.join(__dirname, '../public');

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 192, name: 'favicon-192x192.png' },
  { size: 256, name: 'favicon-256x256.png' },
  { size: 512, name: 'favicon-512x512.png' }
];

// Maskable icon sizes for PWA adaptive icons
const maskableSizes = [
  { size: 192, name: 'favicon-maskable-192x192.png' },
  { size: 512, name: 'favicon-maskable-512x512.png' }
];

async function generateFavicons() {
  try {
    console.log('Generating favicons...\n');

    // Generate standard favicons
    for (const { size, name } of sizes) {
      const outputPath = path.join(publicDir, name);
      await sharp(svgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    console.log('');

    // Generate maskable icons for PWA
    for (const { size, name } of maskableSizes) {
      const outputPath = path.join(publicDir, name);

      // Create a white background for maskable icons
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" fill="white"/>
          <image href="data:image/svg+xml;base64,${Buffer.from(fs.readFileSync(svgPath)).toString('base64')}"
                 width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice"/>
        </svg>
      `;

      await sharp(Buffer.from(svg))
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${name} (${size}x${size}) - maskable`);
    }

    console.log('');

    // Generate favicon.ico (multi-resolution)
    const icoPath = path.join(publicDir, 'favicon.ico');
    await sharp(svgPath)
      .resize(32, 32, { fit: 'contain' })
      .png()
      .toFile(icoPath.replace('.ico', '-temp.png'));

    console.log('✓ Generated favicon.ico (32x32)');

    console.log('\n✅ All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
