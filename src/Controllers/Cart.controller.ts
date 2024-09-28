import { Request, Response } from "express";
import { prisma } from "../DBconnect/DBconnect";
import { CartUpdateValidation, CartValidation } from "../Validators/CartValidation";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import AuthRequest from "../types/AuthRequest";
import { BadRequestsException } from "../exceptions/badRequests";

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

    const AlreadyExistInCart = await prisma.cart.findFirst({
      where: { productId: validationData.productId },
    });
    console.log(AlreadyExistInCart);

    if (AlreadyExistInCart) {
      return res.status(400).json({ message: "item already exist in cart" });
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

export const updateCart = async (req: AuthRequest, res: Response) => {
  CartUpdateValidation.parse(req.body);

  try {
    const updatedCart = await prisma.cart.update({
      where: {
        id: +req.params?.id,
      },
      data: { ...req.body, userId: req.user?.id },
    });

    return res.status(200).json({ data: updatedCart });
  } catch (error) {
    throw new NotFoundException(
      "Faild to update to cart",
      ErrorCode.UNPROCESSABLE_ENTITY
    );
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  const cart = await prisma.cart.findMany({
    where: {
      userId: req.user?.id,
    },
    include: { product: true },
  });
  if (!cart) {
    return res.status(200).json({ message: "Cart is empty" });
  }
  return res.status(200).json({ data: cart });
};
