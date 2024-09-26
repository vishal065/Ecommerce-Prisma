import { Request, Response } from "express";
import { prisma } from "../DBconnect/DBconnect";
import { CartValidation } from "../Validators/CartValidation";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import AuthRequest from "../types/AuthRequest";

export const AddToCart = async (req: AuthRequest, res: Response) => {
  const validationData = CartValidation.parse(req.body);
  const { id } = req.user!;
  try {
    const product = await prisma.product.findFirstOrThrow({
      where: {
        id: validationData?.productId,
      },
    });
    if (!product) {
      throw new NotFoundException(
        "product not found",
        ErrorCode.USER_NOT_FOUND
      );
    }

    const cart = await prisma.cart.upsert({
      where: {
        productId_userId: {
          productId: validationData?.productId,
          userId: id,
        },
      },
      update: { quantity: validationData?.quantity },
      create: {
        ...validationData,
        userId: id,
      },
    });
    return res.status(200).json({ message: "Item Added to cart", cart });
  } catch (error) {
    throw new NotFoundException(
      "Faild to add to cart",
      ErrorCode.UNPROCESSABLE_ENTITY
    );
  }
};

export const updateCart = async (req: Request, res: Response) => {
  CartValidation.parse(req.body);
    
  try {
    const updatedCart = await prisma.cart.update({
      where: {
        id: +req.params?.id,
      },
      data: { ...req.body, userId: req.user?.id },
    });

    return res.status(200).json({ data: updateCart });
  } catch (error) {
    throw new NotFoundException(
      "Faild to update to cart",
      ErrorCode.UNPROCESSABLE_ENTITY
    );
  }
};


export const getCart = async (req: Request, res: Response) => {};
