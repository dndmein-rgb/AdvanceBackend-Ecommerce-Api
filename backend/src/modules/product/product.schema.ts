import {z} from "zod";

export const createProductSchema=z.object({

    categoryId:z.uuid(),
    productName:z.string().min(2,"Product name must contain at least 2 characters").max(50),
    productDescription:z.string().min(10, "Description must contain at least 10 characters"),
    productImageUrls:z.array(z.url()).optional(),
    price:z.coerce.number().positive("Price must be greater than 0"),
    stock:z.coerce.number().int().nonnegative().optional()
})

export type CreateProductDTO=z.infer<typeof createProductSchema>