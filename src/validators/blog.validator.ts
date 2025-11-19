import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    author: z.string().min(2),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const addCommentSchema = z.object({
  body: z.object({
    author: z.string().min(2),
    content: z.string().min(3),
  }),
});
