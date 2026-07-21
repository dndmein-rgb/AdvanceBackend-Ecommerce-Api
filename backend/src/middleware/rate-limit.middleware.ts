import {  rateLimit, ValueDeterminingMiddleware } from "express-rate-limit";
import { RedisReply, RedisStore } from "rate-limit-redis";

import redis from "../lib/redis.js";
import { RATE_LIMITS } from "../constants/rate-limit.constants.js";
import {
  requestIpKeyGenerator,
  userKeyGenerator,
} from "../utils/rate-limit.helper.js";
import { Role } from "@prisma/client";

interface RateLimiterOptions {
  windowMs: number;
  limit: number|ValueDeterminingMiddleware<number>;
  keyGenerator?: ValueDeterminingMiddleware<string>;
  prefix: string;
  error: {
    message: string;
    code: string;
  };
}

const createRateLimiter = ({
  windowMs,
  limit,
  keyGenerator,
  error,
  prefix,
}: RateLimiterOptions) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    store: new RedisStore({
      sendCommand: (...args: string[]): Promise<RedisReply> =>
        redis.call(...(args as [string, ...string[]])) as Promise<RedisReply>,
      prefix,
    }),
    handler: (_, res) => {
      res.status(429).json({
        success: false,
        error,
      });
    },
  });
};

export default createRateLimiter;

// ip based fix window rate limiting
export const globalLimiter = createRateLimiter({
  windowMs: RATE_LIMITS.GLOBAL.WINDOW_MS,
  error: {
    code: "GLOBAL_RATE_LIMIT_EXCEEDED",
    message: "Too many requests from your IP address. Please try again later.",
  },
  limit: RATE_LIMITS.GLOBAL.MAX_REQUESTS,
  keyGenerator: requestIpKeyGenerator,
  prefix: "rate-limit:global:",
});

export const authLimiter = createRateLimiter({
  windowMs: RATE_LIMITS.AUTH.WINDOW_MS,
  limit: RATE_LIMITS.AUTH.MAX_REQUESTS,
  keyGenerator: requestIpKeyGenerator,
  error: {
    code: "AUTH_RATE_LIMIT_EXCEEDED",
    message: "Too many authentication attempts",
  },
  prefix: "rate-limit:auth:",
});

export const userLimiter = createRateLimiter({
  windowMs: RATE_LIMITS.USER.WINDOW_MS,
  limit: (req) => {
    switch (req.user!.role) {
          case Role.ADMIN:
            return RATE_LIMITS.USER.LIMITS.ADMIN;
    
          case Role.SELLER:
            return RATE_LIMITS.USER.LIMITS.SELLER;
    
          case Role.USER:
          default:
            return RATE_LIMITS.USER.LIMITS.USER;
        }
      },
  
  keyGenerator: userKeyGenerator,
  error: {
    code: "USER_RATE_LIMIT_EXCEEDED",
    message:
      "You have exceeded the allowed number of requests. Please try again later.",
  },
  prefix: "rate-limit:user:",
});

export const productLimiter = createRateLimiter({
  windowMs: RATE_LIMITS.PRODUCT.WINDOW_MS,
  limit: RATE_LIMITS.PRODUCT.MAX_REQUESTS,
  keyGenerator: userKeyGenerator,
  error: {
    code: "PRODUCT_RATE_LIMIT_EXCEEDED",
    message: "Product request limit exceeded. Please try again later.",
  },
  prefix: "rate-limit:product:",
});
