import express from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createOrderSchema, updateOrderStatusSchema } from "./order.schema.js";
import {
  cancelOrderController,
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  updateOrderStatusController,
} from "./order.controller.js";

const router = express.Router();

router
  .route("/create")
  .post(authenticate, validate(createOrderSchema), createOrderController);

router.route("/").get(authenticate, getMyOrdersController);

router.route("/:orderId").get(authenticate, getOrderByIdController);

router.route("/:orderId/cancel").patch(authenticate, cancelOrderController);

router
  .route("/:orderId/status")
  .patch(
    authenticate,
    authorize("ADMIN"),
    validate(updateOrderStatusSchema),
    updateOrderStatusController,
  );

export default router;
