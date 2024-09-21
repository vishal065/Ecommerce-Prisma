import { HttpException } from "../exceptions/root";
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error: HttpException,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.log("error middleware");

  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors,
  });
  // next();
};
