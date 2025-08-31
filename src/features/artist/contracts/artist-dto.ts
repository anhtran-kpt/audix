import z from "zod";
import {
  zCuid,
  zPublicId,
  zTimeStamps,
} from "@/features/shared/contracts/shared-dto";
import { CreditRoleSchema } from "@/features/shared/contracts/shared-enum";

export const ArtistBaseSchema = z.object({
  id: zCuid,
  name: z.string().min(1),
  bio: z.string().nullish(),
  imageId: zPublicId,
  bannerId: zPublicId,
  isVerified: z.boolean().optional(),
  followersCount: z.number().int().nonnegative(),
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
  genres: z
    .object({
      id: zCuid,
      name: z.string().min(1),
      color: z.string().min(1),
    })
    .array(),
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

export const SidebarArtistSchema = ArtistBaseSchema.pick({
  id: true,
  name: true,
  imageId: true,
});

export const FollowStatusSchema = ArtistBaseSchema.pick({
  followersCount: true,
}).extend({
  isFollowing: z.boolean(),
});

export type SidebarArtist = z.infer<typeof SidebarArtistSchema>;
export type ArtistBase = z.infer<typeof ArtistBaseSchema>;
export type FullArtist = z.infer<typeof FullArtistSchema>;
export type FollowStatus = z.infer<typeof FollowStatusSchema>;
