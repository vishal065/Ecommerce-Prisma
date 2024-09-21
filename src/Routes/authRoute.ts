import { Router } from "express";
import { login, me, signup } from "../Controllers/Auth.controller";
import { asyncHandler } from "../Utils/asyncHandler";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const authRoute: Router = Router();

authRoute.route("/signup").post(asyncHandler(signup));
authRoute.post("/login", asyncHandler(login));
authRoute.get("/me", [AuthMiddleware], asyncHandler(me));

export default authRoute;
