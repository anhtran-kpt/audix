import {
  PlaybackContextSnapshotSchema,
  PlaybackQueueItemSchema,
  PlaybackSessionSchema,
} from "@/app/generated/zod";
import z from "zod";

export const MiniPlaybackContextSnapshotSchema =
  PlaybackContextSnapshotSchema.pick({
    contextType: true,
    contextId: true,
  });

export const ClientPlaybackSessionSchema = PlaybackSessionSchema.pick({
  id: true,
  isShuffled: true,
  repeatMode: true,
  currentTrack: true,
  currentTrackId: true,
  contextIndex: true,
  queue: true,
}).extend({
  snapshot: MiniPlaybackContextSnapshotSchema,
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  queue: z.object({
    next: PlaybackQueueItemSchema.pick({
      id: true,
    }).array(),
    context: PlaybackQueueItemSchema.pick({
      id: true,
    }).array(),
    later: PlaybackQueueItemSchema.pick({
      id: true,
    }).array(),
  }),
});

export const StartPlaybackInputSchema = PlaybackContextSnapshotSchema.pick({
  contextType: true,
  contextId: true,
}).extend({
  startTrackId: z.cuid2().optional(),
});

export const VolumePlaybackInputSchema = z.object({
  volume: z.number(),
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
