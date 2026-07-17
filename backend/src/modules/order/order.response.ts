import { OrderStatus } from "@prisma/client";

export interface OrderItemResponseDTO {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderAddressResponseDTO {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pinCode: string;
  country: string;
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
  shippingAddress: OrderAddressResponseDTO | null;
}
