import { ArtistSchema } from "@/app/generated/zod";

export const MiniArtistSchema = ArtistSchema.pick({
  id: true,
  name: true,
});

export const ArtistItemSchema = ArtistSchema.pick({
  id: true,
  name: true,
  imageId: true,
});
