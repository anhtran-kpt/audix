import { BaseArtistSchema } from "@/features/artist/contracts/artist-schema";
import { BaseGenreSchema } from "@/features/genre/data-access/genre-schema";
import { AlbumTypeSchema } from "@/features/shared/contracts/shared-enum";
import {
  zCuidSchema,
  zDateSchema,
  zIntSchema,
  zPublicIdSchema,
  zStringSchema,
  zTimeStamps,
} from "@/features/shared/contracts/shared-schema";
import z from "zod";

export const BaseAlbumSchema = z.object({
  id: zCuidSchema,
  title: zStringSchema,
  description: zStringSchema.nullish(),
  imageId: zPublicIdSchema,
  albumType: AlbumTypeSchema,
  releaseDate: zDateSchema,
  totalTracks: zIntSchema,
  duration: zIntSchema,
  ...zTimeStamps,
});

export const FullAlbumSchema = BaseAlbumSchema.extend({
  artist: BaseArtistSchema,
  genres: BaseGenreSchema.array(),
});

export const AlbumGridItemSchema = BaseAlbumSchema.pick({
  id: true,
  title: true,
  imageId: true,
  releaseDate: true,
  albumType: true,
});
