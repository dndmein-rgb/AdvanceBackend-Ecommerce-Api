import { Address } from "@prisma/client";
import { IAddressRepository } from "./address.interface.js";
import { CreateAddressDTO, UpdateAddressDTO } from "./address.schema.js";
import { prisma } from "../../lib/prisma.js";

export class AddressRepository implements IAddressRepository {
  async createAddress(
    userId: string,
    data: CreateAddressDTO,
  ): Promise<Address> {
    return await prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async deleteAddressById(id: string): Promise<Address> {
    return await prisma.address.delete({
      where: { id },
    });
  }
  async getAddressById(id: string): Promise<Address | null> {
    return await prisma.address.findUnique({
      where: { id },
    });
  }
  async getAddressesByUserId(userId: string): Promise<Address[]> {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAddress(id: string, data: UpdateAddressDTO): Promise<Address> {
    return await prisma.address.update({
      where: { id },
      data,
    });
  }
}
