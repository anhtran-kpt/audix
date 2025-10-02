import { ArtistSchema } from "@/app/generated/zod";

export const MiniArtistSchema = ArtistSchema.pick({
  id: true,
  name: true,
});

export const ArtistGridItemSchema = ArtistSchema.pick({
  id: true,
  name: true,
  imageId: true,
});
