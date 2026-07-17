import { AppError } from "../../utils/AppError.js";
import { IProductRepository } from "../product/product.interface.js";
import { ICartRepository } from "./cart.interface.js";
import { toCartResponse } from "./cart.mapper.js";
import { CartResponseDTO } from "./cart.response.js";
import { AddToCartDTO, UpdateCartItemDTO } from "./cart.schema.js";

export class CartService {
  constructor(
    private readonly cartRepo: ICartRepository,
    private readonly productRepo: IProductRepository,
  ) {}

  async addItemToCart(
    userId: string,
    data: AddToCartDTO,
  ): Promise<CartResponseDTO> {
    const { productId, quantity } = data;
    const product = await this.productRepo.getProductById(productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    if (!product.isActive) {
      throw new AppError("Product is inactive", 400);
    }

    let cart = await this.cartRepo.getCartByUserId(userId);
    if (!cart) {
      const newCart = await this.cartRepo.createCart(userId);
      cart = await this.cartRepo.getCartById(newCart.id);
      if (!cart) {
        throw new AppError("Failed to create cart", 500);
      }
    }
    const existingItem = await this.cartRepo.getCartItem(cart.id, productId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new AppError("Insufficient stock", 400);
      }
      await this.cartRepo.updateCartItemQuantity(existingItem.id, newQuantity);
    } else {
      if (quantity > product.stock) {
        throw new AppError("Insufficient stock", 400);
      }
      await this.cartRepo.createCartItem(cart.id, productId, quantity);
    }
    const updatedCart = await this.cartRepo.getCartById(cart.id);

    if (!updatedCart) {
      throw new AppError("Cart not found", 404);
    }

    return toCartResponse(updatedCart);
  }

  async getMyCart(userId: string): Promise<CartResponseDTO> {
    let cart = await this.cartRepo.getCartByUserId(userId);

    if (!cart) {
      const createdCart = await this.cartRepo.createCart(userId);
      cart = await this.cartRepo.getCartById(createdCart.id);
      if (!cart) {
        throw new AppError("Unable to create cart", 500);
      }
    }

    return toCartResponse(cart);
  }
  async updateCartItemQuantity(
    userId: string,
    cartItemId: string,
    data: UpdateCartItemDTO,
  ): Promise<CartResponseDTO> {
    const { quantity } = data;
    const cart = await this.cartRepo.getCartByUserId(userId);
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }
    const cartItem = cart.items.find((item) => item.id === cartItemId);

    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }
    if (quantity > cartItem.product.stock) {
      throw new AppError("Requested quantity exceeds stock", 400);
    }
    await this.cartRepo.updateCartItemQuantity(cartItemId, quantity);

    const updatedCart = await this.cartRepo.getCartById(cart.id);
    if (!updatedCart) {
      throw new AppError("Cart not found", 404);
    }
    return toCartResponse(updatedCart);
  }
  async removeCartItem(
    userId: string,
    cartItemId: string,
  ): Promise<CartResponseDTO> {
    const cart = await this.cartRepo.getCartByUserId(userId);
    if (!cart) {
      throw new AppError("Cart nor found", 404);
    }
    const item = cart.items.find((item) => item.id === cartItemId);
    if (!item) {
      throw new AppError("Cart item not found", 404);
    }
    await this.cartRepo.removeCartItem(cartItemId);

    const updatedCart = await this.cartRepo.getCartById(cart.id);
    if (!updatedCart) {
      throw new AppError("Cart not found", 404);
    }
    return toCartResponse(updatedCart);
  }

  async clearCart(userId: string): Promise<CartResponseDTO> {
    const cart = await this.cartRepo.getCartByUserId(userId);
    if (!cart) {
      throw new AppError("Cart nor found", 404);
    }
    await this.cartRepo.clearCart(cart.id);

    const emptyCart = await this.cartRepo.getCartById(cart.id);

    if (!emptyCart) {
      throw new AppError("Cart not found", 404);
    }

    return toCartResponse(emptyCart);
  }
}
