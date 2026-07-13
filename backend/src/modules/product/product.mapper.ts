import { Product } from "@prisma/client";
import { ProductResponseDTO } from "./product.response.js";

export const toProductResponse = (product: Product): ProductResponseDTO => {
  return {
    id: product.id,

    sellerId: product.sellerId,

    categoryId: product.categoryId,

    productName: product.productName,

    slug: product.slug,

    productDescription: product.productDescription,

    productImageUrls: product.productImageUrls,

    price: Number(product.price),

    stock: product.stock,

    averageRating: Number(product.averageRating),

    reviewCount: product.reviewCount,

    isActive: product.isActive,

    createdAt: product.createdAt,

    updatedAt: product.updatedAt,
  };
};

export const toProductListResponse=(categories:Product[])=>{
  return categories.map(toProductResponse)
}