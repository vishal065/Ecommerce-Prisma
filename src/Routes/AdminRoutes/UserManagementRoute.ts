import { Router } from "express";
import AuthMiddleware from "../../Middlewares/AuthMiddleware";
import { adminMiddleware } from "../../Middlewares/adminMiddleware";
import {
  changeRole,
  getAllUsers,
  getUserById,
} from "../../Controllers/User.controller";
import { asyncHandler } from "../../Utils/asyncHandler";

const UserManagementRoute: Router = Router();

UserManagementRoute.route("/getAll").get(
  [AuthMiddleware, adminMiddleware],
  asyncHandler(getAllUsers)
);
UserManagementRoute.route("/getUser/:id").get(
  [AuthMiddleware, adminMiddleware],
  asyncHandler(getUserById)
);
UserManagementRoute.route("/changeRole/:id").put(
  [AuthMiddleware, adminMiddleware],
  asyncHandler(changeRole)
);

export default UserManagementRoute;
