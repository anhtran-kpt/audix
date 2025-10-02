import z from "zod";
import {
  CreatePlaylistInputSchema,
  CreatePlaylistOutputSchema,
  PlaylistItemSchema,
  UpdatePlaylistInputSchema,
  UpdatePlaylistOutputSchema,
} from "./playlist-schema";

export type PlaylistItem = z.infer<typeof PlaylistItemSchema>;
export type UpdatePlaylistInput = z.infer<typeof UpdatePlaylistInputSchema>;
export type UpdatePlaylistOutput = z.infer<typeof UpdatePlaylistOutputSchema>;
export type CreatePlaylistInput = z.infer<typeof CreatePlaylistInputSchema>;
export type CreatePlaylistOutput = z.infer<typeof CreatePlaylistOutputSchema>;
