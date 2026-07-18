import { AppError } from "../../utils/AppError.js";
import { deleteFromCloudinary } from "../../utils/cloudinary.helper.js";
import { ICategoryRepository } from "../category/category.interface.js";
import {
  IProductRepository,
  PaginationOptions,
  UpdateProductInput,
} from "./product.interface.js";
import { toProductListResponse, toProductResponse } from "./product.mapper.js";
import {
  CreateProductDTO,
  ProductPaginationDTO,
  UpdateProductDTO,
} from "./product.schema.js";

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

  async updateProduct(
    productId: string,
    userId: string,
    data: UpdateProductInput,
  ) {
    const product = await this.productRepo.getProductById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.sellerId !== userId) {
      throw new AppError("You cannot update this product", 403);
    }

    const updatedData = {
      ...data,
    };
    if (data.productName && data.productName !== product.productName) {
      updatedData.slug = await this.generateUniqueSlug(data.productName);
    }

    if (data.categoryId) {
      const category = await this.categoryRepo.getCategoryById(data.categoryId);

      if (!category) {
        throw new AppError("Category not found", 404);
      }
    }

    const updatedProduct = await this.productRepo.updateProduct(
      productId,
      updatedData,
    );

    if (data.productImageUrls) {
      await Promise.all(
        product.productImageUrls.map((image) => deleteFromCloudinary(image)),
      );
    }

    return toProductResponse(updatedProduct);
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
    return toProductResponse(deletedProduct);
  }

  async getProductsByCategorySlug(slug: string) {
    const category = await this.categoryRepo.getCategoryBySlug(slug);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const products = await this.productRepo.getProductsByCategoryId(
      category.id,
    );
    return toProductListResponse(products);
  }

  async getAllProducts(data: ProductPaginationDTO) {
    const { page, limit } = data;

    const pagination: PaginationOptions = {
      skip: (page - 1) * limit,
      take: limit,
    };
    const { products, total } =
      await this.productRepo.getAllProducts(pagination);

    const totalPages = Math.ceil(total / limit);

    return {
      products: toProductListResponse(products),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async toggleActive(productId: string, sellerId: string) {
    const product = await this.productRepo.getProductById(productId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }
    if (sellerId !== product.sellerId) {
      throw new AppError("You cannot update this product", 403);
    }

    const updatedProduct = await this.productRepo.toggleActive(
      productId,
      sellerId,
      !product.isActive,
    );
    return toProductResponse(updatedProduct);
  }

  async getAllActiveProducts(data: ProductPaginationDTO) {
    const { page, limit } = data;

    const pagination: PaginationOptions = {
      skip: (page - 1) * limit,
      take: limit,
    };

    const { products, total } =
      await this.productRepo.getAllActiveProducts(pagination);

    const totalPages = Math.ceil(total / limit);

    return {
      products: toProductListResponse(products),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
