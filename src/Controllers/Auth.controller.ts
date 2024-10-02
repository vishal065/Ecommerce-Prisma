import { NextFunction, Request, Response } from "express";
import { compareSync, hashSync } from "bcrypt";
import { prisma } from "../DBconnect/DBconnect";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/badRequests";
import { ErrorCode } from "../exceptions/root";
import { SignupValidation } from "../Validators/authValidation";
import { NotFoundException } from "../exceptions/notFound";
import AuthRequest from "../types/AuthRequest";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignupValidation.parse(req.body);

  const { name, email, password, role } = req.body;

  let user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    return next(
      new BadRequestsException(
        "user already exist!",
        ErrorCode.USER_ALREADY_EXIST
      )
    );
  }

  user = await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashSync(password, 10),
    },
  });

  res.status(200).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password: pass } = req.body;
  const user = await prisma.user.findFirstOrThrow({ where: { email } });

  if (!user) {
    throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(pass, user.password)) {
    throw new BadRequestsException(
      "Wrong credentials",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

  console.log("before pass", user.password);

  // Remove password from the user object before sending it back
  const { password: _, ...data } = user;

  console.log("1", pass);
  console.log("2", _);
  console.log(data);

  // Return the user details (without the password) and the token
  res.status(200).json({ user: data, token });
};

export const me = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  return res.json(user);
};
