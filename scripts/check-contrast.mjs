// Fails the build if any text/background pair the design uses drops below WCAG 2.2 AA.
// Small text needs 4.5:1; large text (24px+, or 18.7px+ bold) needs 3:1.
// Colors come from src/palette.json, the same file the site uses.
import fs from 'node:fs';
import path from 'node:path';

const HEX = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../src/palette.json'), 'utf8'));
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(HEX[a]), lum(HEX[b])].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const SMALL = 4.5, LARGE = 3;
// [text, background, minimum, where it's used]
const PAIRS = [
  ['ink', 'paper', SMALL, 'nav, headings, home text'],
  ['body', 'paper', SMALL, 'long-form paragraphs'],
  ['muted', 'paper', SMALL, 'photo captions, map and legend labels'],
  ['oxblood', 'paper', SMALL, 'section numbers, links on hover, pull quotes'],
  ['ink', 'lilac', SMALL, 'DAN header, stat labels, tiles, footer, Next band'],
  ['oxblood', 'lilac', SMALL, 'DAN subtitle, stat numbers, footer "Let\'s talk"'],
  ['ink', 'olive', SMALL, 'SDDW and About headers, guiding-question label, Recognition tile'],
  ['oxblood', 'olive', LARGE, 'SDDW subtitle (26px italic)'],
  ['paper', 'olive', LARGE, 'how-might-we question (30px) and "How might we" (44px+)'],
  ['paper', 'oxblood', SMALL, 'Conference header, tiles, Next band, dark-mode numbers band'],
  ['lilac', 'oxblood', LARGE, 'Conference subtitle (26px italic)'],
  ['paper', 'ink', SMALL, 'Why-learn header, numbers band, dark mode text'],
  ['lilac', 'ink', SMALL, 'Why-learn subtitle, dark-mode accent and link hover'],
  ['mutedDark', 'ink', SMALL, 'dark-mode muted text'],
  ['ink', 'stone', SMALL, 'Housing "coming soon" tile'],
  ['ink', 'warm', SMALL, 'Conference cards'],
  ['oxblood', 'warm', SMALL, 'Conference card dates'],
  ['muted', 'map', SMALL, 'DAN flower legend'],
];

let bad = 0;
for (const [t, g, min, use] of PAIRS) {
  const r = ratio(t, g);
  const ok = r >= min;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${t} on ${g}: ${r.toFixed(2)} (needs ${min}) · ${use}`);
}
if (bad) { console.error(`\n${bad} contrast problem(s).`); process.exit(1); }
console.log('\nAll pairs pass WCAG 2.2 AA.');
