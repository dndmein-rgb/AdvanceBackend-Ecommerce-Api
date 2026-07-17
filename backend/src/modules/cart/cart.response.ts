export interface CartProductResponseDTO {
  id: string;
  productName: string;
  price: number;
  productImageUrls: string[];
}

export interface CartItemResponseDTO {
  id: string;
  quantity: number;
  product: CartProductResponseDTO;
}

export interface CartResponseDTO {
  id: string;
  totalItems: number;
  totalPrice: number;
  items: CartItemResponseDTO[];
}
