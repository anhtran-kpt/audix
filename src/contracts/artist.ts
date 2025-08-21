import z from "zod";
import { zCuid, zPublicId, zTimeStamps } from "./common";
import { ArtistRoleSchema, CreditRoleSchema } from "./enums";

export const ArtistBaseSchema = z.object({
  id: zCuid,
  name: z.string().min(1),
  bio: z.string().nullish(),
  imageId: zPublicId,
  bannerId: zPublicId,
  isVerified: z.boolean().optional(),
  monthlyListeners: z.number().int().nonnegative(),
  ...zTimeStamps,
});

export const FullArtistSchema = ArtistBaseSchema.extend({
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
  artists: z.array(
    z.object({
      role: ArtistRoleSchema,
      order: z.number().int().nonnegative(),
      artist: z.object({ id: zCuid, name: z.string().min(1) }),
    })
  ),
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
});

export type ArtistBase = z.infer<typeof ArtistBaseSchema>;
export type FullArtist = z.infer<typeof FullArtistSchema>;
