import z from "zod";
import {
  FullTrackSchema,
  MiniTrackItemSchema,
  NowPlayingTrackSchema,
  RecommendedTrackItemSchema,
  TrackItemCompactSchema,
  TrackItemDetailedSchema,
  TrackListItemSchema,
} from "./track-schema";

export type TrackItemCompact = z.infer<typeof TrackItemCompactSchema>;
export type TrackItemDetailed = z.infer<typeof TrackItemDetailedSchema>;
export type MiniTrackItem = z.infer<typeof MiniTrackItemSchema>;
export type RecommendedTrackItem = z.infer<typeof RecommendedTrackItemSchema>;
export type FullTrack = z.infer<typeof FullTrackSchema>;
export type TrackListItem = z.infer<typeof TrackListItemSchema>;
export type NowPlayingTrack = z.infer<typeof NowPlayingTrackSchema>;
