import { Router } from "express";
import { OrderController } from "@/controllers/order.controller";
import { OrderService } from "@/services/order.service";
import { requireAuth, requireRole } from "@/middleware/authMiddleware";
import { validateRequest } from "@/middleware/validateRequest";
import {
  createOrderSchema,
  updateStatusSchema,
  cancelOrderSchema,
} from "@/validators/order.validator";

const router = Router();
const orderService = new OrderService();
const orderController = new OrderController(orderService);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Manage customer orders
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               billingAddress:
 *                 type: object
 *               shippingAddress:
 *                 type: object
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post(
  "/",
  requireAuth,
  validateRequest(createOrderSchema),
  orderController.create
);

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Get a user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user orders
 */
router.get("/:userId", requireAuth, orderController.getUserOrders);

/**
 * @swagger
 * /orders/details/{orderId}:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 */
router.get("/details/:orderId", requireAuth, orderController.getOrderById);

/**
 * @swagger
 * /orders/{orderId}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put(
  "/:orderId/status",
  requireAuth,
  requireRole(["ADMIN"]),
  validateRequest(updateStatusSchema),
  orderController.updateStatus
);

/**
 * @swagger
 * /orders/{orderId}/cancel:
 *   post:
 *     summary: Cancel an order (User or Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled
 */
router.post(
  "/:orderId/cancel",
  requireAuth,
  validateRequest(cancelOrderSchema),
  orderController.cancelOrder
);

export default router;
