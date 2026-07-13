import { AppError } from "../../utils/AppError.js";
import { deleteFromCloudinary } from "../../utils/cloudinary.helper.js";
import { ICategoryRepository } from "../category/category.interface.js";
import { IProductRepository } from "./product.interface.js";
import { toProductResponse } from "./product.mapper.js";
import { CreateProductDTO } from "./product.schema.js";

export class ProductService {
  constructor(
    private readonly productRepo: IProductRepository,
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  private async generateUniqueSlug(productName: string): Promise<string> {
    const baseSlug = productName.toLowerCase().trim().replace(/\s+/g, "-");

    let slug = baseSlug;
    let counter = 1;

    while (await this.productRepo.getProductBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
  async createProduct(data: CreateProductDTO, sellerId: string) {
    const category = await this.categoryRepo.getCategoryById(data.categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }
    const slug = await this.generateUniqueSlug(data.productName);
    const existingProduct = await this.productRepo.getProductBySlug(slug);

    if (existingProduct) {
      throw new AppError("Product already exists", 400);
    }
    const product = await this.productRepo.createProduct({
      ...data,
      slug,
      sellerId,
      productImageUrls: data.productImageUrls ?? [],
      stock: data.stock ?? 0,
    });
    return toProductResponse(product);
  }

  async deleteProduct(productId: string, userId: string) {
    const product = await this.productRepo.getProductById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }
    if (product.sellerId !== userId) {
      throw new AppError("You cannot delete this product", 403);
    }
    if (product.productImageUrls.length > 0) {
      await Promise.all(
        product.productImageUrls.map((imageUrl) =>
          deleteFromCloudinary(imageUrl),
        ),
      );
    }

    const deletedProduct = await this.productRepo.deleteProductById(productId);
    return deletedProduct;
  }
}
