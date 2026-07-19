import { AppError } from "./AppError.js";

export interface ProductCursor {
  createdAt: Date;
  id: string;
}

export const encodeCursor = (cursor: ProductCursor): string => {
  const data = JSON.stringify({
    createdAt: cursor.createdAt.toISOString(),
    id: cursor.id,
  });
  return Buffer.from(data).toString("base64");
};

export const decodeCursor = (cursor: string): ProductCursor => {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    return {
      createdAt: new Date(parsed.createdAt),
      id: parsed.id,
    };
  } catch {
    throw new AppError("Invalid cursor", 400);
  }
};
