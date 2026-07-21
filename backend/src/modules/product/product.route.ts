import express from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import {
  createProductController,
  deleteProductController,
  getAllActiveProductsController,
  getAllProductsController,
  getProductsByCategoryIdController,
  toggleActiveProductController,
  updateProductController,
} from "./product.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createProductSchema, productPaginationSchema, updateProductSchema } from "./product.schema.js";
import { productLimiter } from "../../middleware/rate-limit.middleware.js";

const router = express.Router();

router
  .route("/all-products")
  .get(
    validate(productPaginationSchema, "query"),
    authenticate,productLimiter,
    authorize("ADMIN"),
    getAllProductsController,
  );

router
  .route("/")
  .post(
    authenticate,
    productLimiter,
    authorize("SELLER"),
    upload.array("images", 5),
    validate(createProductSchema),
    createProductController,
  );

router
  .route("/update-product/:productId")
  .patch(
    authenticate,
    productLimiter,
    authorize("SELLER"),
    upload.array("images",5),
    validate(updateProductSchema),
    updateProductController,
  );

router
  .route("/:id")
  .delete(authenticate,productLimiter, authorize("SELLER"), deleteProductController);

router.route("/category/:slug").get(getProductsByCategoryIdController);

router.route("/:productId/toggle").patch(authenticate,productLimiter,authorize("SELLER"),toggleActiveProductController)

router.route("/active").get(validate(productPaginationSchema,"query"),getAllActiveProductsController)

export default router;
