import { TrackSchema } from "@/app/generated/zod";
import { MiniAlbumSchema } from "@/features/album/contracts/album-schema";
import { MiniArtistSchema } from "@/features/artist/contracts/artist-schema";
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
  album: MiniAlbumSchema,
  addedAt: z.date().optional(),
  isLiked: z.boolean(),
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
