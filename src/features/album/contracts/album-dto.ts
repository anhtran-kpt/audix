import {
  zCuid,
  zDate,
  zPublicId,
  zTimeStamps,
} from "@/features/shared/contracts/shared-dto";
import {
  AlbumTypeSchema,
  CreditRoleSchema,
} from "@/features/shared/contracts/shared-enum";
import z from "zod";

export const AlbumBaseSchema = z.object({
  id: zCuid,
  title: z.string().min(1),
  description: z.string().nullish(),
  imageId: zPublicId,
  albumType: AlbumTypeSchema,
  releaseDate: zDate.optional(),
  totalTracks: z.number().int().positive(),
  duration: z.number().int().nonnegative(),
  ...zTimeStamps,
});

export const FullAlbumSchema = AlbumBaseSchema.extend({
  album: z.object({
    id: zCuid,
    imageId: zPublicId,
    title: z.string().min(1),
    artist: z.object({
      id: zCuid,
      name: z.string().min(1),
      bannerId: zPublicId,
      bio: z.string().nullish(),
    }),
    _count: z.object({
      likedBy: z.number().int().nonnegative(),
    }),
  }),
  artist: z.object({
    name: z.string().min(1),
    id: zCuid,
    imageId: z.string().min(1),
  }),
  credits: z.array(
    z.object({
      id: zCuid,
      name: z.string().min(1),
      order: z.number().int().nonnegative(),
      role: CreditRoleSchema,
      details: z.string().nullish(),
      artist: z.object({
        id: zCuid,
        name: z.string().min(1),
      }),
    })
  ),
  genres: z
    .object({
      genre: z.object({
        name: z.string().min(1),
        color: z.string().min(1),
        id: zCuid,
      }),
    })
    .array(),
});

export type AlbumBase = z.infer<typeof AlbumBaseSchema>;
export type FullAlbum = z.infer<typeof FullAlbumSchema>;
