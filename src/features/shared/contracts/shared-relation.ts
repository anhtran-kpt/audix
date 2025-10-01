import z from "zod";
import {
  zCuidSchema,
  zDateSchema,
  zIntSchema,
  zStringSchema,
} from "./shared-schema";
import { ArtistRoleSchema, CreditRoleSchema } from "./shared-enum";
import { BaseTrackSchema } from "@/features/track/contracts/track-schema";
import { BaseArtistSchema } from "@/features/artist/contracts/artist-schema";
import { BaseGenreSchema } from "@/features/genre/data-access/genre-schema";
import { BasePlaylistSchema } from "@/features/playlist/contracts/playlist-schema";

export const TrackArtistSchema = z.object({
  id: zCuidSchema,
  trackId: zCuidSchema,
  artistId: zCuidSchema,
  role: ArtistRoleSchema,
  order: zIntSchema,
  track: z.lazy(() => BaseTrackSchema),
  artist: z.lazy(() => BaseArtistSchema),
});

export const TrackCreditSchema = z.object({
  id: zCuidSchema,
  trackId: zCuidSchema,
  artistId: zCuidSchema.nullish(),
  name: zStringSchema,
  role: CreditRoleSchema,
  details: zStringSchema.nullish(),
  order: zIntSchema,
  track: z.lazy(() => BaseTrackSchema),
  artist: z.lazy(() => BaseArtistSchema.nullish()),
});

export const ArtistGenreSchema = z.object({
  artistId: zCuidSchema,
  genreId: zCuidSchema,
  artist: z.lazy(() => BaseArtistSchema),
  genre: z.lazy(() => BaseGenreSchema),
});

export const TrackGenreSchema = z.object({
  trackId: zCuidSchema,
  genreId: zCuidSchema,
  track: z.lazy(() => BaseTrackSchema),
  genre: z.lazy(() => BaseGenreSchema),
});

export const PlaylistTrackSchema = z.object({
  id: zCuidSchema,
  position: zIntSchema,
  addedAt: zDateSchema,
  playlistId: zCuidSchema,
  trackId: zCuidSchema,
  playlist: z.lazy(() => BasePlaylistSchema),
  track: z.lazy(() => BaseTrackSchema),
});
