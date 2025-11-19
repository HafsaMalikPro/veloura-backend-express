import { Request, Response, NextFunction } from "express";
import { ProductService } from "@/services/product.service";
import { BaseController } from "./base.controller";

export class ProductController extends BaseController {
  constructor(private productService: ProductService) {
    super();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      const { page, limit, category, priceMin, priceMax, sortBy } = req.query;
      return await this.productService.getAllProducts(
        Number(page) || 1,
        Number(limit) || 10,
        category as string,
        Number(priceMin) || undefined,
        Number(priceMax) || undefined,
        sortBy as string
      );
    });

  getProduct = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      return await this.productService.getProductById(req.params.productId);
    });

  create = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      const image = req.file ? `/uploads/products/${req.file.filename}` : undefined;
      const body = { ...req.body };

      const parseJSON = (value: any, fallback: any) => {
        if (!value) return fallback;
        try {
          if (typeof value === "string") {
            return value.startsWith("[") || value.startsWith("{")
              ? JSON.parse(value)
              : value.split(",").map((v) => v.trim());
          }
          return value;
        } catch {
          return fallback;
        }
      };

      const data = {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        discount: body.discount ? Number(body.discount) : 0,
        category: body.category,
        tags: parseJSON(body.tags, []),
        attributes: parseJSON(body.attributes, {}),
        stock: Number(body.stock),
        image,
      };

return await this.productService.createProduct(data as any);
    });

  update = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      const image = req.file ? `/uploads/products/${req.file.filename}` : undefined;
      const body = { ...req.body };

      const parseJSON = (value: any, fallback: any) => {
        if (!value) return fallback;
        try {
          if (typeof value === "string") {
            return value.startsWith("[") || value.startsWith("{")
              ? JSON.parse(value)
              : value.split(",").map((v) => v.trim());
          }
          return value;
        } catch {
          return fallback;
        }
      };

      const data = {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.price && { price: Number(body.price) }),
        ...(body.discount && { discount: Number(body.discount) }),
        ...(body.category && { category: body.category }),
        ...(body.tags && { tags: parseJSON(body.tags, []) }),
        ...(body.attributes && { attributes: parseJSON(body.attributes, {}) }),
        ...(body.stock && { stock: Number(body.stock) }),
        ...(image && { image }),
      };

      return await this.productService.updateProduct(req.params.productId, data);
    });

  delete = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      await this.productService.deleteProduct(req.params.productId);
      return null;
    });
}
