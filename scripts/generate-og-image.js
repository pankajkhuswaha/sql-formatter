#!/usr/bin/env node

/**
 * OG Image Generator
 * Converts SVG to PNG using Sharp
 * Run: node scripts/generate-og-image.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, '../public/og-image.svg');
const pngPath = path.join(__dirname, '../public/og-image.png');

async function generateOGImage() {
  try {
    console.log('Generating OG image...');

    await sharp(svgPath)
      .png()
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 10, g: 10, b: 14, alpha: 1 }
      })
      .toFile(pngPath);

    console.log(`✓ OG image generated: ${pngPath}`);
    console.log(`✓ Image size: 1200x630px`);
  } catch (error) {
    console.error('Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOGImage();
