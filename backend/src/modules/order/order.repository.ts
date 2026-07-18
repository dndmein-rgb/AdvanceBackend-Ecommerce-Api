import { OrderStatus } from "@prisma/client";
import { IOrderRepository, OrderDetails } from "./order.interface.js";
import { prisma } from "../../lib/prisma.js";
import { CreateOrderDTO } from "./order.schema.js";
import { Decimal } from "@prisma/client/runtime/client";
import { AppError } from "../../utils/AppError.js";

export class OrderRepository implements IOrderRepository {
  async createOrder(
    userId: string,
    data: CreateOrderDTO,
  ): Promise<OrderDetails> {
    // Execute all database adjustments inside a single atomic transaction
    return await prisma.$transaction(async (tx) => {
      // Fetch the selected profile address
      const address = await tx.address.findUnique({
        where: {
          id: data.addressId,
        },
      });

      if (!address || address.userId !== userId) {
        throw new AppError("Invalid address", 400);
      }

      const productIds = data.items.map((item) => item.productId);

      // 1. Fetch all matching products
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      // Map products to a dictionary for O(1) lookups
      const productMap = new Map(products.map((p) => [p.id, p]));

      let totalPrice = new Decimal(0);
      let totalItems = 0;
      const orderItemsData = [];

      // 2. Validate availability and stock constraints
      for (const item of data.items) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new AppError(
            `Product with ID ${item.productId} not found`,
            404,
          );
        }

        if (!product.isActive) {
          throw new AppError(
            `Product "${product.productName}" is no longer active`,
            400,
          );
        }

        // 3. Subtract from current product stock
        const updated = await tx.product.updateMany({
          where: {
            id: product.id,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count === 0) {
          throw new AppError(
            `Insufficient stock for ${product.productName}`,
            400,
          );
        }

        // Compute pricing lines
        const itemTotalPrice = new Decimal(product.price).mul(item.quantity);
        totalPrice = totalPrice.add(itemTotalPrice);
        totalItems += item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price, // Lock down current price
        });
      }

      // 4. Create the final Order with nested OrderItems
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          totalItems,
          orderStatus: "PENDING",
          items: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
      });

      // 5. Create historical address record tied directly to the new order
      await tx.orderAddress.create({
        data: {
          orderId: order.id,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          pinCode: address.pinCode,
          country: address.country,
        },
      });

      // 6. Pull entire assembled order record out to pass back cleanly
      const fullOrder = await tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          shippingAddress: true, // Matches schema.prisma field name
        },
      });

      if (!fullOrder) {
        throw new AppError("Failed to fetch created order summary data", 500);
      }

      return fullOrder as OrderDetails;
    });
  }

  async getOrderById(orderId: string): Promise<OrderDetails | null> {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });
    return order as OrderDetails | null;
  }

  async getOrdersByUserId(userId: string): Promise<OrderDetails[]> {
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
        shippingAddress: true,
      },
    });
    return orders as OrderDetails[];
  }

  async updateOrderStatus(
    orderId: string,
    orderStatus: OrderStatus,
  ): Promise<OrderDetails> {
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId, orderStatus: "PENDING" },
        data: {
          orderStatus,
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });
      return updatedOrder as OrderDetails;
    } catch (error) {
      throw new AppError(
        "Order could not be updated. It may have already been processed.",
        400,
      );
    }
  }

  async cancelOrder(orderId: string): Promise<OrderDetails> {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      const updatedOrder = await tx.order.update({
        where: {
          id: orderId,
        },
        data: {
          orderStatus: OrderStatus.CANCELLED,
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      return updatedOrder as OrderDetails;
    });
  }
}
