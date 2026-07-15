import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { orderService } from "./order.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createOrderController = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.createOrder(req.user!.id, req.body);
  sendResponse(res, 201, {
    success: true,
    message: "Order placed successfully",
    data: result,
  });
});

export const getOrderByIdController=catchAsync(async (req: Request, res: Response)=>{
    const {orderId}=req.params as {orderId:string}
    const result=await orderService.getOrderById(orderId);
    sendResponse(res, 201, {
    success: true,
    message: "Order details fetched successfully",
    data: result,
  });
})

export const getMyOrdersController=catchAsync(async (req: Request, res: Response)=>{
    const result=await orderService.getMyOrders(req.user!.id)
    sendResponse(res, 201, {
    success: true,
    message: "User orders fetched successfully",
    data: result,
  });
})


export const updateOrderStatusController = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };

    const result = await orderService.updateOrderStatus(orderId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  }
);

export const cancelOrderController = catchAsync(
  async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };
    
    // req.user is populated by your authentication middleware
    const result = await orderService.cancelOrder(orderId, req.user!.id );

    sendResponse(res, 200, {
      success: true,
      message: "Order cancelled successfully",
      data: result,
    });
  }
);

