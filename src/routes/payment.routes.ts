import { Router } from "express";
import { PaymentController } from "@/controllers/payment.controller";
import { PaymentService } from "@/services/payment.service";
import { requireAuth } from "@/middleware/authMiddleware";
import { validateRequest } from "@/middleware/validateRequest";
import {
  createPaymentSchema,
  paypalPaymentSchema,
  webhookSchema,
} from "@/validators/payment.validator";

const router = Router();
const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing using JazzCash or Bank account
 */

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Create a payment intent (JazzCash or Bank)
 *     description: Creates a payment record for an order using JazzCash or Bank method.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - method
 *               - amount
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order being paid for.
 *               method:
 *                 type: string
 *                 enum: [JAZZCASH, BANK]
 *                 description: Payment method type.
 *               amount:
 *                 type: number
 *                 description: Total amount to be paid.
 *     responses:
 *       201:
 *         description: Payment intent created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientSecret:
 *                       type: string
 *                       description: Simulated client secret for frontend payment processing.
 */
router.post(
  "/create",
  requireAuth,
  validateRequest(createPaymentSchema),
  paymentController.create
);

/**
 * @swagger
 * /api/payments/paypal:
 *   post:
 *     summary: Process a PayPal payment
 *     description: Simulates a PayPal payment process and returns a transaction response.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - amount
 *             properties:
 *               orderId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: PayPal payment processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [PENDING, SUCCESS, FAILED]
 */
router.post(
  "/paypal",
  requireAuth,
  validateRequest(paypalPaymentSchema),
  paymentController.paypal
);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Handle payment provider webhook
 *     description: Handles payment status updates from JazzCash, Bank, or PayPal providers.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - data
 *             properties:
 *               event:
 *                 type: string
 *                 description: Event type, e.g., "payment_success" or "payment_failed".
 *               data:
 *                 type: object
 *                 description: Webhook payload from payment provider.
 *     responses:
 *       200:
 *         description: Webhook received and processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 */
router.post(
  "/webhook",
  validateRequest(webhookSchema),
  paymentController.webhook
);

/**
 * @swagger
 * /api/payments/{orderId}:
 *   get:
 *     summary: Get payment status for an order
 *     description: Retrieves payment information for a specific order.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order whose payment status to fetch.
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentId:
 *                       type: string
 *                     status:
 *                       type: string
 *                     amount:
 *                       type: number
 */
router.get("/:orderId", requireAuth, paymentController.getByOrder);

export default router;
