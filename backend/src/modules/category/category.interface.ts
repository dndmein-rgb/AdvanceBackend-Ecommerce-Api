import { Category } from "@prisma/client";

export interface ICategoryRepository {
  createCategory(data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Category>;

  getCategoryByName(name:string):Promise<Category|null>

  getCategoryByNameOrSlug(name:string,slug:string):Promise<Category |null>

  getCategoryById(id:string):Promise<Category|null>

  getAllCategories():Promise<Category[]>

}
