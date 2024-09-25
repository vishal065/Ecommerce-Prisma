import { Router } from "express";
import authRoute from "./authRoute";
import { AddressRoute } from "./addressRoute";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import { updateUser } from "../Controllers/User.controller";

const UserRoute: Router = Router();

UserRoute.use("/auth", authRoute);
UserRoute.use("/address", AddressRoute);

UserRoute.route("/update-user").put(AuthMiddleware, updateUser);

export default UserRoute;
