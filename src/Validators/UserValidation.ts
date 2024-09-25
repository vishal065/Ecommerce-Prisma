import { z } from "zod";

export const UpdateUserValidator = z.object({
  name: z.string().optional(),
  defaultShippingAddressId: z.number().optional(),
  defaultBillingAddressId: z.number().optional(),
});
