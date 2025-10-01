import { Prisma } from "@/app/generated/prisma";
import { trackDetailSelect } from "@/features/track/data-access/track-selects";

export const playbackSessionSelect = {
  id: true,
  currentTrackId: true,
  currentTrack: { select: trackDetailSelect },
  contextIndex: true,
  isShuffled: true,
  repeatMode: true,
  queue: {
    select: {
      track: {
        select: {
          id: true,
        },
      },
      kind: true,
      position: true,
    },
    orderBy: [{ kind: "asc" }, { position: "asc" }],
  },
  snapshot: {
    select: {
      contextType: true,
      contextId: true,
      name: true,
      tracks: {
        select: {
          track: {
            select: {
              id: true,
            },
          },
          index: true,
          trackId: true,
        },
        orderBy: { index: "asc" },
      },
    },
  },
} satisfies Prisma.PlaybackSessionSelect;
