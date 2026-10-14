import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { BANDS, TINTS } from './lib/colors';

const band = z.enum(BANDS);

const projects = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(), // a line break in the title (YAML "|") is kept in the page heading
    shortTitle: z.string().optional(), // for the home tile and the "Next project" band
    subtitle: z.string(),
    tagline: z.string(), // italic phrase in the "Next project" band
    eyebrow: z.string(), // small label above the title, e.g. "Assembled · 2023 to 2025"
    description: z.string().optional(), // search and social preview; defaults to the subtitle
    slug: z.string(),
    order: z.number(),
    featured: z.boolean().default(true),
    draft: z.boolean().default(false),
    next: z.string(), // slug of the project linked at the bottom

    headerColor: band,
    tileColor: band,
    tint: z.enum(TINTS), // color behind every photo on the page
    tileImage: z.string().optional(), // defaults to heroImage
    tilePosition: z.string().default('center'),

    heroImage: z.string(),
    heroAlt: z.string(),
    heroCaption: z.string(),
    heroPosition: z.string().default('center'),
    heroHeight: z.number().optional(), // px; leave out to use heroAspect
    heroAspect: z.string().default('3 / 2'),

    role: z.string(),
    partners: z.string(),
    dates: z.string(),
    methods: z.string(),
    recognition: z.string().optional(),
    howMightWe: z.string().optional(),
    tight: z.boolean().default(false), // slightly tighter spacing between sections (DAN)
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    phrase: z.string().optional(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    portrait: z.string().optional(),
    portraitAlt: z.string().optional(),
    portraitPosition: z.string().optional(),
    focusAreas: z.array(z.string()).optional(),
    description: z.string().optional(),
  }).passthrough(),
});

export const collections = { projects, pages };
