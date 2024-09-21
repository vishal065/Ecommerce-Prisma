import { Router } from "express";
import productRoute from "./productRoute";

const adminRoute: Router = Router();

adminRoute.use("/product", productRoute);

export default adminRoute;
