import { Router } from "express";
import { validateRequest } from "@/middleware/validateRequest";
import {
  updateStockSchema,
  stockItemsSchema,
} from "@/validators/inventory.validator";
import { requireAuth, requireRole } from "@/middleware/authMiddleware";
import { InventoryService } from "@/services/inventory.service";
import { InventoryController } from "@/controllers/inventory.controller";

const router = Router();
const inventoryService = new InventoryService();
const inventoryController = new InventoryController(inventoryService);

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         productId:
 *           type: string
 *           format: uuid
 *         stock:
 *           type: integer
 *           example: 100
 *         reserved:
 *           type: integer
 *           example: 10
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /inventory/{productId}:
 *   get:
 *     summary: Get inventory details for a specific product
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Inventory details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventory not found for this product
 */
router.get("/:productId", inventoryController.getStock);

/**
 * @swagger
 * /inventory/{productId}:
 *   put:
 *     summary: Update inventory stock (Admin only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Product not found
 */
router.put(
  "/:productId",
  requireAuth,
  requireRole(["ADMIN"]),
  validateRequest(updateStockSchema),
  inventoryController.updateStock
);

/**
 * @swagger
 * /inventory/reserve:
 *   post:
 *     summary: Reserve stock for cart items (User or Admin)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       200:
 *         description: Stock reserved successfully
 *       400:
 *         description: Insufficient stock or invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory not found for one or more products
 */
router.post(
  "/reserve",
  requireAuth,
  validateRequest(stockItemsSchema),
  inventoryController.reserveStock
);

/**
 * @swagger
 * /inventory/release:
 *   post:
 *     summary: Release reserved stock (User or Admin)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Reserved stock released successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Inventory not found for one or more products
 */
router.post(
  "/release",
  requireAuth,
  validateRequest(stockItemsSchema),
  inventoryController.releaseStock
);

export default router;
