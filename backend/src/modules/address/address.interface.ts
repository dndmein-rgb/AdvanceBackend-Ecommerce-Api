import { Address } from "@prisma/client";
import { CreateAddressDTO, UpdateAddressDTO } from "./address.schema.js";

export interface IAddressRepository {
  createAddress(userId: string, data: CreateAddressDTO): Promise<Address>;
  deleteAddressById(id: string): Promise<Address>;
  getAddressById(id: string): Promise<Address | null>;
  getAddressesByUserId(userId: string): Promise<Address[]>;
  updateAddress(id: string,data:UpdateAddressDTO): Promise<Address>;
}
