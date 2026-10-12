// Applies each project's duotone to its photos.
// Recipe (from the visual direction): desaturate -> lift contrast ~15% ->
// map shadows to the deep color and highlights to the bright partner -> 6-10% grain.
// Usage: put originals in images-src/, list them in a project's `images`, run `npm run images`.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import matter from 'gray-matter';

const HEX = {
  cobalt: '#2433C2', marigold: '#F5B82E', pink: '#F7A8C9', paper: '#FFFDF8', ink: '#17120F',
  plum: '#6E1E5A', emerald: '#0B6E4F', tangerine: '#FF7A33',
};
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// deterministic grain so rebuilds don't churn the files
function rand(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

async function duotone(src, out, dark, light, width = 1400) {
  const { data, info } = await sharp(src).rotate().resize({ width, withoutEnlargement: true })
    .greyscale().raw().toBuffer({ resolveWithObject: true });
  const d = rgb(HEX[dark]), l = rgb(HEX[light]);
  const px = Buffer.alloc(info.width * info.height * 3);
  const r = rand(7);
  for (let i = 0; i < info.width * info.height; i++) {
    let t = data[i * info.channels] / 255;
    t = Math.min(1, Math.max(0, (t - 0.5) * 1.15 + 0.5)); // +15% contrast
    const g = (r() - 0.5) * 0.16; // ~8% grain
    for (let c = 0; c < 3; c++) {
      const v = d[c] + (l[c] - d[c]) * t + g * 255;
      px[i * 3 + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }
  await sharp(px, { raw: { width: info.width, height: info.height, channels: 3 } })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(out);
}

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'src/content/projects');
fs.mkdirSync(path.join(root, 'public/images'), { recursive: true });

for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const img of data.images || []) {
    const name = path.basename(img.src);
    const src = path.join(root, 'images-src', name);
    if (!fs.existsSync(src)) { console.warn(`missing source: images-src/${name}`); continue; }
    await duotone(src, path.join(root, 'public/images', name), data.duotone.dark, data.duotone.light);
    console.log(`${name}: ${data.duotone.dark} -> ${data.duotone.light}`);
  }
}

// The one portrait (About) stays in natural color, just resized.
const portrait = path.join(root, 'images-src/portrait.jpg');
if (fs.existsSync(portrait)) {
  await sharp(portrait).rotate().resize({ width: 900 }).jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(root, 'public/images/portrait.jpg'));
  console.log('portrait.jpg: resized');
}
