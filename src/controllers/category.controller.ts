import { Request, Response, NextFunction } from "express";
import { CategoryService } from "@/services/category.service";
import { BaseController } from "./base.controller";

export class CategoryController extends BaseController {
  constructor(private categoryService: CategoryService) {
    super();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.categoryService.getAllCategories();
    });
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.categoryService.createCategory(req.body);
    });
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.categoryService.updateCategory(req.params.categoryId, req.body);
    });
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.categoryService.deleteCategory(req.params.categoryId);
    });
  };
}
