import { Role } from "@prisma/client";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export interface IJwtPayload {
  
  id: string;
  role: Role;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;

}
