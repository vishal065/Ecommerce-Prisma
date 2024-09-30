import { Router } from "express";
import { asyncHandler } from "../../Utils/asyncHandler";

const orderManagementRouter :Router= Router()

orderManagementRouter.route("/AllOrders").get(asyncHandler)

export default orderManagementRouter