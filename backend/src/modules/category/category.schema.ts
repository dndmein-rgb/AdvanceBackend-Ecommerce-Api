import { z } from "zod";

export const createCategorySchema = z
  .object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters long")
      .max(50),
    description: z
      .string()
      .min(2, "Category description must be at least 2 characters long")
      .max(500)
      .optional(),
  })
  .strict();

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters long")
    .max(50)
    .optional(),
  description: z
    .string()
    .min(2, "Category description must be at least 2 characters long")
    .max(500)
    .optional(),
});
export type createCategoryDTO = z.infer<typeof createCategorySchema>;
export type updateCategoryDTO = z.infer<typeof updateCategorySchema>;
