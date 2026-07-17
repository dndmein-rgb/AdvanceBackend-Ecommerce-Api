import { Address } from "@prisma/client";
import { AddressResponseDTO } from "./address.response.js";

export const toAddressResponse = (address: Address): AddressResponseDTO => {
  return {
    id: address.id,
    userId: address.userId,
    addressType: address.addressType,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    pinCode: address.pinCode,
    country: address.country,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt,
  };
};


export const toAddressListResponse=(addresses:Address[]):AddressResponseDTO[]=>{
    return addresses.map((address)=>toAddressResponse(address))
    
}