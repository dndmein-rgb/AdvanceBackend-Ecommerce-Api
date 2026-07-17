import { z } from "zod";

export const addToCartSchema = z
  .object({
    productId: z.uuid("Invalid product id"),
    quantity: z.coerce
      .number()
      .int("Quantity must be a number")
      .positive("Quantity must be greater than 0"),
  })
  .strict();

  export const updateCartItemSchema=z.object({
    quantity:z.coerce.number().int("Quantity must be a number").positive("Quantity must be greater than 0")
  }).strict()
  
export type AddToCartDTO=z.infer<typeof addToCartSchema>
export type UpdateCartItemDTO=z.infer<typeof updateCartItemSchema>
