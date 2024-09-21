// import { User } from "@prisma/client";

// declare module "express" {
//   export interface Request {
//     user?: User;
//   }
// }
// src/@types/express.d.ts
import { User } from "@prisma/client"; // Adjust the import based on your User model path
import * as express from "express";



declare global {
  namespace Express {
    interface Request {
      user?: User; // Replace User with your actual user interface type
    }
    
  }
}
