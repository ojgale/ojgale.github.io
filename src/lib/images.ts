import type { ImageMetadata } from 'astro';

// Every photo lives in src/assets/images/. Content files refer to them by file name
// ("dan-site-visit-hill.jpg") and Astro resizes them to WebP at build time.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{jpg,jpeg,png,webp}', { eager: true });

export function img(name: string): ImageMetadata {
  const found = files[`/src/assets/images/${name}`];
  if (!found) throw new Error(`Image "${name}" not found. Put it in src/assets/images/ and check the spelling.`);
  return found.default;
}
