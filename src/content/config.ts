import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

const videos = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    url: z.string(),
    thumbnail: z.string().optional(),
  }),
});

const tools = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string(),
    status: z.enum(['live', 'wip']),
    tags: z.string().optional(),
  }),
});

const resources = defineCollection({
  schema: z.object({
    title: z.string(),
    level: z.string(),
    topic: z.string(),
    worksheet: z.string().optional(),
    solutions: z.string().optional(),
  }),
});
export const collections = { posts, videos, tools, resources };
