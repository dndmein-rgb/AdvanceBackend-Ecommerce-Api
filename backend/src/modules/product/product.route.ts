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
import { createProductSchema, updateProductSchema } from "./product.schema.js";

const router = express.Router();

router
  .route("/all-products")
  .get(authenticate, authorize("ADMIN"), getAllProductsController);

router
  .route("/")
  .post(
    authenticate,
    authorize("SELLER"),
    upload.array("images", 5),
    validate(createProductSchema),
    createProductController,
  );

router
  .route("/update-product/:productId")
  .patch(
    authenticate,
    authorize("SELLER"),
    upload.array("images",5),
    validate(updateProductSchema),
    updateProductController,
  );

router
  .route("/:id")
  .delete(authenticate, authorize("SELLER"), deleteProductController);

router.route("/category/:slug").get(getProductsByCategoryIdController);

router.route("/:productId/toggle").patch(authenticate,authorize("SELLER"),toggleActiveProductController)

router.route("/active").get(getAllActiveProductsController)

export default router;
