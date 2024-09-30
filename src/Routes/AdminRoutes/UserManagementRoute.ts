import { Router } from "express";
import AuthMiddleware from "../../Middlewares/AuthMiddleware";
import { adminMiddleware } from "../../Middlewares/adminMiddleware";
import { getAllUsers } from "../../Controllers/User.controller";
import { asyncHandler } from "../../Utils/asyncHandler";

const UserManagementRoute: Router = Router();

UserManagementRoute.route("/getAll").get(
  [AuthMiddleware, adminMiddleware],
  asyncHandler(getAllUsers)
);

export default UserManagementRoute;
