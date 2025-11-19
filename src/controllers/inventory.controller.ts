import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller";
import { InventoryService } from "@/services/inventory.service";

export class InventoryController extends BaseController {
  constructor(private inventoryService: InventoryService) {
    super();
  }

  getStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.inventoryService.getStock(req.params.productId);
    });
  };

  updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { stock } = req.body;
      return await this.inventoryService.updateStock(req.params.productId, stock);
    });
  };

  reserveStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.inventoryService.reserveStock(req.body.items);
    });
  };

  releaseStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.inventoryService.releaseStock(req.body.items);
    });
  };
}
