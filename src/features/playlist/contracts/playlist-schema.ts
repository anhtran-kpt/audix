import { PlaylistSchema } from "@/app/generated/zod";
import { MiniUserSchema } from "@/features/user/data-access/user-schema";
import z from "zod";

export const CreatePlaylistInputSchema = PlaylistSchema.pick({
  title: true,
  isPublic: true,
  description: true,
});

export const CreatePlaylistOutputSchema = PlaylistSchema.pick({
  id: true,
  title: true,
  imageId: true,
}).extend({
  user: MiniUserSchema.nullable(),
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

export const UserPlaylistSchema = FullPlaylistSchema.pick({
  id: true,
  title: true,
}).extend({
  hasTrack: zBoolSchema,
});

export const UpdatePlaylistInputSchema = CreatePlaylistInputSchema.partial();
export const UpdatePlaylistOutputSchema = CreatePlaylistInputSchema.partial();

export const PlaylistItemSchema = PlaylistSchema.pick({
  id: true,
  title: true,
  imageId: true,
}).extend({
  user: MiniUserSchema,
});
