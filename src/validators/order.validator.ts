import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    userId: z.string(),
    billingAddress: z.record(z.string(), z.any()).optional(),
    shippingAddress: z.record(z.string(), z.any()).optional(),
    paymentMethod: z.string().optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  }),
});

export const cancelOrderSchema = z.object({
  params: z.object({
    orderId: z.string(),
  }),
});
