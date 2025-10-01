import {
  PlaybackContextTypeSchema,
  QueueItemKindSchema,
  RepeatModeSchema,
} from "@/features/shared/contracts/shared-enum";
import {
  zBoolSchema,
  zCuidSchema,
  zDateSchema,
  zIntSchema,
  zStringSchema,
} from "@/features/shared/contracts/shared-schema";
import { FullTrackSchema } from "@/features/track/contracts/track-schema";
import z from "zod";

export const BasePlaybackSessionSchema = z.object({
  id: zCuidSchema,
  isShuffled: zBoolSchema,
  repeatMode: RepeatModeSchema,
  currentTrackId: zCuidSchema,
  contextIndex: zIntSchema,
  activeDeviceId: zStringSchema.nullish(),
  version: z.bigint(),
});

export const FullPlaybackQueueItemSchema = z.object({
  id: zCuidSchema,
  sessionId: zCuidSchema,
  session: BasePlaybackSessionSchema,
  kind: QueueItemKindSchema,
  position: zIntSchema,
  trackId: zCuidSchema,
  track: FullTrackSchema,
  addedAt: zDateSchema,
});

export const FullPlaybackSessionSchema = BasePlaybackSessionSchema.extend({
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
  queue: FullPlaybackQueueItemSchema.array(),
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
