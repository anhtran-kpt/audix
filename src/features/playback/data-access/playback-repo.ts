import "server-only";
import db from "@/lib/db";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { PlaybackContextType } from "@/features/shared/contracts/shared-enum";
import { createHash } from "crypto";
import {
  trackDetailSelect,
  trackItemSelect,
} from "@/features/track/data-access/track-selects";
import {
  PlaybackSession,
  RepeatPlaybackInput,
  ShufflePlaybackInput,
  StartPlaybackInput,
} from "../contracts/playback-dto";
import { NextResponse } from "next/server";
import { playbackSessionSelect } from "./playback-select";

export const buildClientQueue = ({
  snapshot,
  contextIndex,
  queue,
  isShuffled,
}: Pick<
  PlaybackSession,
  "snapshot" | "contextIndex" | "queue" | "isShuffled"
>) => {
  const nextQueue = queue
    .filter((q) => q.kind === "NEXT")
    .sort((a, b) => a.position - b.position)
    .map((q) => q.track);

  let contextQueue = snapshot.tracks
    .filter((t) => t.index > contextIndex)
    .map((t) => t.track);

  if (isShuffled) {
    contextQueue = shuffleArray(contextQueue);
  }

  const laterQueue = queue
    .filter((q) => q.kind === "LATER")
    .sort((a, b) => a.position - b.position)
    .map((q) => q.track);

  return {
    next: nextQueue,
    context: contextQueue,
    later: laterQueue,
  };
};

export const getPlaybackBoundaries = ({
  snapshot,
  contextIndex,
  queue,
  repeatMode,
}: Pick<
  PlaybackSession,
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

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const getPlaybackSession = async (userId: string) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
    select: playbackSessionSelect,
  });

  if (!session) return null;

  const { hasNext, hasPrevious } = getPlaybackBoundaries(session);

  const queue = buildClientQueue(session);

  return { ...session, hasNext, hasPrevious, queue };
};

const createSnapshotFromPlaylist = async ({
  playlistId,
  userId,
}: {
  playlistId: zCuidType;
  userId: zCuidType;
}) => {
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    select: {
      title: true,
      tracks: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!playlist) throw new Error("Playlist not found");

  const hash = createHash("sha256")
    .update(JSON.stringify(playlist.tracks.map((t) => t.trackId)))
    .digest("hex");

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      contextType: "PLAYLIST",
      contextId: playlistId,
      name: playlist.title,
      hash,
      tracks: {
        createMany: {
          data: playlist.tracks.map((t, index) => ({
            trackId: t.trackId,
            index,
          })),
        },
      },
    },
  });
};

const createSnapshotFromAlbum = async ({
  albumId,
  userId,
}: {
  albumId: zCuidType;
  userId: zCuidType;
}) => {
  const album = await db.album.findUnique({
    where: { id: albumId },
    select: {
      title: true,
      tracks: {
        orderBy: {
          trackNumber: "asc",
        },
      },
    },
  });

  if (!album) throw new Error("Album not found");

  const hash = createHash("sha256")
    .update(JSON.stringify(album.tracks.map((t) => t.id)))
    .digest("hex");

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      contextType: "ALBUM",
      contextId: albumId,
      name: album.title,
      hash,
      tracks: {
        createMany: {
          data: album.tracks.map((t, index) => ({
            trackId: t.id,
            index,
          })),
        },
      },
    },
  });
};

const createSnapshotFromArtist = async ({
  artistId,
  userId,
}: {
  artistId: zCuidType;
  userId: zCuidType;
}) => {
  const artist = await db.artist
    .findUniqueOrThrow({
      where: {
        id: artistId,
      },
      select: {
        name: true,
        tracks: {
          select: {
            track: {
              select: {
                ...trackItemSelect,
              },
            },
          },
        },
      },
    })
    .then((data) => ({
      ...data,
      tracks: data?.tracks.map((item) => item.track),
    }));

  const { name, tracks } = artist;

  if (!tracks) throw new Error("No tracks for artist");

  const hash = createHash("sha256")
    .update(JSON.stringify(tracks.map((t) => t.id)))
    .digest("hex");

  const existing = await db.playbackContextSnapshot.findUnique({
    where: {
      userId_hash: { userId, hash },
    },
    include: {
      tracks: true,
    },
  });

  if (existing) {
    return existing;
  }

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      contextType: "ARTIST",
      contextId: artistId,
      name,
      hash,
      tracks: {
        createMany: {
          data: tracks.map((t, index) => ({
            trackId: t.id,
            index,
          })),
        },
      },
    },
    include: {
      tracks: true,
    },
  });
};

const resumeSnapshotFromHistory = async ({
  historyId,
}: {
  userId: string;
  historyId: string;
}) => {
  const history = await db.playHistory.findUnique({
    where: { id: historyId },
    include: {
      snapshot: {
        include: { tracks: true },
      },
    },
  });

  if (!history) throw new Error("No history");

  return history.snapshot;
};

const createSnapshotFromSearch = async ({
  userId,
  query,
}: {
  userId: zCuidType;
  query: string;
}) => {
  const results = await db.track.findMany({
    where: { title: { contains: query, mode: "insensitive" } },
    select: trackItemSelect,
  });

  if (results.length === 0) throw new Error("No search results");

  const hash = createHash("sha256")
    .update(JSON.stringify(results.map((t) => t.id)))
    .digest("hex");

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      contextType: "SEARCH",
      contextId: query,
      name: `Search: ${query}`,
      hash,
      tracks: {
        createMany: {
          data: results.map((t, index) => ({
            trackId: t.id,
            index,
          })),
        },
      },
    },
  });
};

const createSnapshot = (
  userId: string,
  contextType: PlaybackContextType,
  contextId: string
) => {
  switch (contextType) {
    case "PLAYLIST":
      return createSnapshotFromPlaylist({
        playlistId: contextId,
        userId,
      });
    case "ALBUM":
      return createSnapshotFromAlbum({
        albumId: contextId,
        userId,
      });
    case "ARTIST":
      return createSnapshotFromArtist({
        artistId: contextId,
        userId,
      });
    case "HISTORY":
      return resumeSnapshotFromHistory({ userId, historyId: contextId });
    case "SEARCH":
      return createSnapshotFromSearch({
        query: contextId,
        userId,
      });
    default:
      throw new Error(`Unsupported context type: ${contextType}`);
  }
};

export const startPlaybackSession = async ({
  userId,
  context,
}: {
  userId: string;
  context: StartPlaybackInput;
}) => {
  const { contextType, contextId, startTrackId } = context;

  const snapshot = await createSnapshot(userId, contextType, contextId);
  const snapshotTracks = await db.playbackSnapshotTrack.findMany({
    where: { snapshotId: snapshot.id },
    orderBy: { index: "asc" },
  });

  if (snapshotTracks.length === 0) {
    throw new Error("Snapshot has no tracks");
  }

  let contextIndex = 0;
  if (startTrackId) {
    const foundIndex = snapshotTracks.findIndex(
      (t) => t.trackId === startTrackId
    );
    if (foundIndex !== -1) {
      contextIndex = foundIndex;
    }
  }

  const currentTrackId = snapshotTracks[contextIndex].trackId;

  const session = await db.playbackSession.upsert({
    where: { userId },
    create: {
      userId,
      snapshotId: snapshot.id,
      contextIndex,
      currentTrackId,
    },
    update: {
      snapshotId: snapshot.id,
      contextIndex,
      currentTrackId,
      version: { increment: 1 },
    },
    select: playbackSessionSelect,
  });

  const { hasNext, hasPrevious } = getPlaybackBoundaries(session);

  const queue = buildClientQueue(session);

  await db.playHistory.create({
    data: {
      snapshotId: snapshot.id,
      trackId: currentTrackId,
      userId: userId,
      listenedSec: 0,
    },
  });

  return { ...session, hasNext, hasPrevious, queue };
};

export const skipToNext = async (userId: string) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
    include: {
      snapshot: { include: { tracks: { orderBy: { index: "asc" } } } },
      queue: {
        include: { track: true },
        orderBy: [{ kind: "asc" }, { position: "asc" }],
      },
    },
  });

  if (!session) throw new Error("No active playback session");

  const [nextItem] = session.queue.filter((q) => q.kind === "NEXT");

  let pickedTrackId: string | null = null;
  let newIndex = session.contextIndex;

  if (nextItem) {
    pickedTrackId = nextItem.trackId;
    await db.playbackQueueItem.delete({ where: { id: nextItem.id } });
  } else {
    const tracks = session.snapshot.tracks;
    if (session.contextIndex + 1 < tracks.length) {
      newIndex = session.contextIndex + 1;
      pickedTrackId = tracks[newIndex].trackId;
    } else {
      const [laterItem] = session.queue.filter((q) => q.kind === "LATER");
      if (laterItem) {
        pickedTrackId = laterItem.trackId;
        await db.playbackQueueItem.delete({ where: { id: laterItem.id } });
      } else if (session.repeatMode === "ALL") {
        newIndex = 0;
        pickedTrackId = tracks[0].trackId;
      } else if (session.repeatMode === "ONE") {
        pickedTrackId = session.currentTrackId;
      } else {
        return null;
      }
    }
  }

  if (!pickedTrackId) return null;

  const nextTrack = await db.track.findUniqueOrThrow({
    where: { id: pickedTrackId },
    select: trackDetailSelect,
  });

  const updated = await db.playbackSession.update({
    where: { id: session.id },
    data: {
      currentTrackId: pickedTrackId,
      contextIndex: newIndex,
      version: { increment: 1 },
    },
    select: playbackSessionSelect,
  });

  const { hasNext, hasPrevious } = getPlaybackBoundaries(updated);

  const queue = buildClientQueue(updated);

  await db.playHistory.create({
    data: {
      snapshotId: session.snapshot.id,
      trackId: nextTrack.id,
      userId: userId,
      listenedSec: 0,
    },
  });

  return {
    currentTrackId: updated.currentTrackId,
    contextIndex: updated.contextIndex,
    currentTrack: nextTrack,
    hasNext,
    hasPrevious,
    queue,
  };
};

export const skipToPrevious = async (userId: string, progressMs?: number) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
    include: {
      snapshot: { include: { tracks: { orderBy: { index: "asc" } } } },
    },
  });

  if (!session) {
    throw new Error("No active playback session");
  }

  const tracks = session.snapshot.tracks;
  if (!tracks || tracks.length === 0) {
    throw new Error("No tracks in snapshot");
  }

  let newIndex = session.contextIndex;
  let newTrackId = session.currentTrackId;

  if (progressMs !== undefined && progressMs < 3000) {
    if (session.contextIndex > 0) {
      newIndex = session.contextIndex - 1;
      newTrackId = tracks[newIndex].trackId;
    } else if (session.contextIndex === 0 && session.repeatMode === "ALL") {
      newIndex = tracks.length - 1;
      newTrackId = tracks[newIndex].trackId;
    } else {
      newIndex = 0;
      newTrackId = tracks[0].trackId;
    }
  } else {
    newIndex = session.contextIndex;
    newTrackId = tracks[newIndex].trackId;
  }

  const newTrack = await db.track.findUniqueOrThrow({
    where: { id: newTrackId },
    select: trackDetailSelect,
  });

  const updated = await db.playbackSession.update({
    where: { id: session.id },
    data: {
      currentTrackId: newTrackId,
      contextIndex: newIndex,
      version: { increment: 1 },
    },
    select: playbackSessionSelect,
  });

  const { hasNext, hasPrevious } = getPlaybackBoundaries(updated);

  const queue = buildClientQueue(updated);

  await db.playHistory.create({
    data: {
      snapshotId: session.snapshot.id,
      trackId: newTrack.id,
      userId: userId,
      listenedSec: 0,
    },
  });

  return {
    currentTrackId: updated.currentTrackId,
    contextIndex: updated.contextIndex,
    currentTrack: newTrack,
    hasNext,
    hasPrevious,
    queue,
  };
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
