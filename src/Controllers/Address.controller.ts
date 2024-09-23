import { prisma } from "../DBconnect/DBconnect";
import { AddressValidation } from "../Validators/AddressValidation";

export const addAddress = async (req: Request, res: Response) => {
  try {
    await prisma.user.findFirstOrThrow({ where: {} });
  } catch (error) {
    return res.json();
  }
};
export const updateAddress = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
export const getAddress = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
export const deleteAddress = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
