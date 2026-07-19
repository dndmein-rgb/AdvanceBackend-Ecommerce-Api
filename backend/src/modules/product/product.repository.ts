import { Prisma, Product } from "@prisma/client";
import {
  CreateProductInput,
  CursorPaginationOptions,
  IProductRepository,
  UpdateProductInput,
} from "./product.interface.js";
import { prisma } from "../../lib/prisma.js";

export class ProductRepository implements IProductRepository {
  async createProduct(data: CreateProductInput): Promise<Product> {
    return await prisma.product.create({
      data,
    });
  }
  async getProductBySlug(slug: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { slug },
    });
  }
  async getProductById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
    });
  }
  async deleteProductById(id: string): Promise<Product> {
    return await prisma.product.delete({
      where: { id },
    });
  }
  async getProductsCountByCategoryId(categoryId: string): Promise<number> {
    return await prisma.product.count({
      where: { categoryId },
    });
  }

  async getProductsByCategoryId(categoryId: string): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAllActiveProducts(
    pagination: CursorPaginationOptions,
  ): Promise<Product[]> {
    return await prisma.product.findMany({
      take: pagination.limit+1,

      where: {
        isActive: true,
      },

      ...(pagination.cursor && {
        cursor: {
          createdAt_id: {
            createdAt: pagination.cursor.createdAt,
            id: pagination.cursor.id,
          },
        },
        skip: 1,
      }),

      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
    });
  }
  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }
  async toggleActive(
    productId: string,
    sellerId: string,
    isActive: boolean,
  ): Promise<Product> {
    return await prisma.product.update({
      where: { id: productId },
      data: { isActive },
    });
  }
  async getAllProducts(
    pagination: CursorPaginationOptions,
  ): Promise<Product[]> {
    return await prisma.product.findMany({
      take: pagination.limit+1,

      ...(pagination.cursor && {
        cursor: {
          createdAt_id: {
            createdAt: pagination.cursor.createdAt,
            id: pagination.cursor.id,
          },
        },
        skip: 1,
      }),

      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
    });
  }

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
  }
}
