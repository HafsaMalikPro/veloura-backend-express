import { Request, Response, NextFunction } from "express";
import { OrderService } from "@/services/order.service";
import { BaseController } from "./base.controller";
import { AppError } from "@/utils/appError";

export class OrderController extends BaseController {
  createOrder(arg0: string, requireAuth: (req: Request, res: Response, next: NextFunction) => void, arg2: (req: Request, res: Response, next: NextFunction) => void, createOrder: any) {
      throw new Error("Method not implemented.");
  }
  constructor(private orderService: OrderService) {
    super();
  }

  // 🟢 Create new order
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.user?.userId || req.body.userId; 
      const { billingAddress, shippingAddress, paymentMethod } = req.body;

      if (!userId) throw new AppError("User ID is required", 400);

      const order = await this.orderService.createOrder(userId, billingAddress, shippingAddress, paymentMethod);

      return {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        total: order.total,
        orderDate: order.createdAt,
      };
    });
  };

  // 🟢 Get user’s order history
  getUserOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { userId } = req.params;

      if (!req.user || (req.user.role !== "ADMIN" && req.user.userId !== userId)) {
        throw new AppError("Not authorized to view these orders", 403);
      }

      return await this.orderService.getUserOrders(userId);
    });
  };

  // 🟢 Get single order details
  getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { orderId } = req.params;
      const order = await this.orderService.getOrderById(orderId);

      if (!order) throw new AppError("Order not found", 404);

      // Authorization: only owner or admin
      if (
        req.user?.role !== "ADMIN" &&
        order.userId !== req.user?.userId
      ) {
        throw new AppError("Not authorized to view this order", 403);
      }

      return order;
    });
  };

  // 🟢 Update order status (admin only)
  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      if (req.user?.role !== "ADMIN") {
        throw new AppError("Only admins can update order status", 403);
      }

      const { orderId } = req.params;
      const { status } = req.body;

      await this.orderService.updateOrderStatus(orderId, status);
      return { message: "Status updated successfully" };
    });
  };

  // 🟢 Cancel order (user or admin)
  cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { orderId } = req.params;
      const order = await this.orderService.getOrderById(orderId);

      if (!order) throw new AppError("Order not found", 404);

      if (
        req.user?.role !== "ADMIN" &&
        order.userId !== req.user?.userId
      ) {
        throw new AppError("Not authorized to cancel this order", 403);
      }

      await this.orderService.cancelOrder(orderId);
      return { message: "Order cancelled successfully" };
    });
  };
}
