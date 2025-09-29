import {
  zBoolSchema,
  zCuidSchema,
} from "@/features/shared/contracts/shared-dto";
import {
  PlaybackContextTypeSchema,
  QueueItemKindSchema,
  RepeatModeSchema,
} from "@/features/shared/contracts/shared-enum";
import { FullTrackSchema } from "@/features/track/contracts/track-schema";
import z from "zod";

export const PlaybackSessionSchema = z.object({
  id: zCuidSchema,
  isShuffled: zBoolSchema,
  repeatMode: RepeatModeSchema,
  currentTrackId: zCuidSchema,
  snapshot: z.object({
    type: PlaybackContextTypeSchema,
    name: z.string().nullable(),
    contextId: z.string().nullable(),
    tracks: z
      .object({
        track: z.object({
          id: zCuidSchema,
        }),
        index: z.number().int().nonnegative(),
        trackId: zCuidSchema,
      })
      .array(),
  }),
  contextIndex: z.number().int().nonnegative(),
  queue: z
    .object({
      track: z.object({
        id: zCuidSchema,
      }),
      kind: QueueItemKindSchema,
    })
    .array(),
  activeDeviceId: z.string().nullable(),
});

export type PlaybackSession = z.infer<typeof PlaybackSessionSchema>;

export const PlaybackSessionExtendedSchema = PlaybackSessionSchema.extend({
  currentTrack: FullTrackSchema,
  hasNext: zBoolSchema,
  hasPrevious: zBoolSchema,
});

export type PlaybackSessionExtended = z.infer<
  typeof PlaybackSessionExtendedSchema
>;

export const PlaybackContextSnapshotSchema = z.object({
  contextType: PlaybackContextTypeSchema,
  contextIdOrQuery: z.string().nullable(),
  startTrackId: z.cuid2().optional(),
});

export type PlaybackContextSnapshot = z.infer<
  typeof PlaybackContextSnapshotSchema
>;

export const VolumePlaybackInputSchema = z.object({
  volume: z.number(),
});

export type VolumePlaybackInput = z.infer<typeof VolumePlaybackInputSchema>;

export const StartPlaybackInputSchema = z.object({
  contextType: PlaybackContextTypeSchema,
  contextId: z.string(),
  startTrackId: zCuidSchema.optional(),
});

export type StartPlaybackInput = z.infer<typeof StartPlaybackInputSchema>;

export const NextPlaybackOutputSchema = PlaybackSessionExtendedSchema.pick({
  currentTrackId: true,
  contextIndex: true,
  currentTrack: true,
  hasNext: true,
  hasPrevious: true,
});

export type NextPlaybackOutput = z.infer<typeof NextPlaybackOutputSchema>;

export const PreviousPlaybackInputSchema = z.object({
  positionMs: z.number().nonnegative(),
});

export type PreviousPlaybackInput = z.infer<typeof PreviousPlaybackInputSchema>;

export const PreviousPlaybackOutputSchema = PlaybackSessionExtendedSchema.pick({
  currentTrackId: true,
  contextIndex: true,
  currentTrack: true,
  hasNext: true,
  hasPrevious: true,
});

export type PreviousPlaybackOutput = z.infer<
  typeof PreviousPlaybackOutputSchema
>;

export const ShufflePlaybackInputSchema = PlaybackSessionSchema.pick({
  isShuffled: true,
});

export type ShufflePlaybackInput = z.infer<typeof ShufflePlaybackInputSchema>;

export const ShufflePlaybackOutputSchema = PlaybackSessionSchema.pick({
  isShuffled: true,
});

export type ShufflePlaybackOutput = z.infer<typeof ShufflePlaybackOutputSchema>;

export const RepeatPlaybackInputSchema = PlaybackSessionSchema.pick({
  repeatMode: true,
});

export type RepeatPlaybackInput = z.infer<typeof RepeatPlaybackInputSchema>;

export const RepeatPlaybackOutputSchema = PlaybackSessionSchema.pick({
  repeatMode: true,
});

export type RepeatPlaybackOutput = z.infer<typeof RepeatPlaybackOutputSchema>;
