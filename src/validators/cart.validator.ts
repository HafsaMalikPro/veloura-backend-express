import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    attributes: z.record(z.string(), z.any()).optional(),
  }),
});

export const updateCartSchema = z.object({
  body: z.object({
    productId: z.string(),
    quantity: z.number().optional(),
    attributes: z.record(z.string(), z.any()).optional(),
  }),
});

export const applyCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3),
  }),
});
