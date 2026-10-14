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
// [theme, text, background, minimum, where it's used]
const PAIRS = [
  // Light theme
  ['light', 'ink', 'paper', SMALL, 'header, headings, home text, card and badge text'],
  ['light', 'body', 'paper', SMALL, 'long-form paragraphs'],
  ['light', 'muted', 'paper', SMALL, 'photo captions, map legend'],
  ['light', 'oxblood', 'paper', SMALL, 'section numbers, links on hover, pull quotes'],
  ['light', 'ink', 'lilac', SMALL, 'DAN header, stat labels, tiles, footer, Next band, About highlights'],
  ['light', 'oxblood', 'lilac', SMALL, 'DAN subtitle, stat numbers, footer "Let\'s talk", About highlight italics'],
  ['light', 'ink', 'olive', SMALL, 'SDDW and About headers, guiding-question label, Recognition tile'],
  ['light', 'oxblood', 'olive', LARGE, 'SDDW subtitle (26px italic)'],
  ['light', 'paper', 'olive', LARGE, 'how-might-we question (26px+) and "How might we" (44px+)'],
  ['light', 'paper', 'oxblood', SMALL, 'Conference header, tiles, Next band'],
  ['light', 'lilac', 'oxblood', LARGE, 'Conference subtitle (26px italic)'],
  ['light', 'paper', 'ink', SMALL, 'Why-learn header, numbers band'],
  ['light', 'lilac', 'ink', SMALL, 'Why-learn subtitle, About title highlight'],
  ['light', 'ink', 'stone', SMALL, 'Housing "coming soon" tile'],
  ['light', 'ink', 'warm', SMALL, 'Conference cards'],
  ['light', 'oxblood', 'warm', SMALL, 'Conference card dates'],
  ['light', 'muted', 'map', SMALL, 'DAN flower legend (inside its own light panel in both themes)'],
  // Dark theme
  ['dark', 'paper', 'ink', SMALL, 'header, headings, home text'],
  ['dark', 'bodyDark', 'ink', SMALL, 'long-form paragraphs'],
  ['dark', 'mutedDark', 'ink', SMALL, 'photo captions, map legend'],
  ['dark', 'lilac', 'ink', SMALL, 'accent: section numbers, links on hover, pull quotes, About title highlight'],
  ['dark', 'paper', 'lilacDeep', SMALL, 'lilac bands, stat labels, footer, About highlights'],
  ['dark', 'lilac', 'lilacDeep', SMALL, 'lilac-band subtitle, stat numbers, footer "Let\'s talk"'],
  ['dark', 'paper', 'oxblood', SMALL, 'Conference header, tiles, Next band, numbers band'],
  ['dark', 'lilac', 'oxblood', SMALL, 'Conference subtitle'],
  ['dark', 'paper', 'oliveDeep', SMALL, 'olive bands, how-might-we card, Recognition tile'],
  ['dark', 'oliveLight', 'oliveDeep', SMALL, 'olive-band subtitle, guiding-question label'],
  ['dark', 'paper', 'inkRaised', SMALL, 'ink band (Why-learn header), Conference cards'],
  ['dark', 'lilac', 'inkRaised', SMALL, 'Why-learn subtitle, card dates'],
  ['dark', 'paper', 'stoneDeep', SMALL, 'Housing "coming soon" tile'],
  ['dark', 'ink', 'paper', SMALL, '"Coming soon" badge'],
];

let bad = 0;
for (const [theme, t, g, min, use] of PAIRS) {
  const r = ratio(t, g);
  const ok = r >= min;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} [${theme}] ${t} on ${g}: ${r.toFixed(2)} (needs ${min}) · ${use}`);
}
if (bad) { console.error(`\n${bad} contrast problem(s).`); process.exit(1); }
console.log('\nAll pairs pass WCAG 2.2 AA in both themes.');
