import { Router } from "express";
import { CategoryController } from "@/controllers/category.controller";
import { CategoryService } from "@/services/category.service";
import { requireAuth, requireRole } from "@/middleware/authMiddleware";
import { validateRequest } from "@/middleware/validateRequest";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/validators/category.validator";

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manage product categories and tags
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories and tags
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories and tags
 */
router.get("/", categoryController.getAll);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category or tag (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Earrings"
 *               type:
 *                 type: string
 *                 example: "Jewelry"
 *               description:
 *                 type: string
 *                 example: "Elegant earrings for all occasions"
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post(
  "/",
  requireAuth,
  requireRole(["ADMIN"]),
  validateRequest(createCategorySchema),
  categoryController.create
);

/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Update a category or tag (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put(
  "/:categoryId",
  requireAuth,
  requireRole(["ADMIN"]),
  validateRequest(updateCategorySchema),
  categoryController.update
);

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     summary: Delete a category or tag (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete(
  "/:categoryId",
  requireAuth,
  requireRole(["ADMIN"]),
  categoryController.delete
);

export default router;
