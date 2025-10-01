import z from "zod";
import {
  CreatePlaylistInputSchema,
  CreatePlaylistOutputSchema,
  FullPlaylistSchema,
  PlaylistBaseSchema,
  PlaylistDetailSchema,
  PlaylistItemSchema,
  SidebarPlaylistSchema,
  UpdatePlaylistInputSchema,
  UpdatePlaylistOutputSchema,
  UserPlaylistSchema,
} from "./playlist-schema";

export type PlaylistItem = z.infer<typeof PlaylistItemSchema>;
export type UpdatePlaylistInput = z.infer<typeof UpdatePlaylistInputSchema>;
export type UpdatePlaylistOutput = z.infer<typeof UpdatePlaylistOutputSchema>;
export type UserPlaylist = z.infer<typeof UserPlaylistSchema>;
export type PlaylistDetail = z.infer<typeof PlaylistDetailSchema>;
export type SidebarPlaylist = z.infer<typeof SidebarPlaylistSchema>;
export type CreatePlaylistInput = z.infer<typeof CreatePlaylistInputSchema>;
export type CreatePlaylistOutput = z.infer<typeof CreatePlaylistOutputSchema>;
export type PlaylistBase = z.infer<typeof PlaylistBaseSchema>;
export type FullPlaylist = z.infer<typeof FullPlaylistSchema>;
