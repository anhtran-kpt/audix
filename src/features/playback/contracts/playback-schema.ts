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
    contextType: PlaybackContextTypeSchema,
    contextId: z.string().optional(),
    name: z.string(),
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
  version: z.number().int().nonnegative(),
});

export const PlaybackSessionExtendedSchema = PlaybackSessionSchema.extend({
  currentTrack: FullTrackSchema,
  hasNext: zBoolSchema,
  hasPrevious: zBoolSchema,
});

export const VolumePlaybackInputSchema = z.object({
  volume: z.number(),
});

export const StartPlaybackInputSchema = z.object({
  contextType: PlaybackContextTypeSchema,
  contextId: z.string().optional(),
  startTrackId: zCuidSchema.optional(),
});

export const NextPlaybackOutputSchema = PlaybackSessionExtendedSchema.pick({
  currentTrackId: true,
  contextIndex: true,
  currentTrack: true,
  hasNext: true,
  hasPrevious: true,
});

export const PreviousPlaybackInputSchema = z.object({
  positionMs: z.number().nonnegative(),
});

export const PreviousPlaybackOutputSchema = PlaybackSessionExtendedSchema.pick({
  currentTrackId: true,
  contextIndex: true,
  currentTrack: true,
  hasNext: true,
  hasPrevious: true,
});

export const ShufflePlaybackInputSchema = PlaybackSessionSchema.pick({
  isShuffled: true,
});

export const ShufflePlaybackOutputSchema = PlaybackSessionSchema.pick({
  isShuffled: true,
});

export const RepeatPlaybackInputSchema = PlaybackSessionSchema.pick({
  repeatMode: true,
});

export const RepeatPlaybackOutputSchema = PlaybackSessionSchema.pick({
  repeatMode: true,
});
