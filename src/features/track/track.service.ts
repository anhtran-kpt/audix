import db from "@/server/db";

export const trackSelect = {
  id: true,
  title: true,
  slug: true,
  audioId: true,
  duration: true,
  trackNumber: true,
  isExplicit: true,
  playCount: true,
  createdAt: true,
  album: {
    select: {
      artistId: true,
      id: true,
      imageId: true,
      title: true,
      artist: {
        select: {
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
      artistId: true,
      role: true,
      order: true,
      artist: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  credits: {
    select: {
      id: true,
      artistId: true,
      name: true,
      order: true,
      role: true,
      details: true,
      artist: {
        select: { name: true },
      },
    },
  },
} as const;

export async function getTrackById(trackId: string) {
  return db.track.findUniqueOrThrow({
    where: { id: trackId },
    select: trackSelect,
  });
}
