import { Category } from "@prisma/client";
import { updateCategoryDTO } from "./category.schema.js";

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  slug?: string;
}
export interface ICategoryRepository {
  createCategory(data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Category>;

  

  getCategoryByName(name: string): Promise<Category | null>;

  getCategoryByNameOrSlug(name: string, slug: string): Promise<Category | null>;

  getCategoryById(id: string): Promise<Category | null>;

  getAllCategories(): Promise<Category[]>;

  deleteCategoryById(id: string): Promise<Category>;

  updateCategory(id: string, data: UpdateCategoryInput): Promise<Category>;

  getCategoryBySlug(slug: string): Promise<Category |null>;
}
