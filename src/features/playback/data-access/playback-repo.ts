import "server-only";
import db from "@/lib/db";
import { createHash } from "crypto";
import { trackItemSelect } from "@/features/track/data-access/track-select";
import {
  ServerPlaybackSession,
  RepeatPlaybackInput,
  ShufflePlaybackInput,
  StartPlaybackInput,
} from "../contracts/playback-dto";
import { NextResponse } from "next/server";
import { playbackSessionSelect } from "./playback-select";
import { PlaybackContextType, Prisma } from "@/app/generated/prisma";
import { shuffleArray } from "@/utils/array";
import { AppError } from "@/lib/errors";

const generateHash = (
  userId: string,
  contextType: PlaybackContextType,
  contextId: string,
  trackIds: string[]
) => {
  return createHash("sha256")
    .update(JSON.stringify({ userId, contextType, contextId, trackIds }))
    .digest("hex");
};

const transformTrackItem = (
  track: Prisma.TrackGetPayload<{ select: typeof trackItemSelect }>
) => ({
  ...track,
  artists: track.artists.map((a) => a.artist),
});

const buildClientQueue = ({
  snapshot,
  contextIndex,
  queue,
  isShuffled,
}: Pick<
  ServerPlaybackSession,
  "snapshot" | "contextIndex" | "queue" | "isShuffled"
>) => {
  const nextQueue = queue
    .filter((q) => q.kind === "NEXT")
    .sort((a, b) => a.position - b.position)
    .map((q) => q.track);

  let contextQueue = snapshot.tracks
    .filter((t) => t.index > contextIndex)
    .map((t) => t.track);

  if (isShuffled) contextQueue = shuffleArray(contextQueue);

  const laterQueue = queue
    .filter((q) => q.kind === "LATER")
    .sort((a, b) => a.position - b.position)
    .map((q) => q.track);

  return { next: nextQueue, context: contextQueue, later: laterQueue };
};

const getPlaybackBoundaries = ({
  snapshot,
  contextIndex,
  queue,
  repeatMode,
}: Pick<
  ServerPlaybackSession,
  "snapshot" | "contextIndex" | "queue" | "repeatMode"
>) => {
  const tracks = snapshot.tracks;
  const hasNextInQueue = queue.some((q) => q.kind === "NEXT");
  const hasNextInContext = contextIndex < tracks.length - 1;
  const hasNextInLater = queue.some((q) => q.kind === "LATER");

  const hasNext =
    hasNextInQueue ||
    hasNextInContext ||
    hasNextInLater ||
    (repeatMode === "ALL" && tracks.length > 0);

  const hasPrevInContext = contextIndex > 0;
  const hasPrevious =
    hasPrevInContext || (repeatMode === "ALL" && tracks.length > 0);

  return { hasNext, hasPrevious };
};

async function ensureSnapshot({
  userId,
  contextType,
  contextId,
}: {
  userId: string;
  contextType: PlaybackContextType;
  contextId: string;
}) {
  switch (contextType) {
    case "PLAYLIST": {
      const playlist = await db.playlist.findUnique({
        where: { id: contextId },
        select: {
          title: true,
          tracks: { orderBy: { position: "asc" } },
        },
      });
      if (!playlist) throw new Error("Playlist not found");

      const trackIds = playlist.tracks.map((t) => t.trackId);
      const hash = generateHash(userId, contextType, contextId, trackIds);

      const existing = await db.playbackContextSnapshot.findUnique({
        where: { userId_hash: { userId, hash } },
        include: { tracks: true },
      });
      if (existing) return existing;

      return db.playbackContextSnapshot.create({
        data: {
          userId,
          contextType,
          contextId,
          name: playlist.title,
          hash,
          tracks: {
            createMany: {
              data: trackIds.map((trackId, index) => ({ trackId, index })),
            },
          },
        },
        include: { tracks: true },
      });
    }

    case "ALBUM": {
      const album = await db.album.findUnique({
        where: { id: contextId },
        select: {
          title: true,
          tracks: { orderBy: { trackNumber: "asc" } },
        },
      });
      if (!album) throw new Error("Album not found");

      const trackIds = album.tracks.map((t) => t.id);
      const hash = generateHash(userId, contextType, contextId, trackIds);

      const existing = await db.playbackContextSnapshot.findUnique({
        where: { userId_hash: { userId, hash } },
        include: { tracks: true },
      });
      if (existing) return existing;

      return db.playbackContextSnapshot.create({
        data: {
          userId,
          contextType,
          contextId,
          name: album.title,
          hash,
          tracks: {
            createMany: {
              data: trackIds.map((trackId, index) => ({ trackId, index })),
            },
          },
        },
        include: { tracks: true },
      });
    }

    case "ARTIST": {
      const artist = await db.artist.findUniqueOrThrow({
        where: { id: contextId },
        select: {
          name: true,
          tracks: {
            select: {
              track: { select: trackItemSelect },
            },
          },
        },
      });

      const tracks = artist.tracks.map((t) => t.track);
      const trackIds = tracks.map((t) => t.id);
      const hash = generateHash(userId, contextType, contextId, trackIds);

      const existing = await db.playbackContextSnapshot.findUnique({
        where: { userId_hash: { userId, hash } },
        include: { tracks: true },
      });
      if (existing) return existing;

      return db.playbackContextSnapshot.create({
        data: {
          userId,
          contextType,
          contextId,
          name: artist.name,
          hash,
          tracks: {
            createMany: {
              data: trackIds.map((trackId, index) => ({ trackId, index })),
            },
          },
        },
        include: { tracks: true },
      });
    }

    case "SEARCH": {
      const results = await db.track.findMany({
        where: { title: { contains: contextId, mode: "insensitive" } },
        select: trackItemSelect,
      });
      if (results.length === 0) throw new Error("No search results");

      const trackIds = results.map((t) => t.id);
      const hash = generateHash(userId, contextType, contextId, trackIds);

      const existing = await db.playbackContextSnapshot.findUnique({
        where: { userId_hash: { userId, hash } },
        include: { tracks: true },
      });
      if (existing) return existing;

      return db.playbackContextSnapshot.create({
        data: {
          userId,
          contextType,
          contextId,
          name: `Search: ${contextId}`,
          hash,
          tracks: {
            createMany: {
              data: trackIds.map((trackId, index) => ({ trackId, index })),
            },
          },
        },
        include: { tracks: true },
      });
    }

    case "HISTORY": {
      const history = await db.playHistory.findUnique({
        where: { id: contextId },
        include: {
          snapshot: { include: { tracks: true } },
        },
      });
      if (!history) throw new Error("No history");
      return history.snapshot;
    }

    default:
      throw new Error(`Unsupported context type: ${contextType}`);
  }
}

export const getClientPlaybackSession = async (userId: string) => {
  const session = await db.playbackSession.findUnique({
    where: { id: userId },
    select: playbackSessionSelect,
  });
  if (!session) {
    return {};
  }
  const { hasNext, hasPrevious } = getPlaybackBoundaries(session);
  const queue = buildClientQueue(session);
  return {
    ...session,
    hasNext,
    hasPrevious,
    queue,
    currentTrack: transformTrackItem(session.currentTrack),
  };
};

export const startPlaybackSession = async ({
  userId,
  context,
}: {
  userId: string;
  context: StartPlaybackInput;
}) => {
  const { contextType, contextId, startTrackId } = context;

  const snapshot = await ensureSnapshot({ userId, contextType, contextId });

  const snapshotTracks = await db.playbackSnapshotTrack.findMany({
    where: { snapshotId: snapshot.id },
    orderBy: { index: "asc" },
  });
  if (snapshotTracks.length === 0) throw new Error("Snapshot has no tracks");

  let contextIndex = 0;
  if (startTrackId) {
    const found = snapshotTracks.findIndex((t) => t.trackId === startTrackId);
    if (found !== -1) contextIndex = found;
  }

  const currentTrackId = snapshotTracks[contextIndex].trackId;

  const session = await db.playbackSession
    .upsert({
      where: { userId },
      create: { userId, snapshotId: snapshot.id, contextIndex, currentTrackId },
      update: {
        snapshotId: snapshot.id,
        contextIndex,
        currentTrackId,
        version: { increment: 1 },
      },
      select: playbackSessionSelect,
    })
    .then((s) => ({
      ...s,
      currentTrack: transformTrackItem(s.currentTrack),
    }));

  const { hasNext, hasPrevious } = getPlaybackBoundaries(session);
  const queue = buildClientQueue(session);

  await db.playHistory.create({
    data: {
      snapshotId: snapshot.id,
      trackId: currentTrackId,
      userId,
      listenedSec: 0,
    },
  });

  return { ...session, hasNext, hasPrevious, queue };
};

export const skipToNext = async (userId: string) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
    include: {
      snapshot: {
        include: { tracks: { orderBy: { index: "asc" } } },
      },
      queue: {
        include: { track: true },
        orderBy: [{ kind: "asc" }, { position: "asc" }],
      },
    },
  });

  if (!session) throw new AppError("NOT_FOUND", "No active playback session");

  const { snapshot, queue, repeatMode } = session;
  let { contextIndex } = session;
  let nextTrackId: string | null = null;

  const nextItem = queue.find((q) => q.kind === "NEXT");
  if (nextItem) {
    nextTrackId = nextItem.trackId;
    await db.playbackQueueItem.delete({ where: { id: nextItem.id } });
  }

  if (!nextTrackId) {
    const contextTracks = snapshot.tracks;
    if (contextIndex + 1 < contextTracks.length) {
      contextIndex += 1;
      nextTrackId = contextTracks[contextIndex].trackId;
    }
  }

  if (!nextTrackId) {
    const laterItem = queue.find((q) => q.kind === "LATER");
    if (laterItem) {
      nextTrackId = laterItem.trackId;
      await db.playbackQueueItem.delete({ where: { id: laterItem.id } });
    }
  }

  if (!nextTrackId && repeatMode === "ALL" && snapshot.tracks.length > 0) {
    contextIndex = 0;
    nextTrackId = snapshot.tracks[0].trackId;
  }

  if (!nextTrackId && repeatMode === "ONE") {
    nextTrackId = session.currentTrackId;
  }

  if (!nextTrackId) return null;

  const updated = await db.playbackSession
    .update({
      where: { userId },
      data: {
        currentTrackId: nextTrackId,
        contextIndex,
        version: { increment: 1 },
      },
      select: playbackSessionSelect,
    })
    .then((s) => ({
      ...s,
      currentTrack: transformTrackItem(s.currentTrack),
    }));

  const { hasNext, hasPrevious } = getPlaybackBoundaries(updated);
  const queueState = buildClientQueue(updated);

  await db.playHistory.create({
    data: {
      snapshotId: session.snapshotId,
      trackId: nextTrackId,
      userId,
      listenedSec: 0,
    },
  });

  return {
    ...updated,
    hasNext,
    hasPrevious,
    queue: queueState,
  };
};

export const skipToPrevious = async (userId: string, progressMs = 0) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
    include: {
      snapshot: {
        include: { tracks: { orderBy: { index: "asc" } } },
      },
    },
  });

  if (!session) throw new AppError("NOT_FOUND", "No active playback session");

  const { snapshot, repeatMode } = session;
  let { contextIndex } = session;
  const tracks = snapshot.tracks;

  if (progressMs < 3000) {
    if (contextIndex > 0) {
      contextIndex -= 1;
    } else if (repeatMode === "ALL") {
      contextIndex = tracks.length - 1;
    }
  }

  const newTrackId = tracks[contextIndex].trackId;

  const updated = await db.playbackSession
    .update({
      where: { userId },
      data: {
        currentTrackId: newTrackId,
        contextIndex,
        version: { increment: 1 },
      },
      select: playbackSessionSelect,
    })
    .then((s) => ({
      ...s,
      currentTrack: transformTrackItem(s.currentTrack),
    }));

  const { hasNext, hasPrevious } = getPlaybackBoundaries(updated);
  const queue = buildClientQueue(updated);

  await db.playHistory.create({
    data: {
      snapshotId: session.snapshotId,
      trackId: newTrackId,
      userId,
      listenedSec: 0,
    },
  });

  return { ...updated, hasNext, hasPrevious, queue };
};

export const shufflePlayback = async (
  userId: string,
  input: ShufflePlaybackInput
) => {
  const { isShuffled } = input;

  const session = await db.playbackSession.update({
    where: { userId },
    data: {
      isShuffled,
      version: { increment: 1 },
    },
    select: playbackSessionSelect,
  });

  const queue = buildClientQueue(session);

  return { isShuffled: session.isShuffled, queue };
};

export const repeatPlayback = async (
  userId: string,
  input: RepeatPlaybackInput
) => {
  const { repeatMode } = input;

  if (!["OFF", "ONE", "ALL"].includes(repeatMode)) {
    return NextResponse.json({ error: "Invalid repeat mode" }, { status: 400 });
  }

  return await db.playbackSession.update({
    where: { userId },
    data: {
      repeatMode,
    },
    select: {
      repeatMode: true,
    },
  });
};
