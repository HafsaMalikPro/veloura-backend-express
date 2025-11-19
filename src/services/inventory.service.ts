import { PrismaClient } from "@prisma/client";
import { AppError } from "@/utils/appError";

const prisma = new PrismaClient();

export class InventoryService {
  // Get stock for a product
  async getStock(productId: string) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });
    if (!inventory) throw new AppError("Product inventory not found", 404);
    return { stock: inventory.stock, reserved: inventory.reserved };
  }

  // Update stock for a product (admin)
  async updateStock(productId: string, stock: number) {
    const product = await prisma.product.findUnique({ where: { productId } });
    if (!product) throw new AppError("Product not found", 404);

    const inventory = await prisma.inventory.upsert({
      where: { productId },
      create: { productId, stock },
      update: { stock },
    });

    return { message: "Stock updated", stock: inventory.stock };
  }

  // Reserve stock for cart items
  async reserveStock(items: { productId: string; quantity: number }[]) {
    for (const item of items) {
      const inv = await prisma.inventory.findUnique({
        where: { productId: item.productId },
      });

      if (!inv) throw new AppError(`Inventory not found for product ${item.productId}`, 404);
      if (inv.stock - inv.reserved < item.quantity)
        throw new AppError(`Not enough stock for product ${item.productId}`, 400);

      await prisma.inventory.update({
        where: { productId: item.productId },
        data: { reserved: inv.reserved + item.quantity },
      });
    }
    return { message: "Stock reserved" };
  }

  // Release reserved stock (if order cancelled or cart abandoned)
  async releaseStock(items: { productId: string; quantity: number }[]) {
    for (const item of items) {
      const inv = await prisma.inventory.findUnique({
        where: { productId: item.productId },
      });
      if (!inv) continue;

      const newReserved = Math.max(0, inv.reserved - item.quantity);
      await prisma.inventory.update({
        where: { productId: item.productId },
        data: { reserved: newReserved },
      });
    }
    return { message: "Stock released" };
  }
}
