import z from "zod";
import {
  zCuid,
  zDate,
  zPublicId,
  zTimeStamps,
} from "@/features/shared/contracts/shared-dto";

export const PlaylistItem = z.object({
  id: zCuid,
  position: z.number().int().nonnegative(),
  addedAt: zDate.optional(),
});

export const PlaylistBaseSchema = z.object({
  id: zCuid,
  title: z.string().min(1),
  description: z.string().nullable(),
  imageId: zPublicId.nullable(),
  isPublic: z.boolean().optional(),
  isOfficial: z.boolean().optional(),
  totalTracks: z.number().int().nonnegative(),
  duration: z.number().int().nonnegative(),
  ...zTimeStamps,
});

export const FullPlaylistSchema = PlaylistBaseSchema.extend({
  user: z
    .object({
      name: z.string().min(1).nullable(),
      id: zCuid,
      image: z.url().nullable(),
    })
    .nullable(),
});

export const CreatePlaylistInputSchema = PlaylistBaseSchema.pick({
  title: true,
  isPublic: true,
}).extend({
  description: z.string().optional(),
});

export const CreatePlaylistOutputSchema = FullPlaylistSchema.pick({
  id: true,
  title: true,
  imageId: true,
  user: true,
});

export const SidebarPlaylistSchema = FullPlaylistSchema.pick({
  id: true,
  title: true,
  imageId: true,
}).extend({
  user: z
    .object({
      name: z.string().min(1).nullable(),
      id: zCuid,
    })
    .nullable(),
});

export type SidebarPlaylist = z.infer<typeof SidebarPlaylistSchema>;
export type CreatePlaylistInput = z.infer<typeof CreatePlaylistInputSchema>;
export type CreatePlaylistOutput = z.infer<typeof CreatePlaylistOutputSchema>;
export type PlaylistBase = z.infer<typeof PlaylistBaseSchema>;
export type FullPlaylist = z.infer<typeof FullPlaylistSchema>;
