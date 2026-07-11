import express from "express";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  getloggedInUserController,
  loginUserController,
  logoutFromAllDevicesController,
  logoutUserController,
  registerUserController,
} from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);
router.route("/login").post(validate(loginUserSchema), loginUserController);
router.route("/me").get(authenticate, getloggedInUserController);
router.route("/logout").post(logoutUserController);
router.route("/logout-all").post(authenticate,logoutFromAllDevicesController)

export default router;
