import { NextFunction, Request, Response } from "express";
import { AuthService } from "../modules/auth/auth.service.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.helper.js";
import { IJwtPayload } from "../types/index.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");

    const token =
      req.cookies?.accessToken ||
      (authHeader?.startsWith("Bearer") ? authHeader.substring(7) : undefined);
    if (!token) {
      throw new AppError("Unauthorized", 401);
    }
    const decoded = verifyAccessToken(token) as IJwtPayload;
    if (!decoded) {
      throw new AppError("Unauthorized", 401);
    }
    req.user = decoded;

    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError("Invalid or expired token", 401),
    );
  }
};

export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  if (req.user.role !== "SELLER") {
    throw new AppError("You are not authorized", 403);
  }
  next();
};
