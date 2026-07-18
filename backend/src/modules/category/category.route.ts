import express from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  getCategoryByIdController,
  updateCategoryController,
} from "./category.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";

const router = express.Router();

router.route("/all-category").get(getAllCategoryController);
router
  .route("/create")
  .post(
    authenticate,
    authorize("ADMIN"),
    validate(createCategorySchema),
    createCategoryController,
  );
router
  .route("/delete/:categoryId")
  .delete(authenticate, authorize("ADMIN", "SELLER"), deleteCategoryController);

  router.route("/:categoryId").get(authenticate,getCategoryByIdController)

router
  .route("/update/:categoryId")
  .patch(
    authenticate,
    authorize("ADMIN"),
    validate(updateCategorySchema),
    updateCategoryController,
  );

export default router;
