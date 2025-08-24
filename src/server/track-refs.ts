import { zCuidType } from "@/contracts/common";
import { TrackRef } from "@/contracts/playback";
import db from "@/lib/db";

export const resolveTrackRefsOrdered = async (
  trackIds: zCuidType[]
): Promise<TrackRef[]> => {
  if (trackIds.length === 0) return [];

  const rows = await db.track.findMany({
    where: { id: { in: trackIds } },
    select: { id: true, audioId: true },
  });

  const byId = new Map(rows.map((r) => [r.id, r]));

  return trackIds
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((r: any) => ({ id: r.id, audioId: r.audioId }));
};
