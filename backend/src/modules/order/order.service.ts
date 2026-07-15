import { OrderStatus } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { IOrderRepository } from "./order.interface.js";
import { toOrderListResponse, toOrderResponse } from "./order.mapper.js";
import { OrderResponseDTO } from "./order.response.js";
import { CreateOrderDTO, UpdateOrderStatusDTO } from "./order.schema.js";

export class OrderService {
  constructor(private readonly orderRepo: IOrderRepository) {}

  async createOrder(
    userId: string,
    data: CreateOrderDTO,
  ): Promise<OrderResponseDTO> {
    const { items } = data;

    if (!items || items.length === 0) {
      throw new AppError("Order must contain atleast one item", 400);
    }

    const createdOrder = await this.orderRepo.createOrder(userId, data);

    return toOrderResponse(createdOrder);
  }

  async getOrderById(orderId: string): Promise<OrderResponseDTO> {
    const order = await this.orderRepo.getOrderById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // const isBuyer = order.userId === userId;
    // const isSeller=order.items.some((item)=>item.)
    return toOrderResponse(order);
  }

  async getMyOrders(userId: string): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepo.getOrdersByUserId(userId);
    return toOrderListResponse(orders);
  }
  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusDTO,
  ): Promise<OrderResponseDTO> {
    const { orderStatus } = data;
    const order = await this.orderRepo.getOrderById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const updatedOrder = await this.orderRepo.updateOrderStatus(
      orderId,
      orderStatus,
    );

    return toOrderResponse(updatedOrder);
  }

  async cancelOrder(
    orderId: string,
    userId: string,
  ): Promise<OrderResponseDTO> {
    const order = await this.orderRepo.getOrderById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    if (userId !== order.userId) {
      throw new AppError("You cannot cancel this order", 403);
    }
    if (order.orderStatus !== OrderStatus.PENDING) {
      throw new AppError(
        `Cannot cancel order because its current status is ${order.orderStatus}`,
        400,
      );
    }
    const updatedOrder = await this.orderRepo.updateOrderStatus(
      orderId,
      OrderStatus.CANCELLED,
    ); //"CANCELLED"

    return toOrderResponse(updatedOrder);
  }
}
