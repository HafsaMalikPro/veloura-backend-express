import { Request, Response, NextFunction } from "express";
import { BlogService } from "@/services/blog.service";
import { BaseController } from "./base.controller";
import { AppError } from "@/utils/appError";

export class BlogController extends BaseController {
  constructor(private blogService: BlogService) {
    super();
  }

  // GET /api/blog
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.blogService.getAll(req.query);
    });
  };

  // GET /api/blog/:postId
  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const post = await this.blogService.getById(req.params.postId);
      if (!post) throw new AppError("Post not found", 404);
      return post;
    });
  };

  // POST /api/blog
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.blogService.create(req.body);
    });
  };

  // PUT /api/blog/:postId
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.blogService.update(req.params.postId, req.body);
    });
  };

  // DELETE /api/blog/:postId
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      await this.blogService.delete(req.params.postId);
      return null;
    });
  };

  // POST /api/blog/:postId/comments
  addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.blogService.addComment(req.params.postId, req.body);
    });
  };

  // PUT /api/blog/:postId/comments/:commentId/approve
  approveComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.blogService.approveComment(req.params.postId, req.params.commentId);
    });
  };
}
