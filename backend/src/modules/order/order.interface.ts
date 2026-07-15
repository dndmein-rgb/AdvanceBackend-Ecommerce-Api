import { Order, OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import { CreateOrderDTO, UpdateOrderStatusDTO } from "./order.schema.js";
export interface OrderItemData {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: Decimal;
}

export interface OrderDetails {
  id: string;
  userId: string;

  totalPrice: Decimal;
  totalItems: number;

  orderStatus: OrderStatus;

  createdAt: Date;
  updatedAt: Date;
  items: OrderItemData[];
}

export interface IOrderRepository {
  createOrder(userId: string, data: CreateOrderDTO): Promise<OrderDetails>;
  getOrderById(orderId: string): Promise<OrderDetails | null>;

  getOrdersByUserId(userId: string): Promise<OrderDetails[]>;

  updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<OrderDetails>;
}
