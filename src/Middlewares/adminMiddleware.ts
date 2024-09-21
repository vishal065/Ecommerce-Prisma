import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";

interface AuthRequest extends Request {
  user?: User;
}

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.user?.role;

    if (role !== "ADMIN") {
      next(
        new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED, 401)
      );
    }
    next();
  } catch (error) {
    console.error("Error in adminMiddleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
