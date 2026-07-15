import { OrderStatus } from "@prisma/client";

export interface OrderItemResponseDTO {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderResponseDTO {
  id: string;
  userId: string;
  totalPrice: number;
  totalItems: number;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemResponseDTO[];
}


