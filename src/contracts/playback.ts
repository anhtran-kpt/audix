import z, { array } from "zod";
import { PlaybackContextTypeSchema, RepeatModeSchema } from "./enums";
import { zCuid } from "./common";

export const TrackRefSchema = z.object({
  id: zCuid,
  audioId: z.string().min(1),
});

export type TrackRef = z.infer<typeof TrackRefSchema>;

export const SnapshotInputSchema = z.object({
  type: PlaybackContextTypeSchema,
  contextId: zCuid.optional(),
  clickedTrackId: z.string().optional(),
  name: z.string().optional(),
});

export const SnapshotOutputSchema = z.object({
  type: PlaybackContextTypeSchema,
  contextId: zCuid.optional(),
  name: z.string().optional(),
  snapshotId: z.string().min(1),
  trackRefs: TrackRefSchema.array(),
  startIndex: z.number().int().nonnegative(),
  version: z.number().int().nonnegative(),
});

export const PlaybackSessionInputSchema = z.object({
  version: z.number().int().nonnegative().optional(),
  snapshotId: z.string().optional(),
  contextIndex: z.number().int().nonnegative(),
  isShuffled: z.boolean(),
  repeatMode: RepeatModeSchema,
});

export const HistoryEventSchema = z.object({
  trackId: zCuid,
  listenedSec: z
    .number()
    .int()
    .min(0)
    .max(24 * 60 * 60),
  playedAt: z.iso.datetime().optional(),
});

export const RecordPlayInputSchema = z.object({
  events: HistoryEventSchema.array(),
});

export type RecordPlayInput = z.infer<typeof RecordPlayInputSchema>;
export type PlaybackSessionInput = z.infer<typeof PlaybackSessionInputSchema>;
export type SnapshotInput = z.infer<typeof SnapshotInputSchema>;
export type SnapshotOutput = z.infer<typeof SnapshotOutputSchema>;
export type HistoryEvent = z.infer<typeof HistoryEventSchema>;
