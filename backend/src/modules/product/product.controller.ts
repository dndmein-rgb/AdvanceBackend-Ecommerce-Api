import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { productService } from "./product.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { uploadToCloudinary } from "../../utils/cloudinary.helper.js";

export const createProductController = catchAsync(
  async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) ?? [];

    const imageUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer)),
    );
    const result = await productService.createProduct(
      {
        ...req.body,
        productImageUrls: imageUrls,
        price: Number(req.body.price),

        ...(req.body.stock !== undefined && {
          stock: Number(req.body.stock),
        }),
      },
      req.user!.id,
    );

    sendResponse(res, 201, {
      success: true,
      message: "Product created successfully",
      data: result,
    });
  },
);

export const deleteProductController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productService.deleteProduct(
      req.params.id as string,
      req.user!.id,
    );

    sendResponse(res, 201, {
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  },
);
