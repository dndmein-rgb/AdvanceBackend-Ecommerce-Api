import { AppError } from "../../utils/AppError.js";
import {
  comparePassword,
  hashPassword,
  hashRefreshToken,
} from "../../utils/auth.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { loginUserDTO, registerUserDTO } from "./auth.schema.js";
import { toJwtResponse, toUserResponse } from "./auth.mapper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.helper.js";
import { User } from "@prisma/client";
import { REFRESH_TOKEN_EXPIRES_MS } from "../../constants/time.constants.js";

export class AuthService {
  constructor(private readonly userRepo: IAuthRepository) {}

  async generateTokens(user: User) {
    const jwtPayload = toJwtResponse(user);

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.userRepo.createRefreshToken({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  async registerUser(data: registerUserDTO) {
    const { firstName, lastName, email, password, phoneNumber, role } = data;

    const existingUser = await this.userRepo.getUserByEmail(email);

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await this.userRepo.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role: role ?? "USER",
    });
    const tokens = await this.generateTokens(newUser);
    return {
      user: toUserResponse(newUser),
      ...tokens,
    };
  }
  async loginUser(body: loginUserDTO) {
    const { email, password } = body;
    const user = await this.userRepo.getUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      throw new AppError("Invalid credentials", 401);
    }
    const tokens = await this.generateTokens(user);
    return {
      user: toUserResponse(user),
      ...tokens,
    };
  }
  async getCurrentUser(userId: string) {
    const user = await this.userRepo.getUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }
    return toUserResponse(user);
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);

    const hashedToken = hashRefreshToken(refreshToken);

    const storedToken = await this.userRepo.findRefreshToken(hashedToken);

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }
    if (storedToken.expiresAt < new Date()) {
      await this.userRepo.deleteRefreshToken(hashedToken);

      throw new AppError("Refresh token expired", 401);
    }
    const user = await this.userRepo.getUserById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }
    // rotate refresh token

    await this.userRepo.deleteRefreshToken(hashedToken);

    return await this.generateTokens(user);
  }

  async logoutUser(refreshToken: string) {
    const hashedToken = hashRefreshToken(refreshToken);
    await this.userRepo.deleteRefreshToken(hashedToken);
  }
  async logoutFromAllDevices(userId: string) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }
    await this.userRepo.deleteAllRefreshTokensByUserId(userId);
  }
}
