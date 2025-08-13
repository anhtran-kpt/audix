import prisma from "@/lib/prisma";
import { SignUpInput } from "../schemas/auth.schema";

export const authRepo = {
  async existsByEmail(email: string): Promise<boolean> {
    const u = await prisma.user.findUnique({ where: { email } });
    return !!u;
  },
  create(data: { email: string; name: string; password: string }) {
    return prisma.user.create({
      data,
    });
  },
};
