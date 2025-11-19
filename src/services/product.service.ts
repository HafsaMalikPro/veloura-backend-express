import { PrismaClient } from "@prisma/client";
import { AppError } from "@/utils/appError";

const prisma = new PrismaClient();

export class ProductService {
  async getAllProducts(
    page = 1,
    limit = 10,
    category?: string,
    priceMin?: number,
    priceMax?: number,
    sortBy?: string
  ) {
    const skip = (page - 1) * limit;
    const where = {
      ...(category && { category }),
      ...(priceMin && { price: { gte: priceMin } }),
      ...(priceMax && { price: { lte: priceMax } }),
    };
    const orderBy = sortBy ? { [sortBy]: "asc" } : undefined;

    return await prisma.product.findMany({
      take: limit,
      skip,
      where,
      orderBy,
      select: {
        productId: true,
        name: true,
        price: true,
        discount: true,
        category: true,
        tags: true,
        image: true,
        stock: true,
        attributes: true,
      },
    });
  }

  async getProductById(productId: string) {
    const product = await prisma.product.findUnique({
      where: { productId },
      select: {
        productId: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        category: true,
        tags: true,
        image: true,
        stock: true,
        attributes: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    discount?: number;
    category: string;
    tags: string[];
    image: string;
    stock: number;
    attributes: Record<string, any>;
  }) {
    return prisma.product.create({
      data,
      select: {
        productId: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        category: true,
        tags: true,
        image: true,
        stock: true,
        attributes: true,
      },
    });
  }

  async updateProduct(
    productId: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      discount?: number;
      category: string;
      tags: string[];
      image: string;
      stock: number;
      attributes: Record<string, any>;
    }>
  ) {
    return prisma.product.update({
      where: { productId },
      data,
      select: {
        productId: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        category: true,
        tags: true,
        image: true,
        stock: true,
        attributes: true,
      },
    });
  }

  async deleteProduct(productId: string) {
    await prisma.product.delete({
      where: { productId },
    });
  }
}