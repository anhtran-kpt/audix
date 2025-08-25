import { zCuidType } from "@/contracts/common";
import {
  PlaybackSessionInput,
  RecordPlayInput,
  SnapshotInput,
} from "@/contracts/playback";
import { getUserIdOrNull } from "@/lib/auth";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { ensureDevice } from "@/server/ensure-device";
import {
  buildTrackIdsForContext,
  createOrReuseSnapshot,
  getHydratePayloadForDevice,
} from "@/server/playback-helpers";
import { resolveTrackRefsOrdered } from "@/server/track-refs";

export const snapshot = async (input: SnapshotInput) => {
  const userId = await getUserIdOrNull();
  const deviceId = await ensureDevice();

  const contextId =
    input.type === "TRACK"
      ? input.contextId ?? input.clickedTrackId
      : input.contextId;

  if (!contextId) {
    throw new AppError("NOT_FOUND", "contextId missing");
  }

  const trackIds = await buildTrackIdsForContext(input.type, contextId);

  if (trackIds.length === 0) {
    throw new AppError("NOT_FOUND", "No tracks in context");
  }

  const { snapshotId } = await createOrReuseSnapshot({
    deviceId,
    userId,
    type: input.type,
    contextId,
    name: input.name ?? null,
    trackIds,
  });

  const trackRefs = await resolveTrackRefsOrdered(trackIds);
  const startIndex = input.clickedTrackId
    ? Math.max(0, trackIds.indexOf(input.clickedTrackId))
    : 0;

  const s = await db.playbackSession.upsert({
    where: { deviceId },
    update: {
      userId,
      snapshotId,
      contextIndex: startIndex,
      version: { increment: 1 },
    },
    create: {
      deviceId,
      userId,
      snapshotId,
      contextIndex: startIndex,
    },
    select: { version: true },
  });

  return {
    type: input.type,
    contextId,
    name: input.name,
    snapshotId,
    trackRefs,
    startIndex,
    version: Number(s.version ?? BigInt(0)),
  };
};

export const getContextFromHistory = async (trackId: zCuidType) => {
  const userId = await getUserIdOrNull();
  const deviceId = await ensureDevice();

  const history = await db.playHistory.findFirst({
    where: userId ? { userId, trackId } : { deviceId, trackId },
    orderBy: { playedAt: "desc" },
    select: {
      playbackContextType: true,
      playbackContextId: true,
      snapshotId: true,
    },
  });

  if (!history || !history.playbackContextType) {
    return { found: false };
  }

  if (history.snapshotId) {
    const snap = await db.playbackContextSnapshot.findUnique({
      where: { id: history.snapshotId },
      include: { tracks: { orderBy: { index: "asc" } } },
    });
    if (snap) {
      const ids = snap.tracks.map((t) => t.trackId);
      const refs = await resolveTrackRefsOrdered(ids);
      const startIndex = Math.max(0, ids.indexOf(trackId));

      await db.playbackSession.upsert({
        where: { deviceId },
        update: {
          userId,
          snapshotId: snap.id,
          contextIndex: startIndex,
          version: { increment: 1 },
        },
        create: {
          deviceId,
          userId,
          snapshotId: snap.id,
          contextIndex: startIndex,
        },
      });

      return {
        found: true,
        type: snap.type,
        contextId: snap.contextId,
        snapshotId: snap.id,
        name: snap.name,
        trackRefs: refs,
        startIndex,
      };
    }
  }

  if (!history.playbackContextType || !history.playbackContextId) {
    return { found: false };
  }

  const ids = await buildTrackIdsForContext(
    history.playbackContextType,
    history.playbackContextId
  );

  if (ids.length === 0) return { found: false };

  const { snapshotId } = await createOrReuseSnapshot({
    deviceId,
    userId,
    type: history.playbackContextType,
    contextId: history.playbackContextId,
    name: null,
    trackIds: ids,
  });

  const refs = await resolveTrackRefsOrdered(ids);
  const startIndex = Math.max(0, ids.indexOf(trackId));

  await db.playbackSession.upsert({
    where: { deviceId },
    update: {
      userId,
      snapshotId,
      contextIndex: startIndex,
      version: { increment: 1 },
    },
    create: {
      deviceId,
      userId,
      snapshotId,
      contextIndex: startIndex,
    },
  });

  return {
    found: true,
    type: history.playbackContextType,
    contextId: history.playbackContextId,
    snapshotId,
    trackRefs: refs,
    startIndex,
  };
};

export const updateSession = async (input: PlaybackSessionInput) => {
  const userId = await getUserIdOrNull();
  const deviceId = await ensureDevice();

  if (input.version != null) {
    const current = await db.playbackSession.findUnique({
      where: { deviceId },
      select: { version: true },
    });
    const serverVer = Number(current?.version ?? BigInt(0));

    if (serverVer !== input.version) {
      throw new AppError("CONFLICT", "Version conflict");
    }
  }

  const updated = await db.playbackSession.upsert({
    where: { deviceId },
    update: {
      userId,
      snapshotId: input.snapshotId ?? undefined,
      contextIndex: input.contextIndex,
      isShuffled: input.isShuffled,
      repeatMode: input.repeatMode,
      version: { increment: 1 },
    },
    create: {
      deviceId,
      userId,
      snapshotId: input.snapshotId ?? null,
      contextIndex: input.contextIndex,
      isShuffled: input.isShuffled,
      repeatMode: input.repeatMode,
    },
    select: { version: true },
  });

  return { version: Number(updated.version ?? BigInt(0)) };
};

export const mergeGuestSession = async (userId: zCuidType) => {
  const deviceId = await ensureDevice();

  await db.$transaction([
    db.playbackSession.updateMany({
      where: { deviceId, userId: null },
      data: { userId },
    }),
    db.playbackQueueItem.updateMany({
      where: { deviceId, userId: null },
      data: { userId },
    }),
    db.playbackContextSnapshot.updateMany({
      where: { deviceId, userId: null },
      data: { userId },
    }),
    db.playHistory.updateMany({
      where: { deviceId, userId: null },
      data: { userId },
    }),
  ]);

  // (Optional) If user had another session on another device, consider merge/replace session.

  const payload = await getHydratePayloadForDevice(deviceId);
  return payload ?? { empty: true };
};

const DEDUP_WINDOW_MS = 2 * 60 * 1000;

export const recordPlay = async (input: RecordPlayInput) => {
  const deviceId = await ensureDevice();
  const userId = await getUserIdOrNull();

  const session = await db.playbackSession.findUnique({
    where: { deviceId },
    select: {
      snapshotId: true,
      snapshot: {
        select: {
          contextId: true,
          type: true,
        },
      },
    },
  });

  let inserted = 0,
    skipped = 0;

  for (const ev of input.events) {
    const playedAt = ev.playedAt ? new Date(ev.playedAt) : new Date();
    const since = new Date(playedAt.getTime() - DEDUP_WINDOW_MS);
    const until = new Date(playedAt.getTime() + DEDUP_WINDOW_MS);

    const dup = await db.playHistory.findFirst({
      where: {
        deviceId,
        trackId: ev.trackId,
        playedAt: { gte: since, lte: until },
      },
      select: { id: true },
    });
    if (dup) {
      skipped++;
      continue;
    }

    await db.playHistory.create({
      data: {
        deviceId,
        userId,
        trackId: ev.trackId,
        listenedSec: ev.listenedSec,
        playedAt,
        playbackContextType: session?.snapshot?.type ?? "TRACK",
        playbackContextId: session?.snapshot?.contextId ?? null,
        snapshotId: session?.snapshotId ?? null,
      },
    });

    await db.track.update({
      where: { id: ev.trackId },
      data: { playCount: { increment: 1 } },
    });
    inserted++;
  }

  return { ok: true, inserted, skipped };
};
