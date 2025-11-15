import z from "zod";
import {
  AddTrackToPlaylistInputSchema,
  CreatePlaylistInputSchema,
  CreatePlaylistOutputSchema,
  PlaylistItemSchema,
  RemoveTrackFromPlaylistSchema,
  UpdatePlaylistInputSchema,
  UpdatePlaylistOutputSchema,
} from "./playlist-schemas";
import { AwaitedReturnType } from "@/utils/type";
import {
  getPlaylistOverview,
  getPlaylistTracks,
  getRecommendedTracks,
} from "./playlist-data";

export type PlaylistItem = z.infer<typeof PlaylistItemSchema>;
export type UpdatePlaylistInput = z.infer<typeof UpdatePlaylistInputSchema>;
export type UpdatePlaylistOutput = z.infer<typeof UpdatePlaylistOutputSchema>;
export type CreatePlaylistInput = z.infer<typeof CreatePlaylistInputSchema>;
export type CreatePlaylistOutput = z.infer<typeof CreatePlaylistOutputSchema>;
export type PlaylistRole = "OWNER" | "VIEWER" | "NONE";

export type PlaylistPermission = {
  playlist: {
    id: string;
    title: string;
    isPublic: boolean;
    userId: string | null;
  } | null;
  role: PlaylistRole;
  canView: boolean;
  canEdit: boolean;
};

export type AddTrackToPlaylistInput = z.infer<
  typeof AddTrackToPlaylistInputSchema
>;

export type RemoveTrackFromPlaylistInput = z.infer<
  typeof RemoveTrackFromPlaylistSchema
>;

export type PlaylistOverview = AwaitedReturnType<typeof getPlaylistOverview>;
export type PlaylistTracks = AwaitedReturnType<typeof getPlaylistTracks>;
export type RecommendedTracks = Awaited<
  ReturnType<typeof getRecommendedTracks>
>;
