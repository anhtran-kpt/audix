import { Prisma } from "@/app/generated/prisma";

export const trackItemSelect = {
  id: true,
  title: true,
  audioId: true,
  duration: true,
  trackNumber: true,
  isExplicit: true,
  playCount: true,
  album: {
    select: {
      id: true,
      imageId: true,
      title: true,
    },
  },
  artists: {
    select: {
      artist: { select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  },
} satisfies Prisma.TrackSelect;

export const fullTrackItemSelect = {
  id: true,
  title: true,
  audioId: true,
  duration: true,
  trackNumber: true,
  isExplicit: true,
  playCount: true,
  album: {
    select: {
      id: true,
      imageId: true,
      title: true,
      artist: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  artists: {
    select: {
      artist: { select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  },
} satisfies Prisma.TrackSelect;
