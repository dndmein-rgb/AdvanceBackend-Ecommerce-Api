import { RefreshToken, Role, User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { CreateRefreshTokenInput, IAuthRepository } from "./auth.interface.js";

export class AuthRepository implements IAuthRepository {
  getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
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

  async findRefreshToken(
    hashedRefreshToken: string,
  ): Promise<RefreshToken | null> {
    return await prisma.refreshToken.findUnique({
      where: {
        token: hashedRefreshToken,
      },
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteRefreshTokenById(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { id },
    });
  }

  async deleteAllRefreshTokensByUserId(userId: string): Promise<{ count: number; }> {
    return await prisma.refreshToken.deleteMany({
      where:{userId}
    })
  }
}
