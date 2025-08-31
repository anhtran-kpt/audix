import "server-only";
import { createHash } from "crypto";
import db from "@/lib/db";
import { PlaybackContextType } from "@/features/shared/contracts/shared-enum";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { TrackRef } from "../contracts/playback-dto";

export async function buildTrackIdsForContext(
  type: PlaybackContextType,
  contextId: string
) {
  switch (type) {
    case "ALBUM": {
      const album = await db.album.findUniqueOrThrow({
        where: { id: contextId },
        select: {
          tracks: { select: { id: true }, orderBy: { trackNumber: "asc" } },
        },
      });
      return album.tracks.map((t) => t.id);
    }
    case "PLAYLIST": {
      const items = await db.playlistItem.findMany({
        where: { playlistId: contextId },
        select: { trackId: true, position: true },
        orderBy: { position: "asc" },
      });
      return items.map((i) => i.trackId);
    }
    case "ARTIST": {
      const items = await db.trackArtist.findMany({
        where: {
          artistId: contextId,
        },
        select: {
          trackId: true,
        },
        orderBy: {
          track: {
            playCount: "desc",
          },
        },
      });

      return items.map((item) => item.trackId);
    }
    case "TRACK": {
      return [contextId];
    }
    case "LIKED": {
      const items = await db.userLikedTrack.findMany({
        where: {
          userId: contextId,
        },
        select: {
          trackId: true,
        },
        orderBy: {
          likedAt: "desc",
        },
      });

      return items.map((item) => item.trackId);
    }
    default: {
      return [contextId];
    }
  }
}

export function computeSnapshotHash(
  type: PlaybackContextType,
  trackIds: zCuidType[],
  contextId?: string | null
) {
  const h = createHash("md5");
  h.update(type);
  h.update("|");
  h.update(contextId ?? "");
  h.update("|");
  h.update(trackIds.join(","));
  return h.digest("hex");
}

export async function createOrReuseSnapshot(params: {
  deviceId: string;
  userId: string | null;
  type: PlaybackContextType;
  contextId?: string | null;
  name?: string | null;
  trackIds: string[];
}) {
  const { deviceId, userId, type, contextId, name, trackIds } = params;
  const hash = computeSnapshotHash(type, trackIds, contextId);

  const existing = await db.playbackContextSnapshot.findFirst({
    where: { deviceId, hash },
    select: { id: true },
  });
  const snapshotId =
    existing?.id ??
    (
      await db.playbackContextSnapshot.create({
        data: {
          deviceId,
          userId,
          type,
          contextId: contextId ?? null,
          name: name ?? null,
          hash,
          tracks: {
            createMany: {
              data: trackIds.map((id, idx) => ({ trackId: id, index: idx })),
              skipDuplicates: true,
            },
          },
        },
        select: { id: true },
      })
    ).id;

  return { snapshotId, hash };
}

export async function getHydratePayloadForDevice(deviceId: string) {
  const session = await db.playbackSession.findUnique({
    where: { deviceId },
    include: {
      snapshot: { include: { tracks: { orderBy: { index: "asc" } } } },
    },
  });
  if (!session) return null;

  const trackIds = session.snapshot?.tracks.map((t) => t.trackId) ?? [];
  const trackRefs = await resolveTrackRefsOrdered(trackIds);

  const [nextItems, laterItems] = await Promise.all([
    db.playbackQueueItem.findMany({
      where: { deviceId, kind: "NEXT" },
      orderBy: { position: "asc" },
      select: { trackId: true },
    }),
    db.playbackQueueItem.findMany({
      where: { deviceId, kind: "LATER" },
      orderBy: { position: "asc" },
      select: { trackId: true },
    }),
  ]);

  return {
    version: Number(session.version ?? BigInt(0)),
    context: session.snapshot
      ? {
          type: session.snapshot.type,
          contextId: session.snapshot.contextId ?? undefined,
          name: session.snapshot.name ?? undefined,
          snapshotId: session.snapshot.id,
          trackRefs,
          contextIndex: session.contextIndex ?? 0,
          isShuffled: session.isShuffled,
        }
      : undefined,
    explicitNext: await resolveTrackRefsOrdered(
      nextItems.map((x) => x.trackId)
    ),
    explicitLater: await resolveTrackRefsOrdered(
      laterItems.map((x) => x.trackId)
    ),
    repeatMode: session.repeatMode,
  };
}

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
    .filter((r): r is { id: string; audioId: string } => r !== undefined)
    .map((r) => ({ id: r.id, audioId: r.audioId }));
};
