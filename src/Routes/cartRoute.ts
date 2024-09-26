import { Router } from "express";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import { AddToCart, updateCart } from "../Controllers/Cart.controller";
import { asyncHandler } from "../Utils/asyncHandler";

const CartRouter: Router = Router();

CartRouter.route("/create").post([AuthMiddleware], asyncHandler(AddToCart));
CartRouter.route("/update").put([AuthMiddleware], updateCart);

export default CartRouter;
