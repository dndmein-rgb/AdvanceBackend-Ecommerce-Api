import { Decimal } from "@prisma/client/runtime/client";
import { AddToCartDTO } from "./cart.schema.js";
import { Cart, CartItem } from "@prisma/client";

export interface CartProductData {
  id: string;
  productName: string;
  price: Decimal;
  productImageUrls: string[];
  stock: number;
  isActive: boolean;
}

export interface CartItemData {
  id: string;
  quantity: number;
  product: CartProductData;
}

export interface CartDetails {
  id: string;
  userId:string;
  items: CartItemData[];
}


export interface ICartRepository {

  getCartByUserId(userId: string): Promise<CartDetails | null>;
  getCartById(cartId: string): Promise<CartDetails | null>;


  createCart(userId: string): Promise<Cart>;

  getCartItem(cartId: string, productId: string): Promise<CartItem | null>;
  createCartItem(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem>;
  
  updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem>;

  removeCartItem(cartItemId: string): Promise<void>;

  clearCart(cartId: string): Promise<void>;
}
