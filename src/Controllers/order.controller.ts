import { Request, Response } from "express";
import { prisma } from "../DBconnect/DBconnect";
import AuthRequest from "../types/AuthRequest";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { InternalException } from "../exceptions/internalException";
import { OrderEventStatus } from "@prisma/client";

export const createOrder = async (req: AuthRequest, res: Response) => {
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

    console.log("order", order);

    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order?.id,
      },
    });

    console.log("orderEvent", orderEvent);
    await tx.cart.deleteMany({ where: { userId: req.user?.id } });
    return res.status(200).json(order);
  });
};

export const getAll = async (req: AuthRequest, res: Response) => {
  const { query } = req;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const newpage = limit * (page - 1);

  const Allorders = await prisma.order.findMany({
    where: {
      userId: req.user?.id,
    },
    skip: newpage,
    take: limit,
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
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.findFirstOrThrow({
        where: {
          id: req.user?.id,
        },
      });

      const order = await tx.order.update({
        where: {
          id: +req.params?.id,
        },
        data: {
          status: "CANCELLED",
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
        },
      });
      res.status(200).json(order);
    });
  } catch (error) {
    throw new NotFoundException("order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

//admin controller

export const AdminAllOrder = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const newPage = limit * (page - 1);
    let whereClause = {};
    const status = req.params.status;
    if (status) {
      whereClause = {
        status,
      };
    }
    const Allorders = await prisma.order.findMany({
      where: { status: req.params?.status as OrderEventStatus },
      // where: whereClause,    //both can be use
      skip: newPage,
      take: limit,
    });
    return res.status(200).json(Allorders);
  } catch (error) {
    throw new InternalException(
      "failed to fetch order",
      error,
      ErrorCode.ORDER_NOT_FOUND
    );
  }
};

export const singleUserOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const newPage = limit * (page - 1);
    const status = String(req.query.status);
    // const status = req.params.status;
    // let whereClause: any = {
    //   userId: +req.params?.id,
    // };
    // if (status) {
    //   whereClause={
    //     ...whereClause,
    //     status
    //   }
    // }
    console.log(page, limit, newPage, status, "data");

    const order = await prisma.order.findMany({
      // where :whereClause //both are working fine
      where: {
        userId: +req.query?.userId!,
        ...(status && { status: status as OrderEventStatus }),
      },

      skip: newPage,
      take: limit,
    });
    return res.status(200).json(order);
  } catch (error) {
    throw new InternalException(
      "failed to fetch order",
      error,
      ErrorCode.ORDER_NOT_FOUND
    );
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    console.log(req.query?.orderId);
    console.log(req.body.status);

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: Number(req.query?.orderId) },
        data: {
          status: req.body.status,
        },
      });
      await tx.orderEvent.create({
        data: {
          orderId: order?.id,
          status: req.body?.status,
        },
      });
      return res.status(200).json(order);
    });
  } catch (error) {
    throw new InternalException(
      "failed to fetch order",
      error,
      ErrorCode.ORDER_NOT_FOUND
    );
  }
};
