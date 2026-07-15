import { z } from "zod";

export const createOrderSchema = z
  .object({
    items: z.array(
      z.object({
        productId: z.uuid("Invalid product id"),
        quantity: z.coerce
          .number()
          .int("Quantity must be an integer")
          .positive("Quantity must be greater than 0")
          .min(1, "Order must contain at least one item"),
      }),
    ),
  })
  .strict();

export const updateOrderStatusSchema = z
  .object({
    orderStatus: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
  })
  .strict();

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDTO=z.infer<typeof updateOrderStatusSchema>
