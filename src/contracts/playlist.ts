import z from "zod";
import { zCuid, zDate, zPublicId, zTimeStamps } from "./common";
import { ArtistRoleSchema } from "./enums";

export const PlaylistItem = z.object({
  id: zCuid,
  position: z.number().int().nonnegative(),
  addedAt: zDate.optional(),
});

export const PlaylistBaseSchema = z.object({
  id: zCuid,
  title: z.string().min(1),
  description: z.string().optional(),
  imageId: zPublicId,
  isPublic: z.boolean().optional(),
  isOfficial: z.boolean().optional(),
  totalTracks: z.number().int().nonnegative(),
  duration: z.number().int().nonnegative(),
  ...zTimeStamps,
});

export const FullPlaylistSchema = PlaylistBaseSchema.extend({
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
});

export const CreatePlaylistInputSchema = PlaylistBaseSchema.pick({
  title: true,
  description: true,
  isPublic: true,
});

export const CreatePlaylistOutputSchema = PlaylistBaseSchema.pick({
  id: true,
});

export type CreatePlaylistInput = z.infer<typeof CreatePlaylistInputSchema>;
export type CreatePlaylistOutput = z.infer<typeof CreatePlaylistOutputSchema>;
export type PlaylistBase = z.infer<typeof PlaylistBaseSchema>;
export type FullPlaylist = z.infer<typeof FullPlaylistSchema>;
