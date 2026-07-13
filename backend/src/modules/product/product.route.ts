import express from "express"
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { createProductController, deleteProductController } from "./product.controller.js";
import { upload } from "../../middleware/multer.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createProductSchema } from "./product.schema.js";

const router=express.Router();

router.route("/").post(authenticate,authorize("SELLER","ADMIN"),upload.array("images",5),validate(createProductSchema),createProductController);

router.route("/:id").delete(authenticate,authorize("ADMIN","SELLER"),deleteProductController)

export default router;