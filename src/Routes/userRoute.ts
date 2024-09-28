import { Router } from "express";
import authRoute from "./authRoute";
import { AddressRoute } from "./addressRoute";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import { updateUser } from "../Controllers/User.controller";
import { asyncHandler } from "../Utils/asyncHandler";
import CartRouter from "./cartRoute";
import orderRoute from "./orderRoute";

const UserRoute: Router = Router();

UserRoute.use("/auth", authRoute);
UserRoute.use("/address", AddressRoute);
UserRoute.use("/cart", CartRouter);
UserRoute.use("/order", orderRoute);

UserRoute.route("/update-user").put(AuthMiddleware, asyncHandler(updateUser));

export default UserRoute;
