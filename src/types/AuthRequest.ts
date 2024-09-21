import { User } from "@prisma/client";

export default interface AuthRequest extends Request {
  user?: User;
}
