import { zCuidType } from "@/contracts/common";
import { PlaybackSessionInput, SnapshotInput } from "@/contracts/playback";
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
    name: input.name ?? null,
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
    },
  });

  if (!history || !history.playbackContextType) {
    return { found: false };
  }

  const type = history.playbackContextType;
  const contextId = history.playbackContextId ?? undefined;

  if (!contextId) return { found: false };

  const trackIds = await buildTrackIdsForContext(type, contextId);

  if (trackIds.length === 0) return { found: false };

  const { snapshotId } = await createOrReuseSnapshot({
    deviceId,
    userId,
    type,
    contextId,
    name: null,
    trackIds,
  });

  const trackRefs = await resolveTrackRefsOrdered(trackIds);
  const startIndex = Math.max(0, trackIds.indexOf(trackId));

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
    type,
    contextId,
    snapshotId,
    trackRefs,
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
      repeatMode: input.repeatMode as any,
      version: { increment: 1 as any },
    },
    create: {
      deviceId,
      userId,
      snapshotId: input.snapshotId ?? null,
      contextIndex: input.contextIndex,
      isShuffled: input.isShuffled,
      repeatMode: input.repeatMode as any,
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
