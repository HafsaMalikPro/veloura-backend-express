import { Router } from "express";
import { requireAuth, requireRole } from "@/middleware/authMiddleware";
import { cache } from "@/middleware/cacheMiddleware";
import { ProductService } from "@/services/product.service";
import { ProductController } from "@/controllers/product.controller";
import {
  createProductSchema,
  updateProductSchema,
} from "@/validators/product.validator";
import { upload } from "@/config/multer";

const router = Router();
const productService = new ProductService();
const productController = new ProductController(productService);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         discount:
 *           type: number
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         image:
 *           type: string
 *         stock:
 *           type: number
 *         attributes:
 *           type: object
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with filtering and sorting
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", cache({ duration: 300 }), productController.getAll);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:productId", cache({ duration: 60 }), productController.getProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - stock
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discount:
 *                 type: number
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               stock:
 *                 type: number
 *               attributes:
 *                 type: object
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  "/",
  requireAuth,
  requireRole(["ADMIN"]),
  upload.single("image"),
  productController.create
);


/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Update existing product (Admin only)
 *     tags: [Products]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               description:
 *                 type: string
 *                 example: "Updated product description"
 *               price:
 *                 type: number
 *                 example: 149.99
 *               discount:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: "Earrings"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["gift", "silver"]
 *               stock:
 *                 type: number
 *                 example: 25
 *               attributes:
 *                 type: object
 *                 example: {"color":"silver","size":"medium"}
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Product not found
 */
router.put(
  "/:productId",
  requireAuth,
  requireRole(["ADMIN"]),
  upload.single("image"),
  productController.update
);

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:productId",
  requireAuth,
  requireRole(["ADMIN"]),
  productController.delete
);

export default router;