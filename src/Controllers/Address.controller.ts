import { User } from "@prisma/client";
import { Request, Response } from "express";
import { AddressValidation } from "../Validators/AddressValidation";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { prisma } from "../DBconnect/DBconnect";
import AuthRequest from "../types/AuthRequest";

export const addAddress = async (req: Request, res: Response) => {
  AddressValidation.parse(req.body);
  let user: User;
  try {
    user = await prisma.user.findFirstOrThrow({
      where: { id: req.body?.id },
    });

    if (!user) {
      throw new NotFoundException("user not found", ErrorCode.USER_NOT_FOUND);
    }

    const address = await prisma.address.create({
      data: {
        ...req.body,
        userId: user.id,
      },
    });

    if (!address) {
      throw new NotFoundException(
        "failed to add address",
        ErrorCode.UNPROCESSABLE_ENTITY
      );
    }
    return res.status(200).json({ address });
  } catch (error) {
    throw new NotFoundException("user not found", ErrorCode.USER_NOT_FOUND);
  }
};
export const updateAddress = async (req: Request, res: Response) => {
  try {
    AddressValidation.parse(req.body);

    const id = Number(req.params.id);

    const find = await prisma.user.findFirstOrThrow({
      where: {
        id: req.body.userId,
      },
    });
    if (!find) {
      throw new NotFoundException("user not found", ErrorCode.USER_NOT_FOUND);
    }
    const updatedData = await prisma.address.update({
      where: {
        id,
      },
      data: {
        ...req.body,
      },
    });
    if (!updatedData) {
      throw new NotFoundException("user not found", ErrorCode.USER_NOT_FOUND);
    }
    return res.status(200).json({ updatedData });
  } catch (error) {
    throw new NotFoundException("user not found", ErrorCode.USER_NOT_FOUND);
  }
};
export const getAddress = async (req: AuthRequest, res: Response) => {
  try {
    const address = await prisma.address.findMany({
      where: { userId: req.user?.id },
    });
    if (!address) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.UNPROCESSABLE_ENTITY
      );
    }
    return res.status(200).json({ address });
  } catch (error) {
    throw new NotFoundException("user not found", ErrorCode.USER_NOT_FOUND);
  }
};
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const deletedAddress = await prisma.address.delete({
      where: {
        id: +req.params.id,
      },
    });
    if (!deletedAddress) {
      throw new NotFoundException(
        "failed to delete address",
        ErrorCode.UNPROCESSABLE_ENTITY
      );
    }
    return res.status(200).json({ deletedAddress });
  } catch (error) {
    throw new NotFoundException("user not found", ErrorCode.USER_NOT_FOUND);
  }
};
