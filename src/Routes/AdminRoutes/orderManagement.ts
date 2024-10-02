import { Router } from "express";
import { asyncHandler } from "../../Utils/asyncHandler";
import {
  AdminAllOrder,
  singleUserOrder,
  updateOrderStatus,
} from "../../Controllers/order.controller";

const orderManagementRouter: Router = Router();

orderManagementRouter.route("/AllOrders").get(asyncHandler(AdminAllOrder));
orderManagementRouter.route("/user_order?").get(asyncHandler(singleUserOrder));
orderManagementRouter
  .route("/update_order?")
  .put(asyncHandler(updateOrderStatus));

export default orderManagementRouter;
