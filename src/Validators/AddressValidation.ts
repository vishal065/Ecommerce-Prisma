import { z } from "zod";

export const AddressValidation = z.object({
  line1: z.string().min(2),
  line2: z.string().nullable(),
  city: z.string().min(2),
  country: z.string().min(2),
  pincode: z.string().length(6),
  userId: z.number(),
});
