import { AppError } from "../../utils/AppError.js";
import { IProductRepository } from "../product/product.interface.js";
import { ICategoryRepository, UpdateCategoryInput } from "./category.interface.js";
import {
  toCategoryListResponse,
  toCategoryResponse,
} from "./category.mapper.js";
import { createCategoryDTO, updateCategoryDTO } from "./category.schema.js";

export class CategoryService {
  constructor(
    private readonly categoryRepo: ICategoryRepository,
    private readonly productRepo: IProductRepository,
  ) {}

  private async generateSlug(name: string) {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
      return slug
  }
  async createCategory(data: createCategoryDTO) {
    const slug =await  this.generateSlug(data.name)
    const existingCategory = await this.categoryRepo.getCategoryByNameOrSlug(
      data.name,
      slug,
    );

    if (existingCategory) {
      throw new AppError("Category with this name or slug already exists", 400);
    }

    const category = await this.categoryRepo.createCategory({ ...data, slug });

    return toCategoryResponse(category);
  }

  async getAllCategories() {
    const categories = await this.categoryRepo.getAllCategories();
    return toCategoryListResponse(categories);
  }

  async getCategoryById(categoryId: string) {
    const category = await this.categoryRepo.getCategoryById(categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return category;
  }
  async deleteCategory(categoryId: string) {
    const existingCategory =
      await this.categoryRepo.getCategoryById(categoryId);

    if (!existingCategory) {
      throw new AppError("Category not found", 404);
    }
    const productCount =
      await this.productRepo.getProductsCountByCategoryId(categoryId);

    if (productCount > 0) {
      throw new AppError("Cannot delete category with existing products", 400);
    }

    const deleted = await this.categoryRepo.deleteCategoryById(categoryId);
    return toCategoryResponse(deleted);
  }

  async updateCategory(categoryId: string, data: UpdateCategoryInput) {
    const category = await this.categoryRepo.getCategoryById(categoryId);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const updatedData={...data};
    if(data.name && data.name!==category.name){
      const existingCategory=await this.categoryRepo.getCategoryByName(data.name);
      if(existingCategory){
        throw new AppError("Category with this name already exists ",400)
      }
      updatedData.slug=await this.generateSlug(data.name)
    }
    const updatedCategory =
    await this.categoryRepo.updateCategory(
      categoryId,
      updatedData
    );
    return toCategoryResponse(updatedCategory);
  }
}
