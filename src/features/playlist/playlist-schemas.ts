import { PlaylistSchema } from "@/app/generated/zod";
import { MiniUserSchema } from "@/features/user/user-schemas";
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

export const AddTrackToPlaylistInputSchema = z.object({
  trackId: z.cuid2(),
});

export const RemoveTrackFromPlaylistSchema = z.object({
  playlistId: z.cuid2(),
  trackId: z.cuid2(),
});

export const UpdatePlaylistInputSchema = CreatePlaylistInputSchema.partial();
export const UpdatePlaylistOutputSchema = CreatePlaylistInputSchema.partial();

export const PlaylistItemSchema = PlaylistSchema.pick({
  id: true,
  title: true,
  imageId: true,
}).extend({
  user: MiniUserSchema.nullable(),
});

export const PlaylistParamsSchema = z.object({
  playlistId: z.cuid2(),
});
