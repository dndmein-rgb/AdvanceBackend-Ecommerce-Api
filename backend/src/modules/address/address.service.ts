import { AppError } from "../../utils/AppError.js";
import { IAddressRepository } from "./address.interface.js";
import { toAddressListResponse, toAddressResponse } from "./address.mapper.js";
import { CreateAddressDTO, UpdateAddressDTO } from "./address.schema.js";

export class AddressService{
    constructor(private readonly addressRepo:IAddressRepository){}

    async createAddress(userId:string,data:CreateAddressDTO){
        const address=await this.addressRepo.createAddress(userId,data)
        return toAddressResponse(address)
    }
    async getAddressById(addressId:string,userId:string){
        const address=await this.addressRepo.getAddressById(addressId);

        if(!address){
            throw new AppError("Address not found",404)
        }
        if(address.userId!==userId){
            throw new AppError("Forbidden: Access denied!",403)
        }
        return toAddressResponse(address)
    }
    async getMyAddresses(userId:string){
        const addresses=await this.addressRepo.getAddressesByUserId(userId)
        return toAddressListResponse(addresses)
    }
    async deleteAddress(addressId:string,userId:string){
        const address=await this.addressRepo.getAddressById(addressId);

        if(!address){
            throw new AppError("Address not found",404)
        }
        if(address.userId!==userId){
            throw new AppError("Forbidden: Access denied!",403)
        }
        const deletedAddress=await this.addressRepo.deleteAddressById(addressId)
        return toAddressResponse(deletedAddress)
    }

    async updateAddress(addressId:string,userId:string,data:UpdateAddressDTO){
         const address=await this.addressRepo.getAddressById(addressId);

        if(!address){
            throw new AppError("Address not found",404)
        }
        if(address.userId!==userId){
            throw new AppError("Forbidden: Access denied!",403)
        }
        const updatedAddress=await this.addressRepo.updateAddress(addressId,data)
        return toAddressResponse(updatedAddress)
    }
}