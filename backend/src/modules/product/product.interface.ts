import { Product } from "@prisma/client";

export interface CreateProductInput {
  sellerId: string;
  categoryId: string;
  productName: string;
  slug: string;
  productDescription: string;
  productImageUrls: string[];
  price: number;
  stock: number;
}
export interface IProductRepository{
    createProduct(data:CreateProductInput
   ):Promise<Product>;

   getProductBySlug(slug:string):Promise<Product|null>

   getProductById(id:string):Promise<Product|null>

   deleteProductById(id:string):Promise<void>
}