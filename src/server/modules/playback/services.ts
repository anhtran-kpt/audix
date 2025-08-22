import { zCuidType } from "@/contracts/common";
import {
  ResolveHistoryInput,
  SnapshotInput,
  TrackRef,
} from "@/contracts/playback";
import { getUserIdOrThrow } from "@/lib/auth";
import db from "@/lib/db";
import { createHash } from "crypto";

export const snapshot = async (userId: zCuidType, input: SnapshotInput) => {
  const { type, contextId } = input;

  let name: string | undefined;
  let refs: TrackRef[] = [];

  if (type === "ALBUM") {
    const album = await db.album.findUniqueOrThrow({
      where: { id: contextId! },
      select: {
        title: true,
        tracks: {
          orderBy: { trackNumber: "asc" },
          select: { id: true, audioId: true },
        },
      },
    });

    name = album.title;
    refs = album.tracks.map((t) => ({ id: t.id, audioId: t.audioId }));
  } else if (type === "PLAYLIST") {
    const playlist = await db.playlist.findUniqueOrThrow({
      where: { id: contextId! },
      select: {
        title: true,
        items: {
          orderBy: { position: "asc" },
          select: { track: { select: { id: true, audioId: true } } },
        },
      },
    });
    name = playlist.title;
    refs = playlist.items.map((item) => ({
      id: item.track.id,
      audioId: item.track.audioId,
    }));
  } else if (type === "LIKED") {
    const liked = await db.userLikedTrack.findMany({
      where: { userId },
      orderBy: { likedAt: "desc" },
      select: { track: { select: { id: true, audioId: true } } },
      take: 1000,
    });
    name = "Liked Songs";
    refs = liked.map((i) => ({ id: i.track.id, audioId: i.track.audioId }));
  } else if (type === "ARTIST") {
    const rows = await db.track.findMany({
      where: {
        artists: {
          some: {
            artistId: contextId!,
          },
        },
      },
      orderBy: { playCount: "desc" },
      select: { id: true, audioId: true },
      take: 10,
    });
    const artist = await db.artist.findUnique({
      where: { id: contextId! },
      select: { name: true },
    });
    name = artist?.name;
    refs = rows;
  } else {
    return { snapshotId: null, refs: [] };
  }

  const trackIds = refs.map((r) => r.id);
  const raw = JSON.stringify({
    type,
    contextId: contextId ?? null,
    userId: type === "LIKED" ? userId : null,
    trackIds,
  });
  const hash = createHash("sha256").update(raw).digest("hex");

  let snap = await db.playbackContextSnapshot.findUnique({ where: { hash } });

  if (snap) {
    return { snapshotId: snap.id, name, refs };
  }

  return await db.playbackContextSnapshot.create({
    data: {
      type,
      contextId,
      userId: type === "LIKED" ? userId : null,
      name,
      hash,
      items: {
        create: refs.map((r, i) => ({
          position: i,
          trackId: r.id,
          audioId: r.audioId,
        })),
      },
    },
    select: { id: true },
  });
};

export const resolveHistory = async (input: ResolveHistoryInput) => {
  const userId = await getUserIdOrThrow();
  const { snapshotId, trackId, sourceType, sourceId } = input;

  if (snapshotId) {
    const snap = await db.playbackContextSnapshot.findUniqueOrThrow({
      where: { id: snapshotId },
      include: { items: { orderBy: { position: "asc" } } },
    });
    const refs = snap.items.map((i) => ({ id: i.trackId, audioId: i.audioId }));
    const index = Math.max(
      0,
      refs.findIndex((r) => r.id === trackId)
    );

    return {
      refs,
      index,
      meta: {
        type: snap.type,
        contextId: snap.contextId ?? undefined,
        name: snap.name ?? undefined,
        snapshotId: snap.id,
      },
    };
  }
  return await snapshot(userId, { type: sourceType, contextId: sourceId });
};
