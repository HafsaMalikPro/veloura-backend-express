import { PrismaClient, OrderStatus } from "@prisma/client";
import { AppError } from "@/utils/appError";

const prisma = new PrismaClient();

export class OrderService {
  
    // Create a new order from user's cart
   async createOrder(
    userId: string,
    billingAddress?: Record<string, any>,
    shippingAddress?: Record<string, any>,
    paymentMethod?: string
  ) {
    // Fetch user cart
    const cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart || !cart.items || (Array.isArray(cart.items) && cart.items.length === 0)) {
      throw new AppError("Cart is empty", 400);
    }

    // Generate a random readable order number
    const orderNumber = `#${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;

    // Create order and associated order items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        total: cart.total,
        billingAddress,
        shippingAddress,
        paymentMethod,
        items: {
          create: (cart.items as any[]).map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            attributes: item.attributes,
          })),
        },
      },
      include: { items: true },
    });

    // Clear cart after successful order creation
    await prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { items: [], total: 0 },
    });

    return order;
  }

  
    // Get all orders for a specific user
   
  async getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    if (orders.length === 0) {
      throw new AppError("No orders found for this user", 404);
    }

    return orders;
  }

  
    // Get a single order by orderId
   
  async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { orderId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }

  
    // Update order status (Admin only)
   
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid order status", 400);
    }

    const order = await prisma.order.findUnique({ where: { orderId } });
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const updatedOrder = await prisma.order.update({
      where: { orderId },
      data: { status },
    });

    return updatedOrder;
  }

  
    // Cancel an order (User/Admin)
   
  async cancelOrder(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { orderId },
    });

    if (!order) throw new AppError("Order not found", 404);

    if (order.status === "SHIPPED" || order.status === "DELIVERED") {
      throw new AppError("Order cannot be cancelled once shipped or delivered", 400);
    }

    const cancelledOrder = await prisma.order.update({
      where: { orderId },
      data: { status: "CANCELLED" },
    });

    return cancelledOrder;
  }
}
