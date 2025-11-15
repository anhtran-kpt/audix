import { TrackSchema } from "@/app/generated/zod";
import { MiniAlbumSchema } from "@/features/album/album-schemas";
import {
  ArtistItemSchema,
  MiniArtistSchema,
} from "@/features/artist/artist-schemas";
import z from "zod";

export const TrackItemSchema = TrackSchema.pick({
  id: true,
  title: true,
  isExplicit: true,
  duration: true,
  playCount: true,
  audioId: true,
}).extend({
  artists: MiniArtistSchema.array(),
  album: MiniAlbumSchema.extend({ artist: ArtistItemSchema }),
  addedAt: z.date().nullish(),
});

export const MiniTrackItemSchema = TrackSchema.pick({
  id: true,
});

export const GetTracksQuerySchema = z.object({
  ids: z
    .string()
    .transform((v) => v.split(","))
    .refine((arr) => arr.length > 0, "At least one id is required"),
});

export const TrackParamsSchema = z.object({
  trackId: z.cuid2(),
});
