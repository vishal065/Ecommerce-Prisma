import { Router } from "express";
import { addAddress } from "../Controllers/Address.controller";
import { asyncHandler } from "../Utils/asyncHandler";

const AddressRoute = Router();

AddressRoute.route("/add-address").post(asyncHandler(addAddress));

export { AddressRoute };
