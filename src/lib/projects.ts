import { getCollection } from 'astro:content';

export async function getProjects() {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

// The bright partner that pull quotes sit on, per ground.
export const partnerOf = { cobalt: 'marigold', marigold: 'pink', pink: 'marigold' } as const;
