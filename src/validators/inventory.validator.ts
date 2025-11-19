import { z } from "zod";

export const updateStockSchema = z.object({
  body: z.object({
    stock: z.number().int().nonnegative(),
  }),
});

export const stockItemsSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    ),
  }),
});
