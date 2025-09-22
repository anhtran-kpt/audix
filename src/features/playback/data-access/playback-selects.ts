import { Prisma } from "@/app/generated/prisma";
import { trackDetailSelect } from "@/features/track/data-access/track-selects";

export const playbackSessionSelect = {
  id: true,
  snapshotId: true,
  contextIndex: true,
  currentTrackId: true,
  progressMs: true,
  isPlaying: true,
  lastPositionUpdatedAt: true,
  isShuffled: true,
  repeatMode: true,
  volume: true,
  isMuted: true,
  activeDeviceId: true,
  // version: true,
  queue: {
    select: {
      track: {
        select: trackDetailSelect,
      },
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
              title: true,
            },
          },
        },
        orderBy: { index: "asc" },
      },
    },
  },

  // snapshot: {
  //         tracks: {
  //             trackId: string;
  //             snapshotId: string;
  //             index: number;
  //         }[];
  //     } & {
  //         userId: string;
  //         id: string;
  //         type: $Enums.PlaybackContextType;
  //         contextId: string | null;
  //         name: string | null;
  //         hash: string;
  //         createdAt: Date;
  //     };
  // } & {
  //     userId: string;
  //     id: string;
  //     createdAt: Date;
  //     updatedAt: Date;
  //     snapshotId: string;
  //     contextIndex: number;
  //     currentTrackId: string;
  //     progressMs: number;
  //     isPlaying: boolean;
  //     lastPositionUpdatedAt: Date | null;
  //     isShuffled: boolean;
  //     repeatMode: $Enums.RepeatMode;
  //     volume: number;
  //     isMuted: boolean;
  //     activeDeviceId: string | null;
  //     version: bigint;
} satisfies Prisma.PlaybackSessionSelect;
