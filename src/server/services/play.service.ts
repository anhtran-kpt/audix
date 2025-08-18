"use server";

import { RecordPlayInput } from "../contracts/play.contract";
import db from "../db";

export async function recordPlay({
  userId,
  trackId,
  listenedSec,
  playedAt = new Date(),
  sourceType,
  sourceId,
}: RecordPlayInput) {
  return db.$transaction(async (tx) => {
    const res = await tx.playHistory.create({
      data: {
        userId,
        trackId,
        duration: Math.max(0, Math.floor(listenedSec)),
        playedAt,
        deviceType: "web",
        sourceType,
        sourceId,
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
}
