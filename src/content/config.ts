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

export const collections = { posts, videos };