import { Router } from "express";
import productRoute from "../productRoute";
import UserManagementRoute from "./UserManagementRoute";

const adminRoute: Router = Router();

adminRoute.use("/product", productRoute);
adminRoute.use("/manage-user", UserManagementRoute);

export default adminRoute;
