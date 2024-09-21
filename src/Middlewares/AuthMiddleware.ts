import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { NextFunction, Request, RequestHandler, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prisma } from "../DBconnect/DBconnect";
import { User } from "@prisma/client";

interface AuthRequest extends Request {
  user?: User;
}

const AuthMiddleware = async (
  req: AuthRequest,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED, 401)
    );
  }
  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await prisma.user.findFirst({ where: { id: payload.id } });

    if (!user) {
      throw new UnauthorizedException(
        "Unauthorized",
        ErrorCode.UNAUTHORIZED,
        401
      );
    }
    req.user = user;
    next();
  } catch (error) {
    next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED, 401)
    );
  }
};

export default AuthMiddleware;
