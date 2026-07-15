import "dotenv/config";
import pg from "pg"; // <-- Import the native pg driver
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../config/config.js";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const connectionString = `${DATABASE_URL}`;

// 1. Declare global tracking for both the Prisma client and the pg Pool
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

// 2. Instantiate or reuse a SINGLE, shared pg.Pool
const pool =
  globalForPrisma.pgPool ??
  new pg.Pool({
    connectionString,
    max: 10, // Max active connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000, // Timeout if a connection cannot be made in 10 seconds
  });

// 3. Instantiate or reuse the PrismaClient with the correct PrismaPg adapter
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool), // <-- Pass the actual instantiated pg.Pool
  });

// 4. In development, store instances globally to prevent hot-reload connection leaks
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = prisma;
}

export { prisma };