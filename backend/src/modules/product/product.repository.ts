import { Prisma, Product } from "@prisma/client";
import {
  CreateProductInput,
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

  async getAllProducts(): Promise<Product[]> {
    return await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
  async getAllActiveProducts(): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        isActive: true,
      },
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
