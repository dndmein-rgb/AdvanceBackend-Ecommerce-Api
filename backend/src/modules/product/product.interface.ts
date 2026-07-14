import { Prisma, Product } from "@prisma/client";

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

export interface UpdateProductInput {
  productName?: string;
  productDescription?: string;
  productImageUrls?: string[];
  slug?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
}
export interface IProductRepository {
  createProduct(data: CreateProductInput): Promise<Product>;

  getProductBySlug(slug: string): Promise<Product | null>;

  getProductById(id: string): Promise<Product | null>;

  deleteProductById(id: string): Promise<Product>;

  getProductsCountByCategoryId(categoryId: string): Promise<number>;

  getProductsByCategoryId(categoryId: string): Promise<Product[]>;

  getAllActiveProducts():Promise<Product[]>
  getAllProducts(): Promise<Product[]>;

  updateProduct(id: string, data: UpdateProductInput): Promise<Product>;

  toggleActive(
    productId: string,
    sellerId: string,
    isActive: boolean,
  ): Promise<Product>;
}
