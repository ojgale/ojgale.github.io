// Fails the build if any approved pairing drops below its WCAG level,
// or if a project uses a ground/accent pair outside the approved matrix.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const HEX = {
  cobalt: '#2433C2', marigold: '#F5B82E', pink: '#F7A8C9', paper: '#FFFDF8', ink: '#17120F',
  plum: '#6E1E5A', emerald: '#0B6E4F', tangerine: '#FF7A33',
};
const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(HEX[a]), lum(HEX[b])].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [text, ground, minimum]
const PAIRS = [
  ['paper', 'cobalt', 4.5], ['marigold', 'cobalt', 4.5], ['pink', 'cobalt', 4.5], ['tangerine', 'cobalt', 3],
  ['ink', 'marigold', 4.5], ['plum', 'marigold', 4.5], ['cobalt', 'marigold', 4.5],
  ['ink', 'pink', 4.5], ['plum', 'pink', 4.5], ['cobalt', 'pink', 4.5],
  ['ink', 'paper', 4.5], ['plum', 'paper', 4.5], ['cobalt', 'paper', 4.5], ['emerald', 'paper', 4.5],
  ['paper', 'ink', 4.5],
];
let bad = 0;
for (const [t, g, min] of PAIRS) {
  const r = ratio(t, g);
  const ok = r >= min;
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${t} on ${g}: ${r.toFixed(2)} (needs ${min})`);
}
const allowed = PAIRS.filter((p) => p[2] >= 4.5).map((p) => `${p[0]}/${p[1]}`);
const dir = path.resolve(import.meta.dirname, '../src/content/projects');
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
  if (!allowed.includes(`${data.accent}/${data.ground}`)) { bad++; console.log(`FAIL ${f}: ${data.accent} on ${data.ground} is not an approved pairing`); }
}
if (bad) { console.error(`\n${bad} contrast problem(s).`); process.exit(1); }
console.log('\nAll pairings pass WCAG 2.2 AA.');
