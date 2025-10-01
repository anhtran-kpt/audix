import { PlaylistTrackSchema } from "@/features/shared/contracts/shared-relation";
import {
  zBoolSchema,
  zCuidSchema,
  zDateSchema,
  zIntSchema,
  zPublicIdSchema,
  zStringSchema,
  zTimeStamps,
} from "@/features/shared/contracts/shared-schema";
import { BaseUserSchema } from "@/features/user/data-access/user-schema";
import z from "zod";

export const BasePlaylistSchema = z.object({
  id: zCuidSchema,
  title: zStringSchema,
  description: zStringSchema.nullish(),
  imageId: zPublicIdSchema.nullish(),
  isPublic: zBoolSchema,
  isOfficial: zBoolSchema,
  totalTracks: zIntSchema,
  duration: zIntSchema,
  ...zTimeStamps,
});

export const FullPlaylistSchema = BasePlaylistSchema.extend({
  user: z.lazy(() => BaseUserSchema.nullish()),
  tracks: z.lazy(() => PlaylistTrackSchema.array()),
});

export const CreatePlaylistInputSchema = FullPlaylistSchema.pick({
  title: true,
  isPublic: true,
  description: true,
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
      name: zStringSchema.nullish(),
      id: zCuidSchema,
    })
    .nullish(),
});

export const AddTrackToPlaylistInputSchema = z.object({
  trackId: zCuidSchema,
});

export const RemoveTrackFromPlaylistSchema = z.object({
  playlistId: zCuidSchema,
  trackId: zCuidSchema,
});

export type AddTrackToPlaylistInput = z.infer<
  typeof AddTrackToPlaylistInputSchema
>;

export type RemoveTrackFromPlaylistInput = z.infer<
  typeof RemoveTrackFromPlaylistSchema
>;

export const PlaylistDetailSchema = FullPlaylistSchema.extend({
  tracks: z
    .object({
      id: zCuidSchema,
      title: zStringSchema,
      duration: zIntSchema,
      isExplicit: zBoolSchema.optional(),
      playCount: zIntSchema,
      album: z.object({
        id: zCuidSchema,
        title: zStringSchema,
        imageId: zCuidSchema,
      }),
      artists: z
        .object({
          artist: z.object({
            id: zCuidSchema,
            name: zStringSchema,
          }),
        })
        .array(),
      addedAt: zDateSchema,
    })
    .array(),
  user: z
    .object({
      name: zStringSchema.nullish(),
      id: zCuidSchema,
      image: z.url().nullish(),
    })
    .nullish(),
});

export const UserPlaylistSchema = FullPlaylistSchema.pick({
  id: true,
  title: true,
}).extend({
  hasTrack: zBoolSchema,
});

export const UpdatePlaylistInputSchema = FullPlaylistSchema.pick({
  title: true,
  description: true,
}).partial();

export const UpdatePlaylistOutputSchema = FullPlaylistSchema.pick({
  title: true,
  description: true,
});

export const PlaylistItemSchema = FullPlaylistSchema.pick({
  id: true,
  title: true,
  imageId: true,
  user: true,
});
