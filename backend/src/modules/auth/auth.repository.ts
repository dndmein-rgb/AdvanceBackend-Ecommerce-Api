import { RefreshToken, Role, User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { CreateRefreshTokenInput, IAuthRepository } from "./auth.interface.js";

export class AuthRepository implements IAuthRepository {
  getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  async createUser(data: {
    firstName: string;
    lastName?: string | null;
    email: string;
    password: string;
    phoneNumber: string;
    role: Role;
  }): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }
  async createRefreshToken(
    data: CreateRefreshTokenInput,
  ): Promise<RefreshToken> {
    return await prisma.refreshToken.create({
      data,
    });
  }
  
}
