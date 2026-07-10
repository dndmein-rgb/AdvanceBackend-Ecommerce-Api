import { RefreshToken, Role, User } from "@prisma/client";

export interface CreateRefreshTokenInput {
  token: string;  //refreshtoken
  userId: string;
  expiresAt: Date;
}

export interface IAuthRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: {
    firstName: string;
    lastName?: string | null;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
  }): Promise<User>;
  createRefreshToken(data: CreateRefreshTokenInput): Promise<RefreshToken>;

}
