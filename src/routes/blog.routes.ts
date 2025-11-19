import { Router } from "express";
import { BlogController } from "@/controllers/blog.controller";
import { BlogService } from "@/services/blog.service";
import { requireAuth, requireRole } from "@/middleware/authMiddleware";
import { validateRequest } from "@/middleware/validateRequest";
import {
  createBlogSchema,
  updateBlogSchema,
  addCommentSchema,
} from "@/validators/blog.validator";

const router = Router();
const blogService = new BlogService();
const blogController = new BlogController(blogService);

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Manage blog posts and comments
 */

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: List blog posts with optional filters (category, tag)
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blog posts
 */
router.get("/", blogController.getAll);

/**
 * @swagger
 * /blog/{postId}:
 *   get:
 *     summary: Get a specific blog post by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog post details
 */
router.get("/:postId", blogController.getById);

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a new blog post (Admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogPost'
 *     responses:
 *       201:
 *         description: Post created
 */
router.post(
  "/",
  requireAuth,
  requireRole(["ADMIN"]),
  validateRequest(createBlogSchema),
  blogController.create
);

/**
 * @swagger
 * /blog/{postId}:
 *   put:
 *     summary: Update a blog post (Admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post updated
 */
router.put(
  "/:postId",
  requireAuth,
  requireRole(["ADMIN"]),
  validateRequest(updateBlogSchema),
  blogController.update
);

/**
 * @swagger
 * /blog/{postId}:
 *   delete:
 *     summary: Delete a blog post (Admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete(
  "/:postId",
  requireAuth,
  requireRole(["ADMIN"]),
  blogController.delete
);

/**
 * @swagger
 * /blog/{postId}/comments:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post(
  "/:postId/comments",
  validateRequest(addCommentSchema),
  blogController.addComment
);

/**
 * @swagger
 * /blog/{postId}/comments/{commentId}/approve:
 *   put:
 *     summary: Approve a comment (Admin only)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment approved
 */
router.put(
  "/:postId/comments/:commentId/approve",
  requireAuth,
  requireRole(["ADMIN"]),
  blogController.approveComment
);

export default router;
