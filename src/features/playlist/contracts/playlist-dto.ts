import z from "zod";
import {
  zBoolSchema,
  zCuidSchema,
  zDateSchema,
  zPublicIdSchema,
  zTimeStamps,
} from "@/features/shared/contracts/shared-dto";

export const PlaylistItemSchema = z.object({
  id: zCuidSchema,
  position: z.number().int().nonnegative(),
  addedAt: zDateSchema.optional(),
  trackId: zCuidSchema,
  playlistId: zCuidSchema,
});

export const PlaylistBaseSchema = z.object({
  id: zCuidSchema,
  title: z.string().min(1),
  description: z.string().nullable(),
  imageId: zPublicIdSchema.nullable(),
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
      id: zCuidSchema,
      image: z.url().nullable(),
    })
    .nullable(),
  tracks: PlaylistItemSchema.array(),
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
      id: zCuidSchema,
    })
    .nullable(),
});

export const AddTrackToPlaylistInputSchema = z.object({
  trackId: zCuidSchema,
  position: z.number().int().nonnegative(),
});

export const AddTrackToPlaylistOutputSchema = z.object({
  trackId: zCuidSchema,
  position: z.number().int().nonnegative(),
});

export type AddTrackToPlaylistInput = z.infer<
  typeof AddTrackToPlaylistInputSchema
>;

export type AddTrackToPlaylistOutput = z.infer<
  typeof AddTrackToPlaylistOutputSchema
>;

export const PlaylistDetailSchema = PlaylistBaseSchema.extend({
  tracks: z
    .object({
      id: zCuidSchema,
      title: z.string(),
      duration: z.number().int().nonnegative(),
      isExplicit: zBoolSchema,
      playCount: z.number().int().nonnegative(),
      album: z.object({
        imageId: zCuidSchema,
      }),
      artists: z
        .object({
          artist: z.object({
            id: zCuidSchema,
            name: z.string(),
          }),
        })
        .array(),
    })
    .array(),
  user: z
    .object({
      name: z.string().min(1).nullable(),
      id: zCuidSchema,
      image: z.url().nullable(),
    })
    .nullable(),
});

export type PlaylistDetail = z.infer<typeof PlaylistDetailSchema>;

export type SidebarPlaylist = z.infer<typeof SidebarPlaylistSchema>;
export type CreatePlaylistInput = z.infer<typeof CreatePlaylistInputSchema>;
export type CreatePlaylistOutput = z.infer<typeof CreatePlaylistOutputSchema>;
export type PlaylistBase = z.infer<typeof PlaylistBaseSchema>;
export type FullPlaylist = z.infer<typeof FullPlaylistSchema>;
