import { Router } from "express";
import authRoute from "./authRoute";
import adminRoute from "./adminRoute";

const IndexRoute: Router = Router();

IndexRoute.use("/auth", authRoute);
IndexRoute.use("/admin", adminRoute);

export default IndexRoute;
