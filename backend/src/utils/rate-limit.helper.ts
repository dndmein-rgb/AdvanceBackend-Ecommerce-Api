import { Request } from "express";
import { ipKeyGenerator } from "express-rate-limit";

export const requestIpKeyGenerator = (req: Request): string => {
  return ipKeyGenerator(req.ip ?? "unknown");
};
export const userKeyGenerator = (req: Request) => {
  return req.user!.id;
};
