import { TrackSchema } from "@/app/generated/zod";
import { MiniAlbumSchema } from "@/features/album/contracts/album-schema";
import { MiniArtistSchema } from "@/features/artist/contracts/artist-schema";
import z from "zod";

export const TrackListItemSchema = TrackSchema.pick({
  id: true,
  title: true,
  isExplicit: true,
  duration: true,
  playCount: true,
}).extend({
  artists: MiniArtistSchema.array(),
  album: MiniAlbumSchema,
  addedAt: z.date().optional(),
});

