// Draws the "OG" monogram in Instrument Serif (ink on paper) as outlined SVG paths,
// so the favicon doesn't depend on the font being installed. Run once: npm run favicon
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const font = opentype.loadSync(path.join(root, 'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff'));
const size = 46;
const glyphs = font.getPath('OG', 0, 0, size);
const box = glyphs.getBoundingBox();
const w = box.x2 - box.x1, h = box.y2 - box.y1;
const dx = (64 - w) / 2 - box.x1, dy = (64 - h) / 2 - box.y1;
const d = font.getPath('OG', dx, dy, size).toPathData(2);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#FFFDF8"/><path d="${d}" fill="#17120F"/></svg>\n`;
fs.writeFileSync(path.join(root, 'public/favicon.svg'), svg);
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(path.join(root, 'public/apple-touch-icon.png'));
console.log('Wrote public/favicon.svg and public/apple-touch-icon.png');
