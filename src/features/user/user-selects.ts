import { Prisma } from "@/app/generated/prisma";

export const userItemSelect = {
  id: true,
  name: true,
} satisfies Prisma.UserSelect;
