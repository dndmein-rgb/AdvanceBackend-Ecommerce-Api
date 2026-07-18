import { Cart, CartItem } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { CartDetails, CartItemDetails, ICartRepository } from "./cart.interface.js";

export class CartRepository implements ICartRepository {
  async getCartByUserId(userId: string): Promise<CartDetails | null> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                price: true,
                productImageUrls: true,
                stock: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    return cart;
  }
  async getCartById(cartId: string): Promise<CartDetails | null> {
    const cart = await prisma.cart.findUnique({
      where: {
        id: cartId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
                price: true,
                productImageUrls: true,
                stock: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
    return cart;
  }

  async createCart(userId: string): Promise<Cart> {
    return await prisma.cart.create({
      data: { userId },
    });
  }

  async getCartItem(
    cartId: string,
    productId: string,
  ): Promise<CartItem | null> {
    return await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });
  }

  async createCartItem(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    return await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  async updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem> {
    return await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
    });
  }
  async removeCartItem(cartItemId: string): Promise<void> {
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: {
        cartId,
      },
    });
  }
  async getCartItemById(cartItemId: string): Promise<CartItemDetails | null> {
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
      include: {
        product: true,
      },
    });

    return cartItem as CartItemDetails | null;
  }
  async upsertCartItem(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    return await prisma.cartItem.upsert({
      where:{cartId_productId:{
        cartId,productId
      }},
      update:{
        quantity:{
          increment:quantity
        }
      },
      create:{
        cartId,
        productId,
        quantity
      }
    })
  }
}
