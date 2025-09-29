import z from "zod";
import {
  ArtistBaseSchema,
  ArtistGridItemSchema,
  FollowStatusSchema,
  FullArtistSchema,
  SidebarArtistSchema,
  TrackArtistSchema,
} from "./artist-schema";

export type ArtistGridItem = z.infer<typeof ArtistGridItemSchema>;
export type SidebarArtist = z.infer<typeof SidebarArtistSchema>;
export type ArtistBase = z.infer<typeof ArtistBaseSchema>;
export type FullArtist = z.infer<typeof FullArtistSchema>;
export type FollowStatus = z.infer<typeof FollowStatusSchema>;
export type TrackArtist = z.infer<typeof TrackArtistSchema>;
