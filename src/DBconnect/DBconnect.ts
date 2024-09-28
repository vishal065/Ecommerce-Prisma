import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({ log: ["query"] }).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          line1: true,
          line2: true,
          city: true,
          country: true,
          pincode: true,
        },
        compute: (addr) => {
          return `${addr.line1}, ${addr?.line2}, ${addr.city}, ${addr.country}, ${addr.pincode} `;
        },
      },
    },
  },
});
