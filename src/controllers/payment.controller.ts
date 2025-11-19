import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller";
import { PaymentService } from "@/services/payment.service";

export class PaymentController extends BaseController {
  constructor(private paymentService: PaymentService) {
    super();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { orderId, amount, method } = req.body;
      return await this.paymentService.createPaymentIntent(req.user!.userId, orderId, amount, method);
    });
  };

  paypal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { orderId, amount } = req.body;
      return await this.paymentService.processPayPalPayment(req.user!.userId, orderId, amount);
    });
  };

  webhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.paymentService.handleWebhook(req.body);
    });
  };

  getByOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.paymentService.getPaymentStatus(req.params.orderId);
    });
  };
}
