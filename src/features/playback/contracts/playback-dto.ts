import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import {
  PlaybackContextTypeSchema,
  RepeatModeSchema,
} from "@/features/shared/contracts/shared-enum";
import z from "zod";

export const TrackRefSchema = z.object({
  id: zCuidSchema,
  audioId: z.string().min(1),
});

export type TrackRef = z.infer<typeof TrackRefSchema>;

export const SnapshotInputSchema = z.object({
  type: PlaybackContextTypeSchema,
  contextId: zCuidSchema.optional(),
  clickedTrackId: z.string().optional(),
  name: z.string().optional(),
});

export const SnapshotOutputSchema = z.object({
  type: PlaybackContextTypeSchema,
  contextId: zCuidSchema.optional(),
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
  trackId: zCuidSchema,
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

export const ContextFromHistoryOutputSchema = z.object({
  found: z.boolean(),
  type: PlaybackContextTypeSchema,
  contextId: zCuidSchema.optional(),
  snapshotId: z.string().min(1).optional(),
  name: z.string().optional(),
  trackRefs: TrackRefSchema.array().optional(),
  startIndex: z.number().int().nonnegative(),
});

export type RecordPlayInput = z.infer<typeof RecordPlayInputSchema>;
export type PlaybackSessionInput = z.infer<typeof PlaybackSessionInputSchema>;
export type SnapshotInput = z.infer<typeof SnapshotInputSchema>;
export type SnapshotOutput = z.infer<typeof SnapshotOutputSchema>;
export type HistoryEvent = z.infer<typeof HistoryEventSchema>;
export type ContextFromHistoryOutput = z.infer<
  typeof ContextFromHistoryOutputSchema
>;

export const StartPlaybackInputSchema = z.object({
  contextType: PlaybackContextTypeSchema,
  contextIdOrQuery: z.string().nullable(),
  startTrackId: z.cuid2().optional(),
});

export type StartPlaybackInput = z.infer<typeof StartPlaybackInputSchema>;

export const SeekPlaybackInputSchema = z.object({
  positionMs: z.number().int().min(0),
});

export type SeekPlaybackInput = z.infer<typeof SeekPlaybackInputSchema>;
