import { Router } from "express";
import { adminMiddleware } from "../Middlewares/adminMiddleware";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import {
  addProducts,
  getAllProducts,
  updateProduct,
} from "../Controllers/ProductController";
import { asyncHandler } from "../Utils/asyncHandler";

const productRoute: Router = Router();

productRoute
  .route("/add-product")
  .post([AuthMiddleware, adminMiddleware], asyncHandler(addProducts));

productRoute
  .route("/update-product/:id")
  .put([AuthMiddleware, adminMiddleware], asyncHandler(updateProduct));

productRoute.route("/getAllProduct").get(asyncHandler(getAllProducts));

export default productRoute;
