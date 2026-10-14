import palette from '../palette.json';

// Colors a page header, tile or "Next project" band can use.
export const BANDS = ['lilac', 'oxblood', 'olive', 'ink', 'stone'] as const;
export type Band = (typeof BANDS)[number];

// Text color that sits on each band (checked by scripts/check-contrast.mjs).
const TEXT_ON: Record<Band, keyof typeof palette> = {
  lilac: 'ink', oxblood: 'paper', olive: 'ink', ink: 'paper', stone: 'ink',
};
// Italic subtitle color in a project header.
const SUBTITLE_ON: Record<Band, keyof typeof palette> = {
  lilac: 'oxblood', oxblood: 'lilac', olive: 'oxblood', ink: 'lilac', stone: 'ink',
};

export const hex = (name: keyof typeof palette) => palette[name];
export const bandStyle = (band: Band) => `background: ${palette[band]}; color: ${palette[TEXT_ON[band]]};`;
export const subtitleColor = (band: Band) => palette[SUBTITLE_ON[band]];
