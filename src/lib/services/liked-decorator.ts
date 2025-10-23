import db from "@/lib/db";

export async function attachIsLikedToTracks<T extends { id: string }>(
  userId: string | undefined,
  tracks: T[]
): Promise<(T & { isLiked: boolean })[]> {
  if (!userId || tracks.length === 0) {
    return tracks.map((t) => ({ ...t, isLiked: false }));
  }

  const likedTracks = await db.playlistTrack.findMany({
    where: {
      playlist: {
        userId,
        systemType: "LIKED_TRACKS",
      },
      trackId: { in: tracks.map((t) => t.id) },
    },
    select: { trackId: true },
  });

  const likedSet = new Set(likedTracks.map((t) => t.trackId));
  return tracks.map((t) => ({
    ...t,
    isLiked: likedSet.has(t.id),
  }));
}
