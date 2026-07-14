import { Category } from "@prisma/client";
import { ICategoryRepository, UpdateCategoryInput } from "./category.interface.js";
import { prisma } from "../../lib/prisma.js";
import { updateCategoryDTO } from "./category.schema.js";

export class CategoryRepository implements ICategoryRepository {
  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Category> {
    return await prisma.category.create({
      data,
    });
  }
  async getCategoryByName(name: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { name },
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async getCategoryByNameOrSlug(
    name: string,
    slug: string,
  ): Promise<Category | null> {
    return await prisma.category.findFirst({
      where: {
        OR: [
          {
            name,
          },
          { slug },
        ],
      },
    });
  }
  async deleteCategoryById(id: string): Promise<Category> {
    return await prisma.category.delete({
      where: { id },
    });
  }
  async updateCategory(id: string, data: UpdateCategoryInput): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  async getCategoryBySlug(slug: string): Promise<Category|null> {
    return await prisma.category.findUnique({
      where:{slug}
    })
  }
}
