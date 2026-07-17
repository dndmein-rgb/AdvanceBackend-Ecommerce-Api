import express from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  addToCartController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from "./cart.controller.js";

import {
  addToCartSchema,
  updateCartItemSchema,
} from "./cart.schema.js";

const router = express.Router();


router
  .route("/")
  .get(authenticate, getCartController)


  router.route("/delete")
  .delete(authenticate, clearCartController);


router
  .route("/items")
  .post(
    authenticate,
    validate(addToCartSchema),
    addToCartController
  );


router
  .route("/items/:cartItemId")
  .patch(
    authenticate,
    validate(updateCartItemSchema),
    updateCartItemController
  )

  router
  .route("/items/delete/:cartItemId")
  .delete(
    authenticate,
    removeCartItemController
  );

export default router;