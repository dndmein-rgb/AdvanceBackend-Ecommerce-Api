import express, { Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { FRONTEND_URL } from "./config/config.js";

export const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.get("/health-check", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "server running",
  });
});

import authRouter from "./modules/auth/auth.route.js";
import categoryRouter from "./modules/category/category.route.js";
import productRouter from "./modules/product/product.route.js";
import orderRouter from "./modules/order/order.route.js";

import { globalErrorHandler } from "./middleware/error.middleware.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.use(globalErrorHandler);
