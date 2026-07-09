import { hash } from "node:crypto";
import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../utils/auth.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { registerUserDTO } from "./auth.schema.js";
import { toUserResponse } from "./auth.mapper.js";

export class AuthService {
  constructor(private readonly userRepo: IAuthRepository) {}

  async registerUser(data: registerUserDTO) {
    const { firstName, lastName, email, password, phoneNumber ,role} = data;

    const existingUser = await this.userRepo.getUserByEmail(email);

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await this.userRepo.createUser(
     {
        firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role:role ?? "USER"
     }
    );
    return {
      user:toUserResponse(newUser)
    }
  }
}
