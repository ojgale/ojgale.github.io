import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Which accent colors may sit on which ground (from the approved WCAG matrix).
export const ALLOWED_ACCENTS = {
  cobalt: ['marigold', 'pink'],
  marigold: ['plum', 'cobalt'],
  pink: ['plum', 'cobalt'],
} as const;

const color = z.enum(['cobalt', 'marigold', 'pink', 'paper', 'ink', 'plum', 'emerald', 'tangerine']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      phrase: z.string(), // the italic "pop" half of the title
      summary: z.string(), // one line for the work lists
      type: z.enum(['Assembled', 'Curated', 'Researched']),
      year: z.string(),
      role: z.string(),
      partners: z.string(),
      timeline: z.string(),
      methods: z.string(),
      outcome: z.string(),
      ground: z.enum(['cobalt', 'marigold', 'pink']),
      accent: z.enum(['marigold', 'pink', 'plum', 'cobalt']),
      duotone: z.object({ dark: color, light: color }),
      images: z
        .array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }))
        .default([]),
      featured: z.boolean().default(false),
      order: z.number().default(99),
      draft: z.boolean().default(false),
    })
    .refine((p) => (ALLOWED_ACCENTS[p.ground] as readonly string[]).includes(p.accent), {
      message: 'accent is not an allowed pairing on this ground (see the WCAG matrix)',
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    phrase: z.string().optional(),
    updated: z.string().optional(),
    questions: z
      .array(z.object({ q: z.string(), from: z.string(), links: z.array(z.string()).default([]) }))
      .optional(),
  }),
});

export const collections = { projects, pages };
