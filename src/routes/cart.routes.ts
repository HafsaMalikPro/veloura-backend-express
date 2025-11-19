import { Router } from "express";
import { CartService } from "@/services/cart.service";
import { CartController } from "@/controllers/cart.controller";
import { requireAuth } from "@/middleware/authMiddleware";
import { validateRequest } from "@/middleware/validateRequest";
import {
  addCartItemSchema,
  updateCartSchema,
  applyCouponSchema,
} from "@/validators/cart.validator";

const router = Router();
const cartService = new CartService();
const cartController = new CartController(cartService);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
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
 *         description: Returns user's cart
 */
router.get("/:userId", requireAuth, cartController.getCart);

/**
 * @swagger
 * /cart/{userId}:
 *   post:
 *     summary: Add item to user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, name, price, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               attributes:
 *                 type: object
 *     responses:
 *       201:
 *         description: Item added to cart
 */
router.post(
  "/:userId",
  requireAuth,
  validateRequest(addCartItemSchema),
  cartController.addItem
);

/**
 * @swagger
 * /cart/{userId}:
 *   put:
 *     summary: Update cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               attributes:
 *                 type: object
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.put(
  "/:userId",
  requireAuth,
  validateRequest(updateCartSchema),
  cartController.updateItem
);

/**
 * @swagger
 * /cart/{userId}/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete("/:userId/:productId", requireAuth, cartController.removeItem);

/**
 * @swagger
 * /cart/{userId}/coupon:
 *   post:
 *     summary: Apply coupon to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coupon applied
 */
router.post(
  "/:userId/coupon",
  requireAuth,
  validateRequest(applyCouponSchema),
  cartController.applyCoupon
);

/**
 * @swagger
 * /cart/guest/{sessionId}:
 *   get:
 *     summary: Get guest cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns guest cart
 */
router.get("/guest/:sessionId", cartController.getGuestCart);

/**
 * @swagger
 * /cart/guest/{sessionId}:
 *   post:
 *     summary: Add item to guest cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               attributes:
 *                 type: object
 *     responses:
 *       201:
 *         description: Item added to guest cart
 */
router.post("/guest/:sessionId", cartController.addGuestItem);

export default router;
