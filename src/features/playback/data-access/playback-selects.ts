import { Prisma } from "@/app/generated/prisma";

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
  version: true,
  snapshot: {
    select: {
      type: true,
      contextId: true,
      name: true,
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
