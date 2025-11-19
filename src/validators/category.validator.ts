import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required"),
    type: z.string().min(2, "Type is required"),
    description: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    type: z.string().optional(),
    description: z.string().optional(),
  }),
});
