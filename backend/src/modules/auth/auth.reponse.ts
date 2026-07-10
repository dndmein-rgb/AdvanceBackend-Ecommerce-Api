import { Role } from "@prisma/client";

export type UserResponseDTO = {
  id: string;
  firstName: string;
  lastName: string|null;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
