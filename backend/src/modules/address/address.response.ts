export interface AddressResponseDTO {
  id: string;
  userId: string;
  addressType: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}
