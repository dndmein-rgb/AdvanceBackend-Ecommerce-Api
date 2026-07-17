import express from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createAddressSchema, updateAddressSchema } from "./address.schema.js";
import {
  createAddressController,
  deleteAddressController,
  getAddressByIdController,
  getMyAddressesController,
  updateAddressController,
} from "./address.controller.js";

const router = express.Router();

router.use(authenticate); // Global requirement for address operations
router
  .route("/create")
  .post(validate(createAddressSchema), createAddressController);
router.route("/getme").get(getMyAddressesController);

router.route("/:addressId").get(getAddressByIdController);

router
  .route("/update/:addressId")
  .patch(validate(updateAddressSchema), updateAddressController);

router.route("/delete/:addressId").delete(deleteAddressController);

export default router;
