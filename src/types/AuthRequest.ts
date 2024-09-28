import { User } from "@prisma/client";

export default interface AuthRequest extends Request {
  user?: User;
  params: {
    id: string; // or `id: number` if the ID is numeric
  };
}
