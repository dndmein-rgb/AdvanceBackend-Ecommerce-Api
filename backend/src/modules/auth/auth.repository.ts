import { Role, User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import { registerUserDTO } from "./auth.schema.js";

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
      data
    });
  }
}
