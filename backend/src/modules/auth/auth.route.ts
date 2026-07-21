import express from "express";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  getloggedInUserController,
  loginUserController,
  logoutFromAllDevicesController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
} from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authLimiter } from "../../middleware/rate-limit.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(authLimiter,validate(registerUserSchema), registerUserController);
router.route("/login").post(authLimiter,validate(loginUserSchema), loginUserController);
router.route("/me").get(authenticate, getloggedInUserController);
router.route("/logout").post(logoutUserController);
router.route("/logout-all").post(authenticate, logoutFromAllDevicesController);
router.route("/refresh-token").post(authLimiter,refreshTokenController);

export default router;
