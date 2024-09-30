import { Request, Response } from "express";
import { UpdateUserValidator } from "../Validators/UserValidation";
import { Address } from "@prisma/client";
import { prisma } from "../DBconnect/DBconnect";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/badRequests";
import AuthRequest from "../types/AuthRequest";
import { InternalException } from "../exceptions/internalException";

export const updateUser = async (req: AuthRequest, res: Response) => {
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
    return res.status(200).json(updatedUser);
  } catch (error) {
    throw new NotFoundException(
      "Address not found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

//admin Route

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const newPage = limit * (page - 1);
    const AllUsers = await prisma.user.findMany({ skip: newPage, take: limit });
    return res.status(200).json(AllUsers);
  } catch (error) {
    throw new InternalException(
      "Internal server error",
      error,
      ErrorCode.USER_NOT_FOUND
    );
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    throw new NotFoundException("user Not found", ErrorCode.USER_NOT_FOUND);
  }
};

export const changeRole = async (req: Request, res: Response) => {
  try {
    await prisma.user.update({
      where: {
        id: +req.params?.id,
      },
      data: {
        role: req.body.role,
      },
    });
    return res.status(200).json({ message: "updated role successfully" });
  } catch (error) {
    throw new InternalException(
      "failed to update the role",
      error,
      ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
};
