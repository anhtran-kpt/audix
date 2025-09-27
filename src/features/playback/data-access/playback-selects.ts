import { Prisma } from "@/app/generated/prisma";

export const playbackSessionSelect = {
  id: true,
  contextIndex: true,
  currentTrackId: true,
  isShuffled: true,
  repeatMode: true,
  activeDeviceId: true,
  // version: true,
  queue: {
    select: {
      track: {
        select: {
          id: true,
        },
      },
      kind: true,
    },
  },
  snapshot: {
    select: {
      type: true,
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
