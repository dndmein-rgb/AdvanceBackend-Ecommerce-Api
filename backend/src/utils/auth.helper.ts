import bcrypt from "bcrypt";
import crypto from "crypto";
import { NODE_ENV } from "../config/config.js";
import { Response } from "express";
import { ACCESS_TOKEN_EXPIRES_MS, REFRESH_TOKEN_EXPIRES_MS } from "../constants/time.constants.js";

const isProduction = NODE_ENV === "production";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPasswordInDb: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPasswordInDb);
};

export const hashRefreshToken = (refreshToken: string): string => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

export const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_EXPIRES_MS,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_EXPIRES_MS,
  });
};

export const destroyCookies = (res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_EXPIRES_MS,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_EXPIRES_MS,
  });
};
