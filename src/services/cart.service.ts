import { PrismaClient } from "@prisma/client";
import { AppError } from "@/utils/appError";

const prisma = new PrismaClient();

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  attributes?: Record<string, any>;
};

export class CartService {
  async getUserCart(userId: string) {
    const cart = await prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      return await prisma.cart.create({
        data: { userId, items: [], total: 0 },
      });
    }
    return cart;
  }

  async addItemToCart(userId: string, item: CartItem) {
    const cart = await this.getUserCart(userId);
    const items: CartItem[] = Array.isArray(cart.items)
      ? (cart.items as unknown as CartItem[])
      : [];

    const existingItem = items.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.push(item);
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { items, total },
    });

    return { message: "Item added to cart" };
  }

  async updateCartItem(userId: string, item: Partial<CartItem> & { productId: string }) {
    const cart = await this.getUserCart(userId);
    const items: CartItem[] = Array.isArray(cart.items)
      ? (cart.items as unknown as CartItem[])
      : [];

    const updatedItems = items.map((i) =>
      i.productId === item.productId ? { ...i, ...item } : i
    );

    const total = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { items: updatedItems, total },
    });

    return { message: "Cart updated" };
  }

  async removeItemFromCart(userId: string, productId: string) {
    const cart = await this.getUserCart(userId);
    const items: CartItem[] = Array.isArray(cart.items)
      ? (cart.items as unknown as CartItem[])
      : [];

    const filteredItems = items.filter((i) => i.productId !== productId);
    const total = filteredItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { items: filteredItems, total },
    });

    return { message: "Item removed" };
  }

  async applyCoupon(userId: string, code: string) {
    const cart = await this.getUserCart(userId);
    let discount = 0;

    if (code === "SAVE21") discount = 0.21;
    else throw new AppError("Invalid coupon code", 400);

    const total = Number(cart.total) * (1 - discount);

    await prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { discount: discount * 100, total },
    });

    return { message: "Coupon applied", discount: discount * 100 };
  }

  // Guest cart
  async getGuestCart(sessionId: string) {
    const cart = await prisma.cart.findFirst({ where: { sessionId } });
    return (
      cart ??
      (await prisma.cart.create({ data: { sessionId, items: [], total: 0 } }))
    );
  }

  async addItemToGuestCart(sessionId: string, item: CartItem) {
    const cart = await this.getGuestCart(sessionId);
    const items: CartItem[] = Array.isArray(cart.items)
      ? (cart.items as unknown as CartItem[])
      : [];

    items.push(item);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await prisma.cart.update({
      where: { cartId: cart.cartId },
      data: { items, total },
    });

    return { message: "Item added to guest cart" };
  }
}
