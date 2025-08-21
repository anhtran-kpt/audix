import "server-only";
import db from "@/lib/db";
import { trackDetailSelect } from "./presets";
import { RecordPlay } from "./contracts";
import { AppError } from "@/lib/errors";

export const getTrackOrThrow = async (trackId: string) => {
  const track = await db.track.findUnique({
    where: {
      id: trackId,
    },
    select: trackDetailSelect,
  });

  if (!track) throw new AppError("NOT_FOUND", "Track not found");

  return track;
};

export const getTrackListByIds = async (trackIds: string[]) => {
  const rows = await db.track.findMany({
    where: { id: { in: trackIds } },
    select: trackDetailSelect,
  });

  const byId = new Map(rows.map((t) => [t.id, t]));

  return trackIds
    .map((id) => byId.get(id))
    .filter((x): x is (typeof rows)[number] => !!x);
};

export const getRecentTracks = async (userId: string) => {
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
    select: trackDetailSelect,
  });

  const lastMap = new Map(rows.map((r) => [r.trackId, r._max.playedAt!]));
  return tracks.sort((a, b) => +lastMap.get(b.id)! - +lastMap.get(a.id)!);
};

export const recordPlay = async ({
  userId,
  trackId,
  listenedSec,
  playedAt,
  playbackContextType,
  playbackContextId,
}: RecordPlay) => {
  return db.$transaction(async (tx) => {
    const res = await tx.playHistory.create({
      data: {
        userId,
        trackId,
        listenedSec: Math.max(0, Math.floor(listenedSec)),
        playedAt,
        playbackContextType,
        playbackContextId,
      },
    });

    if (listenedSec >= 30) {
      await tx.track.update({
        where: { id: trackId },
        data: { playCount: { increment: 1 } },
      });
    }

    return res;
  });
};
