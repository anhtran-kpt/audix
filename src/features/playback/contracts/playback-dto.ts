import {
  zBoolSchema,
  zCuidSchema,
  zDateSchema,
} from "@/features/shared/contracts/shared-dto";
import {
  PlaybackContextTypeSchema,
  RepeatModeSchema,
} from "@/features/shared/contracts/shared-enum";
import z from "zod";

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

export const PlaybackSessionSchema = z.object({
  isPlaying: zBoolSchema,
  progressMs: z.number().int().min(0),
  lastPositionUpdatedAt: zDateSchema.nullable(),
  isShuffled: zBoolSchema,
  repeatMode: RepeatModeSchema,
  volume: z.number().int().min(0).max(100),
  isMuted: zBoolSchema,
  currentTrackId: zCuidSchema,
  currentTrack: z.object({
    id: zCuidSchema,
    audioId: z.string().min(1),
  }),
  id: zCuidSchema,
  snapshot: z.object({
    contextType: PlaybackContextTypeSchema,
    contextId: z.string(),
    name: z.string().nullable(),
  }),
});

export type PlaybackSession = z.infer<typeof PlaybackSessionSchema>;

export const ShufflePlaybackInputSchema = z.object({
  isShuffled: zBoolSchema,
});

export type ShufflePlaybackInput = z.infer<typeof ShufflePlaybackInputSchema>;

export const RepeatPlaybackInputSchema = z.object({
  repeatMode: RepeatModeSchema,
});

export type RepeatPlaybackInput = z.infer<typeof RepeatPlaybackInputSchema>;
