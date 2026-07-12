import express from "express"
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { createCategoryController } from "./category.controller.js";

const router=express.Router();

router.route("/create").post(authenticate, authorize("ADMIN"),createCategoryController)

export default router