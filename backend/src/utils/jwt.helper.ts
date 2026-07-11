import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "../types/index.js";
import {
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_SECRET,
} from "../config/config.js";

const ACCESS_TOKEN_SECRET = JWT_ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = JWT_REFRESH_TOKEN_SECRET as string;
const ACCESS_TOKEN_EXPIRY = JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"];
const REFRESH_TOKEN_EXPIRY =
  JWT_REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"];

export const generateAccessToken = (user: IJwtPayload) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (user: IJwtPayload) => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as IJwtPayload;
};
export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as IJwtPayload;
};
