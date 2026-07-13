export interface ProductResponseDTO {
  id: string;

  sellerId: string;

  categoryId: string;

  productName: string;

  slug: string;

  productDescription: string;

  productImageUrls: string[];

  price: number;

  stock: number;

  averageRating: number;

  reviewCount: number;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}