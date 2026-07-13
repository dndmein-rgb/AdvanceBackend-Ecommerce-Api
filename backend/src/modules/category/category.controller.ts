import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { categoryService } from "./category.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Category created successfully",
      data: result,
    });
  },
);

export const deleteCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params as { categoryId: string };
    const result = await categoryService.deleteCategory(categoryId);
    sendResponse(res, 200, {
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  },
);

export const getCategoryByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params as { categoryId: string };
    const result = await categoryService.getCategoryById(categoryId);

    sendResponse(res, 200, {
      success: true,
      message: "Category fetched successfully",
      data: result,
    });
  },
);

export const getAllCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();
    sendResponse(res, 200, {
      success: true,
      message: "Category fetched successfully",
      data: result,
    });
  },
);

export const updateCategoryController = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params as { categoryId: string };
    const result = await categoryService.updateCategory(categoryId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  },
);
