import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../config/config.js";

export async function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let error = { ...err };
  error.messsage = err.message;

  // default values
  error.statusCode = err.statusCode || 500;
  error.status = err.satus || "error";

  if (NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: err.stack,
      error,
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  res.status(500).json({
    message: "Something went wrong",
    status: "error",
  });
}
