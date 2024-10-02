import { Router } from "express";
import productRoute from "../productRoute";
import UserManagementRoute from "./UserManagementRoute";
import orderManagementRouter from "./orderManagement";

const adminRoute: Router = Router();

adminRoute.use("/product", productRoute);
adminRoute.use("/manage-user", UserManagementRoute);
adminRoute.use("/manage-order", orderManagementRouter);

export default adminRoute;
