import { Router } from "express";
import AuthMiddleware from "../../Middlewares/AuthMiddleware";
import {
  AddToCart,
  getCart,
  updateCart,
} from "../../Controllers/Cart.controller";
import { asyncHandler } from "../../Utils/asyncHandler";

const CartRouter: Router = Router();

CartRouter.route("/create").post([AuthMiddleware], asyncHandler(AddToCart));
CartRouter.route("/update/:id").put([AuthMiddleware], asyncHandler(updateCart));
CartRouter.route("/get").get([AuthMiddleware], asyncHandler(getCart));

export default CartRouter;
