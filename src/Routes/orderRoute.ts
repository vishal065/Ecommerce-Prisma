import { Router } from "express";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import { createOrder } from "../Controllers/order.controller";
import { asyncHandler } from "../Utils/asyncHandler";

const orderRoute: Router = Router();

orderRoute.route("/create").post([AuthMiddleware], asyncHandler(createOrder));
orderRoute.route("/update/:id").put();
orderRoute.route("/get").get();
orderRoute.route("/delete/:id").delete();

export default orderRoute;
