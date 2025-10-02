import { Prisma } from "@/app/generated/prisma";
import { trackItemSelect } from "@/features/track/data-access/track-select";

export const playbackSessionSelect = {
  id: true,
  currentTrackId: true,
  currentTrack: { select: trackItemSelect },
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
