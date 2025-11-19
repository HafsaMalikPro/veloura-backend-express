import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    amount: z.number().positive(),
    method: z.enum(["JAZZCASH", "BANK"])
  })
});

export const paypalPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    amount: z.number().positive()
  })
});

export const webhookSchema = z.object({
  body: z.record(z.string(), z.any())
});
