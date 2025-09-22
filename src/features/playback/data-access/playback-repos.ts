import "server-only";
import db from "@/lib/db";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { PlaybackContextType } from "@/features/shared/contracts/shared-enum";
import { createHash } from "crypto";
import { trackItemSelect } from "@/features/track/data-access/track-selects";
import {
  RepeatPlaybackInput,
  ShufflePlaybackInput,
  StartPlaybackInput,
} from "../contracts/playback-dto";
import { NextResponse } from "next/server";
import { playbackSessionSelect } from "./playback-selects";

const createSnapshotFromPlaylist = async ({
  playlistId,
  userId,
}: {
  playlistId: zCuidType;
  userId: zCuidType;
}) => {
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    include: { tracks: { orderBy: { position: "asc" } } },
  });

  if (!playlist) throw new Error("Playlist not found");

  const hash = createHash("sha256")
    .update(JSON.stringify(playlist.tracks.map((t) => t.trackId)))
    .digest("hex");

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      type: "PLAYLIST",
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
    include: { tracks: { orderBy: { trackNumber: "asc" } } },
  });

  if (!album) throw new Error("Album not found");

  const hash = createHash("sha256")
    .update(JSON.stringify(album.tracks.map((t) => t.id)))
    .digest("hex");

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      type: "ALBUM",
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
    .findUnique({
      where: {
        id: artistId,
      },
      select: {
        tracks: {
          select: {
            track: {
              select: {
                ...trackItemSelect,
              },
            },
          },
        },
        name: true,
      },
    })
    .then((data) => ({
      ...data,
      tracks: data?.tracks.map((item) => item.track),
    }));

  if (!artist) throw new Error("Artist not found");

  const { name, tracks } = artist;

  if (!tracks) throw new Error("No tracks for artist");

  const hash = createHash("sha256")
    .update(JSON.stringify(tracks.map((t) => t.id)))
    .digest("hex");

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      type: "ARTIST",
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
  });
};

const createSnapshotFromHistory = async (userId: string) => {
  const history = await db.playHistory.findMany({
    where: { userId },
    orderBy: { playedAt: "desc" },
    take: 50,
    include: { track: true },
  });

  if (history.length === 0) throw new Error("No history");

  const hash = createHash("sha256")
    .update(JSON.stringify(history.map((h) => h.trackId)))
    .digest("hex");

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      type: "HISTORY",
      contextId: null,
      name: "Recently Played",
      hash,
      tracks: {
        createMany: {
          data: history.map((h, index) => ({
            trackId: h.trackId,
            index,
          })),
        },
      },
    },
  });
};

const createSnapshotFromSearch = async ({
  userId,
  query,
}: {
  userId: zCuidType;
  query: string;
}) => {
  const results = await db.track.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { artist: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    take: 50,
  });

  if (results.length === 0) throw new Error("No search results");

  const hash = createHash("sha256")
    .update(JSON.stringify(results.map((t) => t.id)))
    .digest("hex");

  return db.playbackContextSnapshot.create({
    data: {
      userId,
      type: "SEARCH",
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
  contextIdOrQuery: string | null
) => {
  switch (contextType) {
    case "PLAYLIST":
      return createSnapshotFromPlaylist({
        playlistId: contextIdOrQuery!,
        userId,
      });
    case "ALBUM":
      return createSnapshotFromAlbum({
        albumId: contextIdOrQuery!,
        userId,
      });
    case "ARTIST":
      return createSnapshotFromArtist({
        artistId: contextIdOrQuery!,
        userId,
      });
    case "HISTORY":
      return createSnapshotFromHistory(userId);
    case "SEARCH":
      return createSnapshotFromSearch({
        query: contextIdOrQuery!,
        userId,
      });
    default:
      throw new Error(`Unsupported context type: ${contextType}`);
  }
};

export const startPlaybackSession = async ({
  userId,
  input,
}: {
  userId: string;
  input: StartPlaybackInput;
}) => {
  const { contextType, contextIdOrQuery, startTrackId } = input;

  const snapshot = await createSnapshot(userId, contextType, contextIdOrQuery);

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
      progressMs: 0,
    },
    update: {
      snapshotId: snapshot.id,
      contextIndex,
      currentTrackId,
      progressMs: 0,
      version: { increment: 1 },
      updatedAt: new Date(),
    },
    // include: {
    //   snapshot: {
    //     include: { tracks: { orderBy: { index: "asc" } } },
    //   },
    // },
    select: {
      ...playbackSessionSelect,
    },
  });

  return session;
};

export const pausePlayback = async (userId: string) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
  });

  if (!session) {
    return NextResponse.json(
      { error: "No active playback session" },
      { status: 404 }
    );
  }

  if (!session.isPlaying) {
    return NextResponse.json({
      success: true,
      state: session,
    });
  }

  let newProgress = session.progressMs;
  if (session.lastPositionUpdatedAt) {
    const elapsed =
      Date.now() - new Date(session.lastPositionUpdatedAt).getTime();
    newProgress += elapsed;
  }

  const updated = await db.playbackSession.update({
    where: { id: session.id },
    data: {
      isPlaying: false,
      progressMs: newProgress,
      lastPositionUpdatedAt: null,
      version: { increment: 1 },
    },
  });

  return NextResponse.json({
    success: true,
    state: updated,
  });
};

export const resumePlayback = async (userId: string) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
  });

  if (!session) {
    return NextResponse.json(
      { error: "No active playback session" },
      { status: 404 }
    );
  }

  if (session.isPlaying) {
    return NextResponse.json({
      success: true,
      state: session,
    });
  }

  const updated = await db.playbackSession.update({
    where: { id: session.id },
    data: {
      isPlaying: true,
      lastPositionUpdatedAt: new Date(),
      version: { increment: 1 },
    },
  });

  return NextResponse.json({
    success: true,
    state: updated,
  });
};

export const skipToNext = async (userId: string) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
    include: {
      snapshot: {
        include: { tracks: { orderBy: { index: "asc" } } },
      },
      queue: {
        where: { kind: "NEXT" },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!session) {
    return NextResponse.json(
      { error: "No active playback session" },
      { status: 404 }
    );
  }

  let newTrackId: string | null = null;
  let newIndex: number = session.contextIndex;

  if (session.queue.length > 0) {
    const nextItem = session.queue[0];

    await db.playbackQueueItem.delete({
      where: { id: nextItem.id },
    });

    newTrackId = nextItem.trackId;
  } else {
    const tracks = session.snapshot.tracks;
    if (!tracks || tracks.length === 0) {
      return NextResponse.json(
        { error: "No tracks in snapshot" },
        { status: 400 }
      );
    }

    let nextIndex = session.contextIndex + 1;

    if (nextIndex >= tracks.length) {
      if (session.repeatMode === "ALL") {
        nextIndex = 0;
      } else {
        return NextResponse.json({
          success: true,
          state: { ...session, isPlaying: false },
        });
      }
    }

    newIndex = nextIndex;
    newTrackId = tracks[nextIndex].trackId;
  }

  // Cập nhật session
  const updated = await db.playbackSession.update({
    where: { id: session.id },
    data: {
      currentTrackId: newTrackId!,
      contextIndex: newIndex,
      progressMs: 0,
      lastPositionUpdatedAt: new Date(),
      isPlaying: true,
      version: { increment: 1 },
    },
  });

  return NextResponse.json({
    success: true,
    state: updated,
  });
};

export const skipToPrevious = async (userId: string) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
    include: {
      snapshot: {
        include: { tracks: { orderBy: { index: "asc" } } },
      },
    },
  });

  if (!session) {
    return NextResponse.json(
      { error: "No active playback session" },
      { status: 404 }
    );
  }

  let newTrackId: string | null = session.currentTrackId;
  let newIndex: number = session.contextIndex;

  if (session.progressMs > 3000) {
    newTrackId = session.currentTrackId;
    newIndex = session.contextIndex;
  } else {
    const tracks = session.snapshot.tracks;
    if (!tracks || tracks.length === 0) {
      return NextResponse.json(
        { error: "No tracks in snapshot" },
        { status: 400 }
      );
    }

    let prevIndex = session.contextIndex - 1;

    if (prevIndex < 0) {
      if (session.repeatMode === "ALL") {
        prevIndex = tracks.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    newIndex = prevIndex;
    newTrackId = tracks[prevIndex].trackId;
  }

  const updated = await db.playbackSession.update({
    where: { id: session.id },
    data: {
      currentTrackId: newTrackId!,
      contextIndex: newIndex,
      progressMs: 0,
      lastPositionUpdatedAt: new Date(),
      isPlaying: true,
      version: { increment: 1 },
    },
  });

  return NextResponse.json({
    success: true,
    state: updated,
  });
};

export const seekPlayback = async (userId: string, positionMs: number) => {
  const session = await db.playbackSession.findUnique({
    where: { userId },
    include: { snapshot: { include: { tracks: true } } },
  });

  if (!session) {
    return NextResponse.json(
      { error: "No active playback session" },
      { status: 404 }
    );
  }

  const updated = await db.playbackSession.update({
    where: { id: session.id },
    data: {
      progressMs: positionMs,
      lastPositionUpdatedAt: new Date(),
      version: { increment: 1 },
    },
  });

  return NextResponse.json({
    success: true,
    state: updated,
  });
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
      updatedAt: new Date(),
    },
    include: {
      snapshot: {
        include: { tracks: { orderBy: { index: "asc" } } },
      },
    },
  });

  return NextResponse.json(session);
};

export const repeatPlayback = async (
  userId: string,
  input: RepeatPlaybackInput
) => {
  const { repeatMode } = input;

  if (!["OFF", "ONE", "ALL"].includes(repeatMode)) {
    return NextResponse.json({ error: "Invalid repeat mode" }, { status: 400 });
  }

  const session = await db.playbackSession.update({
    where: { userId },
    data: {
      repeatMode,
      version: { increment: 1 },
      updatedAt: new Date(),
    },
    include: {
      snapshot: {
        include: { tracks: { orderBy: { index: "asc" } } },
      },
    },
  });

  return NextResponse.json(session);
};
