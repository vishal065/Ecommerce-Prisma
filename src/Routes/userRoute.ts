import { Router } from "express";
import authRoute from "./authRoute";
import { AddressRoute } from "./addressRoute";

const UserRoute: Router = Router();

UserRoute.use("/auth", authRoute);
UserRoute.use("/address",AddressRoute)



export default UserRoute;
