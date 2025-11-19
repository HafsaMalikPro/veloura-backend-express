import { Request, Response, NextFunction } from "express";
import { CartService } from "@/services/cart.service";
import { BaseController } from "./base.controller";

export class CartController extends BaseController {
  constructor(private cartService: CartService) {
    super();
  }

  getCart = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      return await this.cartService.getUserCart(req.params.userId);
    });

  addItem = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      return await this.cartService.addItemToCart(req.params.userId, req.body);
    });

  updateItem = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      return await this.cartService.updateCartItem(req.params.userId, req.body);
    });

  removeItem = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      return await this.cartService.removeItemFromCart(
        req.params.userId,
        req.params.productId
      );
    });

  applyCoupon = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      return await this.cartService.applyCoupon(
        req.params.userId,
        req.body.code
      );
    });

  getGuestCart = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      return await this.cartService.getGuestCart(req.params.sessionId);
    });

  addGuestItem = async (req: Request, res: Response, next: NextFunction) =>
    this.handleRequest(req, res, next, async () => {
      return await this.cartService.addItemToGuestCart(
        req.params.sessionId,
        req.body
      );
    });
}
