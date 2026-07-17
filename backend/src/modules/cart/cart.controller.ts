import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { cartService } from "./cart.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const addToCartController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await cartService.addItemToCart(req.user!.id, req.body);
    sendResponse(res, 201, {
      success: true,
      message: "Item added to cart successfully",
      data: result,
    });
  },
);


export const getCartController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await cartService.getMyCart(
      req.user!.id
    );

    sendResponse(res, 200, {
      success: true,
      message: "Cart fetched successfully",
      data: result,
    });
  }
);

export const updateCartItemController = catchAsync(
  async (req: Request, res: Response) => {
    const { cartItemId } = req.params as {
      cartItemId: string;
    };

    const result = await cartService.updateCartItemQuantity(
      req.user!.id,
      cartItemId,
      req.body
    );

    sendResponse(res, 200, {
      success: true,
      message: "Cart item updated successfully",
      data: result,
    });
  }
);

export const removeCartItemController = catchAsync(
  async (req: Request, res: Response) => {
    const { cartItemId } = req.params as {
      cartItemId: string;
    };

    const result = await cartService.removeCartItem(
      req.user!.id,
      cartItemId
    );

    sendResponse(res, 200, {
      success: true,
      message: "Item removed from cart successfully",
      data: result,
    });
  }
);

export const clearCartController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await cartService.clearCart(
      req.user!.id
    );

    sendResponse(res, 200, {
      success: true,
      message: "Cart cleared successfully",
      data: result,
    });
  }
);

