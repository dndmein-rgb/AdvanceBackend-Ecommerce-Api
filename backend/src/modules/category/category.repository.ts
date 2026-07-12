import { Category } from "@prisma/client";
import { ICategoryRepository } from "./category.interface.js";
import { prisma } from "../../lib/prisma.js";

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
}
