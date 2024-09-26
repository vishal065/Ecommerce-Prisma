import { z } from "zod";

export const CartValidation = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});
