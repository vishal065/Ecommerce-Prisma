import { z } from "zod";

export const AddressValidation = z.object({
  line1: z.string().min(2),
  // line2: z.string().nullable(),  //in new update we use optional
  line2: z.string().optional(),
  city: z.string().min(2),
  country: z.string().min(2),
  pincode: z.string().length(6),
  userId: z.number(),
});
