import { ZodError } from "zod";
import { InternalException } from "../exceptions/internalException";
import { ErrorCode, HttpException } from "../exceptions/root";
import { Request, Response, NextFunction } from "express";
import { BadRequestsException } from "../exceptions/badRequests";

export const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      let exception: HttpException;

      if (error instanceof HttpException) {
        exception = error;
      } else {
        // if (error instanceof ZodError) {
        //   exception = new BadRequestsException(
        //     "Unprocessable entity",
        //     ErrorCode.UNPROCESSABLE_ENTITY,

        //   );
        // }
        {
          //else   --add else if uncomment above if
          exception = new InternalException(
            "something went wrong",
            error,
            ErrorCode.INTERNAL_SERVER_ERROR
          );
        }

        next(exception);
      }
    }
  };
};

// export const asyncHandler = (fn: Function) => {
//   return (req: Request, res: Response, next: NextFunction) =>
//     Promise.resolve(fn(req, res, next)).catch((error) => next(error));
// };
