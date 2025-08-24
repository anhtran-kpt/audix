import z from "zod";
import { PlaybackContextTypeSchema, RepeatModeSchema } from "./enums";
import { zCuid } from "./common";

export const TrackRefSchema = z.object({
  id: zCuid,
  audioId: z.string().min(1),
});

export type TrackRef = z.infer<typeof TrackRefSchema>;

export const SnapshotInputSchema = z.object({
  type: PlaybackContextTypeSchema,
  contextId: z.string().optional(),
  clickedTrackId: z.string().optional(),
  name: z.string().optional(),
});

export const SnapshotOutputSchema = z.object({
  snapshotId: z.string().min(1),
  name: z.string().optional(),
  refs: TrackRefSchema.array(),
});

export const PlaybackSessionInputSchema = z.object({
  version: z.number().int().nonnegative().optional(),
  snapshotId: z.string().optional(),
  contextIndex: z.number().int().nonnegative(),
  isShuffled: z.boolean(),
  repeatMode: RepeatModeSchema,
});

export type PlaybackSessionInput = z.infer<typeof PlaybackSessionInputSchema>;
export type SnapshotInput = z.infer<typeof SnapshotInputSchema>;
export type SnapshotOutput = z.infer<typeof SnapshotOutputSchema>;
