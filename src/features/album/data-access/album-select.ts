import { Prisma } from "@/app/generated/prisma";

export const albumItemSelect = {
  id: true,
  title: true,
  imageId: true,
  releaseDate: true,
  albumType: true,
} satisfies Prisma.AlbumSelect;

export type AlbumItem = Prisma.AlbumGetPayload<{
  select: typeof albumItemSelect;
}>;
