import { z } from "zod";

export const CartValidation = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});
export const CartUpdateValidation = z.object({
  quantity: z.number().min(1),
});
