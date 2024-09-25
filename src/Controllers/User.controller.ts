import { Request, Response } from "express";
import { UpdateUserValidator } from "../Validators/UserValidation";
import { Address } from "@prisma/client";
import { prisma } from "../DBconnect/DBconnect";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/badRequests";
export const updateUser = async (req: Request, res: Response) => {
  const validatedData = UpdateUserValidator.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddressId) {
    try {
      shippingAddress = await prisma.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddressId,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (shippingAddress.userId != req.user?.id) {
      throw new BadRequestsException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }
  if (validatedData.defaultBillingAddressId) {
    try {
      billingAddress = await prisma.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddressId,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (billingAddress.userId != req.user?.id) {
      throw new BadRequestsException(
        "Address does not belong to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: validatedData,
    });
  } catch (error) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};
