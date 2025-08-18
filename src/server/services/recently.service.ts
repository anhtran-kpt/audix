import db from "../db";
import {
  RecentlyTracksInput,
  RecentlyTracksOutput,
} from "../contracts/recently.contract";

export async function getRecentlyPlayedTracks(userId: string, raw: unknown) {
  const { limit } = RecentlyTracksInput.parse(raw); // validate 1 lần ở service (dùng lại được từ RSC)
  const rows = await db.playHistory.groupBy({
    by: ["trackId"],
    where: { userId },
    _max: { playedAt: true },
    orderBy: { _max: { playedAt: "desc" } },
    take: limit,
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
  const dto = tracks
    .sort((a, b) => +lastMap.get(b.id)! - +lastMap.get(a.id)!)
    .map((t) => ({
      id: t.id,
      title: t.title,
      duration: t.duration,
      lastPlayedAt: lastMap.get(t.id)!.toISOString(),
      album: t.album,
      artists: t.artists.map((x) => x.artist),
    }));

  // Đảm bảo output đúng contract ở thời điểm chạy
  return RecentlyTracksOutput.parse(dto);
}
