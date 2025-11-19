import { PrismaClient } from "@prisma/client";
import { AppError } from "@/utils/appError";
import { JazzCash } from "@/utils/jazzcash";

const prisma = new PrismaClient();

export class PaymentService {
  async createPaymentIntent(userId: string, orderId: string, amount: number, method: string) {
    if (method === "JAZZCASH") {
      const txn = await JazzCash.createTransaction(amount, orderId);

      const payment = await prisma.payment.create({
        data: {
          orderId,
          userId,
          amount,
          method,
          transactionId: txn.transactionId,
          status: "PENDING"
        }
      });

      return { clientSecret: txn.clientSecret, transactionId: payment.transactionId };
    }

    // Manual Bank Transfer
    if (method === "BANK") {
      const payment = await prisma.payment.create({
        data: {
          orderId,
          userId,
          amount,
          method,
          reference: "BANK-" + Date.now(),
          status: "PENDING"
        }
      });

      return {
        message: "Bank payment created. Awaiting manual confirmation.",
        reference: payment.reference
      };
    }

    throw new AppError("Unsupported payment method", 400);
  }

  async processPayPalPayment(userId: string, orderId: string, amount: number) {
    // Mock (for test)
    const payment = await prisma.payment.create({
      data: { orderId, userId, amount, method: "PAYPAL", status: "SUCCESS" }
    });
    return { paymentId: payment.id, status: payment.status };
  }

  async handleWebhook(payload: any) {
    // Mock webhook
    console.log("Webhook payload:", payload);
    return { received: true };
  }

  async getPaymentStatus(orderId: string) {
    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new AppError("Payment not found", 404);
    return {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount
    };
  }
}
