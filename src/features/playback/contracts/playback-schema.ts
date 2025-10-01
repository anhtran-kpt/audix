import {
  zBoolSchema,
  zCuidSchema,
  zDateSchema,
} from "@/features/shared/contracts/shared-dto";
import {
  PlaybackContextTypeSchema,
  QueueItemKindSchema,
  RepeatModeSchema,
} from "@/features/shared/contracts/shared-enum";
import { FullTrackSchema } from "@/features/track/contracts/track-schema";
import z from "zod";

export const FullPlaybackSessionSchema = z.object({
  id: zCuidSchema,
  isShuffled: zBoolSchema,
  repeatMode: RepeatModeSchema,
  currentTrackId: zCuidSchema,
  currentTrack: FullTrackSchema,
  snapshot: z.object({
    contextType: PlaybackContextTypeSchema,
    contextId: z.string(),
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
      position: z.number().int().nonnegative(),
    })
    .array(),
  activeDeviceId: z.string().nullable(),
  version: z.bigint(),
});

export const FullPlaybackQueueItemSchema = z.object({
  id: zCuidSchema,
  sessionId: zCuidSchema,
  session: FullPlaybackSessionSchema,
  kind: QueueItemKindSchema,
  position: z.number().int().nonnegative(),
  trackId: zCuidSchema,
  track: FullTrackSchema,
  addedAt: zDateSchema,
});

export const PlaybackSessionSchema = FullPlaybackSessionSchema.pick({
  id: true,
  isShuffled: true,
  repeatMode: true,
  currentTrack: true,
  currentTrackId: true,
  snapshot: true,
  contextIndex: true,
  queue: true,
});

export const ClientPlaybackSessionSchema = PlaybackSessionSchema.extend({
  hasNext: zBoolSchema,
  hasPrevious: zBoolSchema,
  queue: z.object({
    next: FullPlaybackQueueItemSchema.pick({
      id: true,
    }).array(),
    context: FullPlaybackQueueItemSchema.pick({
      id: true,
    }).array(),
    later: FullPlaybackQueueItemSchema.pick({
      id: true,
    }).array(),
  }),
});

export const VolumePlaybackInputSchema = z.object({
  volume: z.number(),
});

export const StartPlaybackInputSchema = z.object({
  contextType: PlaybackContextTypeSchema,
  contextId: z.string(),
  startTrackId: zCuidSchema.optional(),
});

export const NextPlaybackOutputSchema = ClientPlaybackSessionSchema.pick({
  currentTrackId: true,
  contextIndex: true,
  currentTrack: true,
  hasNext: true,
  hasPrevious: true,
});

export const PreviousPlaybackInputSchema = z.object({
  positionMs: z.number().nonnegative(),
});

export const PreviousPlaybackOutputSchema = ClientPlaybackSessionSchema.pick({
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
