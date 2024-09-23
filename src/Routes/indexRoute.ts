import { Router } from "express";
import authRoute from "./userRoute";
import adminRoute from "./adminRoute";
import UserRoute from "./userRoute";

const IndexRoute: Router = Router();

IndexRoute.use("/user", UserRoute);
IndexRoute.use("/admin", adminRoute);

export default IndexRoute;
