import { AlbumSchema } from "@/app/generated/zod";

export const MiniAlbumSchema = AlbumSchema.pick({
  id: true,
  imageId: true,
  title: true,
});

export const AlbumGridItemSchema = AlbumSchema.pick({
  id: true,
  imageId: true,
  title: true,
  releaseDate: true,
  albumType: true,
});
