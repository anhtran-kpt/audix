import { Prisma } from "@/app/generated/prisma";

export const albumItemSelect = {
  id: true,
  title: true,
  imageId: true,
  albumType: true,
  artist: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.AlbumSelect;
