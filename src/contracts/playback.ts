import z from "zod";
import { PlaybackContextTypeSchema } from "./enums";
import { zCuid } from "./common";

export const TrackRefSchema = z.object({
  id: zCuid,
  audioId: z.string().min(1),
});

export type TrackRef = z.infer<typeof TrackRefSchema>;

export const SnapshotInputSchema = z.object({
  type: PlaybackContextTypeSchema,
  contextId: z.string().optional(),
});

export const SnapshotOutputSchema = z.object({
  snapshotId: z.string().min(1),
  name: z.string().optional(),
  refs: TrackRefSchema.array(),
});

export const ResolveHistoryInputSchema = z.object({
  trackId: zCuid,
  sourceType: PlaybackContextTypeSchema,
  sourceId: zCuid.optional(),
  snapshotId: z.string().optional(),
});

export const ResolveHistoryOutputSchema = z.object({
  refs: TrackRefSchema.array(),
  index: z.number().int().nonnegative(),
  meta: z.object({
    type: PlaybackContextTypeSchema,
    contextId: zCuid.optional(),
    name: z.string().optional(),
    snapshotId: z.string().optional(),
  }),
});

export type ResolveHistoryInput = z.infer<typeof ResolveHistoryInputSchema>;
export type ResolveHistoryOutput = z.infer<typeof ResolveHistoryOutputSchema>;
export type SnapshotInput = z.infer<typeof SnapshotInputSchema>;
export type SnapshotOutput = z.infer<typeof SnapshotOutputSchema>;
