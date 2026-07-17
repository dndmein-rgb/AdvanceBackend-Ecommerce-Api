import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { addressService } from "./address.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createAddressController = catchAsync(async (req: Request, res: Response) => {
  const result = await addressService.createAddress(req.user!.id, req.body);
  sendResponse(res, 201, {
    success: true,
    message: "Address created successfully",
    data: result,
  });
});

export const getMyAddressesController = catchAsync(async (req: Request, res: Response) => {
  const result = await addressService.getMyAddresses(req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: "Addresses fetched successfully",
    data: result,
  });
});

export const getAddressByIdController = catchAsync(async (req: Request, res: Response) => {
  const { addressId } = req.params as { addressId: string };
  const result = await addressService.getAddressById(addressId, req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: "Address fetched successfully",
    data: result,
  });
});

export const updateAddressController = catchAsync(async (req: Request, res: Response) => {
  const { addressId } = req.params as { addressId: string };
  const result = await addressService.updateAddress(addressId, req.user!.id, req.body);
  sendResponse(res, 200, {
    success: true,
    message: "Address updated successfully",
    data: result,
  });
});

export const deleteAddressController = catchAsync(async (req: Request, res: Response) => {
  const { addressId } = req.params as { addressId: string };
  const result = await addressService.deleteAddress(addressId, req.user!.id);
  sendResponse(res, 200, {
    success: true,
    message: "Address deleted successfully",
    data: result,
  });
});