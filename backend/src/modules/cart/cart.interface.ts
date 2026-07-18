import { Decimal } from "@prisma/client/runtime/client";
import { AddToCartDTO } from "./cart.schema.js";
import { Cart, CartItem, Product } from "@prisma/client";

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

export interface CartItemDetails extends CartItem {
  product: Product;
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
  getCartItemById(cartItemId: string): Promise<CartItemDetails | null>;
  updateCartItemQuantity(
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem>;

  upsertCartItem(cartId:string,productId:string,quantity:number): Promise<CartItem>;

  removeCartItem(cartItemId: string): Promise<void>;

  clearCart(cartId: string): Promise<void>;
}
