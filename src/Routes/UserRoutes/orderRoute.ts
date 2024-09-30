import { Router } from "express";
import AuthMiddleware from "../../Middlewares/AuthMiddleware";
import {
  cancelOrder,
  createOrder,
  getAll,
  getOrderById,
} from "../../Controllers/order.controller";
import { asyncHandler } from "../../Utils/asyncHandler";

const orderRoute: Router = Router();

orderRoute.route("/create").post([AuthMiddleware], asyncHandler(createOrder));
orderRoute.route("/getAll").get([AuthMiddleware], getAll);
orderRoute.route("/get/:id").get([AuthMiddleware], getOrderById);
orderRoute.route("/cancel/:id").put([AuthMiddleware], cancelOrder);

export default orderRoute;
