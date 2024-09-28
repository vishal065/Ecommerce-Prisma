import { Request, Response } from "express";
import { prisma } from "../DBconnect/DBconnect";
import AuthRequest from "../types/AuthRequest";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (req: AuthRequest, res: Response) => {
  const abc = prisma.user.findFirst({
    where: {
      id: req.user?.id,
    },
  });

  const user = await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cart.findMany({
      where: {
        userId: req.user?.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem || cartItem.length === 0) {
      return res.status(200).json({ message: "cart is empty" });
    }

    const price = cartItem.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await tx.address.findFirst({
      where: {
        id: req.user?.defaultShippingAddressId as number,
      },
    });

    const order = await tx.order.create({
      data: {
        userId: req.user?.id as number,
        netAmount: price,
        address: address?.formattedAddress as string,
        OrderProduct: {
          create: cartItem.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order?.id,
      },
    });

    await tx.cart.deleteMany({ where: { userId: req.user?.id } });
    return res.status(200).json(order);
  });
};
export const update = async (req: Request, res: Response) => {};
export const getAll = async (req: Request, res: Response) => {
  const Allorders = await prisma.order.findMany({
    where: {
      userId: req.user?.id,
    },
  });
  return res.status(200).json(Allorders);
};
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirstOrThrow({
      where: {
        id: +req.params?.id,
      },
      include: {
        OrderProduct: true,
        OrderEvent: true,
      },
    });
    return res.status(200).json(order);
  } catch (error) {
    throw new NotFoundException("order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};
export const deleteOrder = async (req: Request, res: Response) => {};
