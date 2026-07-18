import { Prisma, Product } from "@prisma/client";
import {
  CreateProductInput,
  IProductRepository,
  PaginationOptions,
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

  async getAllProducts(pagination:PaginationOptions): Promise<{ products: Product[]; total: number }> {
    
    const [products,total]=await prisma.$transaction([
      prisma.product.findMany({
        skip:pagination.skip,
        take:pagination.take,
        orderBy:{
          createdAt:"desc"
        }
      }),
      prisma.product.count()
    ])
    return {
      products,total
    }
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
  async getAllActiveProducts(pagination:PaginationOptions): Promise<{ products: Product[]; total: number }> {
     const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
      skip:pagination.skip,
      take:pagination.take,
      where: {
        isActive: true,
      },
      orderBy:{
        createdAt:"desc",
      },
    }),
prisma.product.count({
      where: {
        isActive: true,
      },
    }),

  ]);
  return {
    products,
    total,
  };
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
