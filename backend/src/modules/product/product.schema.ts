import { z } from "zod";

export const createProductSchema = z
  .object({
    categoryId: z.uuid(),

    productName: z
      .string()
      .min(2, "Product name must contain at least 2 characters")
      .max(50),

    productDescription: z
      .string()
      .min(10, "Description must contain at least 10 characters"),

    productImageUrls: z.array(z.url()).optional(),

    price: z.coerce.number().positive("Price must be greater than 0"),

    stock: z.coerce.number().int().nonnegative().optional(),
  })
  .strict();

export const updateProductSchema = z
  .object({
    categoryId: z.uuid().optional(),

    productName: z
      .string()
      .min(2, "Product name must contain at least 2 characters")
      .max(50)
      .optional(),

    productDescription: z
      .string()
      .min(10, "Description must contain at least 10 characters")
      .optional(),

    productImageUrls: z.array(z.url()).optional(),

    price: z.coerce
      .number()
      .positive("Price must be greater than 0")
      .optional(),

    stock: z.coerce.number().int().nonnegative().optional(),
  })
  .strict();

export const productPaginationSchema = z.object({
  cursor: z.string().optional(),

  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;

export type ProductPaginationDTO = z.infer<typeof productPaginationSchema>;