import { ArtistSchema } from "@/app/generated/zod";
import z from "zod";

export const MiniArtistSchema = ArtistSchema.pick({
  id: true,
  name: true,
});

export const ArtistItemSchema = ArtistSchema.pick({
  id: true,
  name: true,
  imageId: true,
});

export const ArtistParamsSchema = z.object({
  artistId: z.cuid2(),
});
