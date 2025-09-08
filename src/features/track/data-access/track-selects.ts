import { Prisma } from "@/app/generated/prisma";

export const trackDetailSelect = {
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
          bannerId: true,
          bio: true,
        },
      },
      _count: {
        select: {
          likedBy: true,
        },
      },
    },
  },
  artists: {
    select: {
      role: true,
      order: true,
      artist: { select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  },
  credits: {
    select: {
      id: true,
      name: true,
      order: true,
      role: true,
      details: true,
      artist: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  },
} satisfies Prisma.TrackSelect;

export type TrackDetail = Prisma.TrackGetPayload<{
  select: typeof trackDetailSelect;
}>;

export const trackItemSelect = {
  id: true,
  title: true,
  isExplicit: true,
  album: {
    select: {
      imageId: true,
    },
  },
  artists: {
    select: {
      artist: { select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  },
  credits: {
    select: {
      id: true,
      name: true,
      order: true,
      role: true,
      details: true,
      artist: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  },
} satisfies Prisma.TrackSelect;

export type TrackItem = Prisma.TrackGetPayload<{
  select: typeof trackItemSelect;
}>;

export const recommendedTrackItemSelect = {
  id: true,
  title: true,
  isExplicit: true,
  album: {
    select: {
      id: true,
      title: true,
      imageId: true,
    },
  },
  artists: {
    select: {
      artist: { select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  },
} satisfies Prisma.TrackSelect;
