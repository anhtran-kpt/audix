import "server-only";
import db from "@/server/db";
import { trackDetailSelect } from "./selects";

export const findTrackById = async (trackId: string) => {
  return await db.track.findUnique({
    where: {
      id: trackId,
    },
    select: trackDetailSelect,
  });
};

export const listTracksByIds = async (trackIds: string[]) => {
  const rows = await db.track.findMany({
    where: { id: { in: trackIds } },
    select: trackDetailSelect,
  });

  const byId = new Map(rows.map((t) => [t.id, t]));

  return trackIds
    .map((id) => byId.get(id))
    .filter((x): x is (typeof rows)[number] => !!x);
};

export const listRecentTracks = async (userId: string) => {
  const rows = await db.playHistory.groupBy({
    by: ["trackId"],
    where: { userId },
    _max: { playedAt: true },
    orderBy: { _max: { playedAt: "desc" } },
    take: 20,
  });

  const ids = rows.map((r) => r.trackId);
  if (ids.length === 0) return [];

  const tracks = await db.track.findMany({
    where: { id: { in: ids } },
    include: {
      album: { select: { id: true, title: true, imageId: true } },
      artists: {
        where: { role: "MAIN_ARTIST" },
        orderBy: { order: "asc" },
        select: { artist: { select: { id: true, name: true, imageId: true } } },
      },
    },
  });

  const lastMap = new Map(rows.map((r) => [r.trackId, r._max.playedAt!]));
  return tracks
    .sort((a, b) => +lastMap.get(b.id)! - +lastMap.get(a.id)!)
    .map((t) => ({
      id: t.id,
      title: t.title,
      duration: t.duration,
      lastPlayedAt: lastMap.get(t.id)!.toISOString(),
      album: t.album,
      artists: t.artists.map((x) => x.artist),
    }));
};
