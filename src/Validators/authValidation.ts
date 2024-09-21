import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
  password: z.string().min(6),
});
