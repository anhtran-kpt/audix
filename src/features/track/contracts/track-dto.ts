import z from "zod";
import {
  FullTrackSchema,
  MiniTrackItemSchema,
  NowPlayingTrackSchema,
  RecommendedTrackItemSchema,
  TrackCreditSchema,
  TrackItemCompactSchema,
  TrackItemDetailedSchema,
  TrackItemSchema,
  TrackListItemSchema,
} from "./track-schema";

export type TrackItemCompact = z.infer<typeof TrackItemCompactSchema>;
export type TrackItemDetailed = z.infer<typeof TrackItemDetailedSchema>;
export type MiniTrackItem = z.infer<typeof MiniTrackItemSchema>;
export type TrackCredit = z.infer<typeof TrackCreditSchema>;
export type RecommendedTrackItem = z.infer<typeof RecommendedTrackItemSchema>;
export type FullTrack = z.infer<typeof FullTrackSchema>;
export type TrackItem = z.infer<typeof TrackItemSchema>;
export type TrackListItem = z.infer<typeof TrackListItemSchema>;
export type NowPlayingTrack = z.infer<typeof NowPlayingTrackSchema>;
