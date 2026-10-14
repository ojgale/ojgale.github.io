// Colors a page header, home tile or "Next project" band can use. Each is a data-band value;
// its light and dark versions live in src/styles/global.css and are checked by scripts/check-contrast.mjs.
export const BANDS = ['lilac', 'oxblood', 'olive', 'ink', 'stone'] as const;
export type Band = (typeof BANDS)[number];

// Colors that can sit behind photos (data-tint).
export const TINTS = ['lilac', 'oxblood', 'olive'] as const;
