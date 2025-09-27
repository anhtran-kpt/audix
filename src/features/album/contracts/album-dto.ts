import {
  zCuidSchema,
  zDateSchema,
  zPublicIdSchema,
  zTimeStamps,
} from "@/features/shared/contracts/shared-dto";
import {
  AlbumTypeSchema,
  CreditRoleSchema,
} from "@/features/shared/contracts/shared-enum";
import z from "zod";

export const AlbumBaseSchema = z.object({
  id: zCuidSchema,
  title: z.string().min(1),
  description: z.string().nullish(),
  imageId: zPublicIdSchema,
  albumType: AlbumTypeSchema,
  releaseDate: zDateSchema.optional(),
  totalTracks: z.number().int().positive(),
  duration: z.number().int().nonnegative(),
  ...zTimeStamps,
});

export const FullAlbumSchema = AlbumBaseSchema.extend({
  album: z.object({
    id: zCuidSchema,
    imageId: zPublicIdSchema,
    title: z.string().min(1),
    artist: z.object({
      id: zCuidSchema,
      name: z.string().min(1),
      bannerId: zPublicIdSchema,
      bio: z.string().nullish(),
    }),
    _count: z.object({
      likedBy: z.number().int().nonnegative(),
    }),
  }),
  artist: z.object({
    name: z.string().min(1),
    id: zCuidSchema,
    imageId: z.string().min(1),
  }),
  credits: z.array(
    z.object({
      id: zCuidSchema,
      name: z.string().min(1),
      order: z.number().int().nonnegative(),
      role: CreditRoleSchema,
      details: z.string().nullish(),
      artist: z.object({
        id: zCuidSchema,
        name: z.string().min(1),
      }),
    })
  ),
  genres: z
    .object({
      genre: z.object({
        name: z.string().min(1),
        color: z.string().min(1),
        id: zCuidSchema,
      }),
    })
    .array(),
});

export const AlbumGridItemSchema = AlbumBaseSchema.pick({
  id: true,
  title: true,
  imageId: true,
  releaseDate: true,
  albumType: true,
});

export type AlbumBase = z.infer<typeof AlbumBaseSchema>;
export type FullAlbum = z.infer<typeof FullAlbumSchema>;
export type AlbumGridItem = z.infer<typeof AlbumGridItemSchema>;
