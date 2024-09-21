import { z } from "zod";

export const productValidator = z.object({
  name: z.string().min(3),
  description: z.string().min(5).max(50),
  price: z.number().nonnegative(),
  tags: z.string().array(),
});
