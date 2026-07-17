import { OrderDetails } from "./order.interface.js";
import { OrderResponseDTO } from "./order.response.js";

export const toOrderResponse = (order: OrderDetails): OrderResponseDTO => {
  return {
    id: order.id,
    userId: order.userId,
    totalItems: order.totalItems,
    totalPrice: order.totalPrice.toNumber(),
    orderStatus: order.orderStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      priceAtPurchase: item.priceAtPurchase.toNumber(),
      quantity: item.quantity,
    })),
    shippingAddress: order.shippingAddress
      ? {
          id: order.shippingAddress.id,
          addressLine1: order.shippingAddress.addressLine1,
          addressLine2: order.shippingAddress.addressLine2,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pinCode: order.shippingAddress.pinCode,
          country: order.shippingAddress.country,
        }
      : null,
  };
};

export const toOrderListResponse = (
  orders: OrderDetails[],
): OrderResponseDTO[] => {
  return orders.map((order) => toOrderResponse(order));
};
