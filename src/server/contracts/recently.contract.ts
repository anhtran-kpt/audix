import { z } from "zod";

export const RecentlyTracksInput = z.object({
  limit: z.number().int().min(1).max(30).default(15),
});

export const ArtistMini = z.object({
  id: z.string(),
  name: z.string(),
  imageId: z.string().optional(),
});

export const AlbumMini = z.object({
  id: z.string(),
  title: z.string(),
  imageId: z.string(),
});

export const RecentlyTrack = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number().int(),
  lastPlayedAt: z.string(),
  album: AlbumMini,
  artists: z.array(ArtistMini),
});

export const RecentlyTracksOutput = z.array(RecentlyTrack);

export type RecentlyTracksInput = z.infer<typeof RecentlyTracksInput>;
export type RecentlyTrackDTO = z.infer<typeof RecentlyTrack>;
export type RecentlyTracksOutput = z.infer<typeof RecentlyTracksOutput>;
