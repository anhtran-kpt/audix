import { Prisma } from "@/app/generated/prisma";

export const artistItemSelect = {
  id: true,
  name: true,
  imageId: true,
} satisfies Prisma.ArtistSelect;
