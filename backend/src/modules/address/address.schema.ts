import {z} from "zod";

export const createAddressSchema=z.object({
    addressType:z.string().min(1,"Address Type cannot be empty").max(50),
    addressLine1:z.string().min(1,"Address cannot be empty"),
    addressLine2:z.string().optional(),
    city:z.string().min(1,"City cannot be empty"),
    state:z.string().min(1,"State cannot be empty"),
    pinCode:z.string().min(1,"Pin Code cannot be empty"),
    country:z.string().min(1,"Country cannot be empty")
}).strict();

export const updateAddressSchema = z.object({
  addressType: z.string().min(1).optional(),
  addressLine1: z.string().min(1).optional(),
  addressLine2: z.string().optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  pinCode: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
}).strict();


export type CreateAddressDTO=z.infer<typeof createAddressSchema>
export type UpdateAddressDTO=z.infer<typeof updateAddressSchema>