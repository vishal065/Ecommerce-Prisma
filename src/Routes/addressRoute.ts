import { Router } from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../Controllers/Address.controller";
import { asyncHandler } from "../Utils/asyncHandler";
import AuthMiddleware from "../Middlewares/AuthMiddleware";

const AddressRoute = Router();

AddressRoute.route("/add-address").post(
  [AuthMiddleware],
  asyncHandler(addAddress)
);
AddressRoute.route("/update-address/:id").put(
  [AuthMiddleware],
  asyncHandler(updateAddress)
);
AddressRoute.route("/get-address").get(
  [AuthMiddleware],
  asyncHandler(getAddress)
);
AddressRoute.route("/delete-address/:id").delete(
  [AuthMiddleware],
  asyncHandler(deleteAddress)
);

export { AddressRoute };
