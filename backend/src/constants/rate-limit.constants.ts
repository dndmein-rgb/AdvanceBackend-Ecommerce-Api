export const RATE_LIMITS = {
  GLOBAL: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
  },
  USER: {
    WINDOW_MS: 15 * 60 * 1000,
    LIMITS: {
      ADMIN: 1000,
      SELLER: 500,
      USER: 200,
    },
    MAX_REQUESTS: 500,
  },
  AUTH: {
    WINDOW_MS: 1 * 60 * 1000,
    MAX_REQUESTS: 5,
  },
  PRODUCT: {
    WINDOW_MS: 1 * 60 * 1000,
    MAX_REQUESTS: 30,
  },
} as const;
