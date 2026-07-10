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
} from "../../utils/jwt.helper.js";

export class AuthService {
  constructor(private readonly userRepo: IAuthRepository) {}

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
    const jwtPayload = toJwtResponse(newUser);

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.userRepo.createRefreshToken({
      token: hashedRefreshToken,
      userId: newUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return {
      user: toUserResponse(newUser),
      accessToken,
      refreshToken,
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
     const jwtPayload = toJwtResponse(user);
    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    await this.userRepo.createRefreshToken({
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return {
      user:toUserResponse(user),
      accessToken,
      refreshToken
    }
  }
}
