import { Category } from "@prisma/client";
import { CategoryResponseDTO } from "./category.response.js";

export const toCategoryResponse = (category: Category): CategoryResponseDTO => {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};
