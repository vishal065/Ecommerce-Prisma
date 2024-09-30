import { User } from "@prisma/client";
import { Request } from "express";

export default interface AuthRequest extends Request {
  user?: User;
  // params: {
  //   id: string; // or `id: number` if the ID is numeric
  // };
  // query: {
  //   [key: string]: string | undefined; // Adjust types based on your expected query parameters
  // };
}
