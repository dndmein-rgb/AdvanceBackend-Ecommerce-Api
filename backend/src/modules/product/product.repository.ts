import { Product } from "@prisma/client";
import { CreateProductInput, IProductRepository,  } from "./product.interface.js";
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
      where:{id}
     })
   }
   async deleteProductById(id: string): Promise<void> {
      await prisma.product.delete({
      where:{id}
     })
   }
}
