import { Request, Response } from "express";
import { productValidator } from "../Validators/productValidation";
import { prisma } from "../DBconnect/DBconnect";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";

const addProducts = async (req: Request, res: Response) => {
  productValidator.parse(req.body);

  const product = await prisma.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });

  return res.status(200).json(product);
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product && product.tags) {
      product.tags = product.tags.join(",");
    }
    const updatedProduct = await prisma.product.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...product,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("error", error);
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const newPage = limit * (page - 1);

    const allProducts = await prisma.product.findMany({
      skip: newPage,
      take: limit,
    });
    if (!allProducts) {
      new NotFoundException("No product found", ErrorCode.UNPROCESSABLE_ENTITY);
    }
    res.status(200).json(allProducts);
  } catch (error) {
    new NotFoundException("No product found", ErrorCode.UNPROCESSABLE_ENTITY);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const DeletedProduct = await prisma.product.delete({
      where: {
        id: +req.params.id,
      },
    });
    if (!DeletedProduct) {
      new NotFoundException("No product found", ErrorCode.UNPROCESSABLE_ENTITY);
    }
    res.status(200).json("product deleted successfully");
  } catch (error) {
    new NotFoundException("No product found", ErrorCode.UNPROCESSABLE_ENTITY);
  }
};

export { addProducts, updateProduct, getAllProducts, deleteProduct };
