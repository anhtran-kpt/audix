import { AlbumSchema, ArtistSchema } from "@/app/generated/zod";

export const MiniAlbumSchema = AlbumSchema.pick({
  id: true,
  imageId: true,
  title: true,
});

export const AlbumItemSchema = AlbumSchema.pick({
  id: true,
  imageId: true,
  title: true,
  albumType: true,
  releaseDate: true,
}).extend({
  releaseDate: AlbumSchema.shape.releaseDate.optional(),
  artist: ArtistSchema.pick({
    id: true,
    name: true,
  }),
});
