import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(99),
    description: z.string().min(2).max(500).optional(),
    price: z.preprocess((v) => Number(v), z.number().positive()),
    discount: z.preprocess((v) => (v ? Number(v) : 0), z.number().min(0).max(100).optional()),
    category: z.string().min(2).max(50),
    tags: z.preprocess(
      (v) => (typeof v === "string" ? JSON.parse(v) : v),
      z.array(z.string()).optional()
    ),
    stock: z.preprocess((v) => Number(v), z.number().int().min(0)),
    attributes: z.preprocess(
      (v) => (typeof v === "string" ? JSON.parse(v) : v),
      z.record(z.string(), z.any()).optional() 
    ),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(99).optional(),
    description: z.string().min(2).max(500).optional(),
    price: z.preprocess((v) => Number(v), z.number().positive().optional()),
    discount: z.preprocess((v) => Number(v), z.number().min(0).max(100).optional()),
    category: z.string().min(2).max(50).optional(),
    tags: z.preprocess(
      (v) => (typeof v === "string" ? JSON.parse(v) : v),
      z.array(z.string()).optional()
    ),
    stock: z.preprocess((v) => Number(v), z.number().int().min(0).optional()),
    attributes: z.preprocess(
      (v) => (typeof v === "string" ? JSON.parse(v) : v),
      z.record(z.string(), z.any()).optional() 
    ),
  }),
  params: z.object({
    productId: z.string().uuid(),
  }),
});
