import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { productService } from "./product.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.helper.js";
import { ProductPaginationDTO, productPaginationSchema } from "./product.schema.js";

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

export const getProductsByCategoryIdController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productService.getProductsByCategorySlug(
      req.params.slug as string,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  },
);

export const getAllActiveProductsController = catchAsync(
  async (req: Request, res: Response) => {
     const pagination = productPaginationSchema.parse(req.query);
    const result = await productService.getAllActiveProducts(pagination);
    sendResponse(res, 200, {
      success: true,
      message: "Active products fetched successfully",
      data: result,
    });
  },
);
export const getAllProductsController = catchAsync(
  async (req: Request, res: Response) => {
   const pagination = productPaginationSchema.parse(req.query);

const result = await productService.getAllProducts(pagination);
    sendResponse(res, 200, {
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  },
);

export const updateProductController = catchAsync(
  async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) ?? [];

    let imageUrls: string[] = [];

    try {
      if (files.length > 0) {
        imageUrls = await Promise.all(
          files.map((file) => uploadToCloudinary(file.buffer)),
        );
      }

      const result = await productService.updateProduct(
        req.params.productId as string,
        req.user!.id,
        {
          ...req.body,

          ...(imageUrls.length > 0 && {
            productImageUrls: imageUrls,
          }),

          ...(req.body.price !== undefined && {
            price: Number(req.body.price),
          }),

          ...(req.body.stock !== undefined && {
            stock: Number(req.body.stock),
          }),
        },
      );

      sendResponse(res, 200, {
        success: true,
        message: "Product updated successfully",
        data: result,
      });
    } catch (error) {
      // cleanup uploaded images if DB update failed

      if (imageUrls.length > 0) {
        await Promise.all(
          imageUrls.map((image) => deleteFromCloudinary(image)),
        );
      }

      throw error;
    }
  },
);

export const toggleActiveProductController = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params as { productId: string };
    const result = await productService.toggleActive(productId, req.user!.id);
    sendResponse(res, 200, {
      success: true,
      message: "Product's active status toggled successfully",
      data: result,
    });
  },
);
