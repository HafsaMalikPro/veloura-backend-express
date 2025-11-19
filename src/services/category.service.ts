import { PrismaClient } from "@prisma/client";
import { AppError } from "@/utils/appError";

const prisma = new PrismaClient();

export class CategoryService {
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createCategory(data: { name: string; type: string; description?: string }) {
    const existing = await prisma.category.findUnique({ where: { name: data.name } });
    if (existing) throw new AppError("Category already exists", 400);

    const category = await prisma.category.create({ data });
    return { categoryId: category.categoryId, message: "Category created" };
  }

  async updateCategory(categoryId: string, data: any) {
    const category = await prisma.category.findUnique({ where: { categoryId } });
    if (!category) throw new AppError("Category not found", 404);

    await prisma.category.update({ where: { categoryId }, data });
    return { message: "Category updated" };
  }

  async deleteCategory(categoryId: string) {
    const category = await prisma.category.findUnique({ where: { categoryId } });
    if (!category) throw new AppError("Category not found", 404);

    await prisma.category.delete({ where: { categoryId } });
    return { message: "Category deleted" };
  }
}
