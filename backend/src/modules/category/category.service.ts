import { AppError } from "../../utils/AppError.js";
import { ICategoryRepository } from "./category.interface.js";
import { toCategoryResponse } from "./category.mapper.js";
import { createCategoryDTO } from "./category.schema.js";

export class CategoryService {
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async createCategory(data: createCategoryDTO) {
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const existingCategory = await this.categoryRepo.getCategoryByNameOrSlug(
      data.name,
      slug
    );

    if (existingCategory) {
      throw new AppError("Category with this name or slug already exists", 400);
    }
    

    const category= await this.categoryRepo.createCategory({ ...data, slug });

    return toCategoryResponse(category);
  }

  async getAllCategories(){
    return this.categoryRepo.getAllCategories();
  }
}
