import "server-only";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { AwaitedReturnType } from "@/utils/type";
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from "@/features/playlist/data-access/playlist-repo";

export const likeAlbum = async ({
  userId,
  albumId,
}: {
  userId: string;
  albumId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  await db.userLikedAlbum.upsert({
    where: {
      userId_albumId: { userId, albumId },
    },
    update: {},
    create: { userId, albumId },
  });
};

export type LikeAlbumOutput = AwaitedReturnType<typeof likeAlbum>;

export const unlikeAlbum = async ({
  userId,
  albumId,
}: {
  userId: string;
  albumId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  await db.userLikedAlbum.deleteMany({
    where: { userId, albumId },
  });
};

export type UnlikeAlbumOutput = AwaitedReturnType<typeof unlikeAlbum>;

export const likePlaylist = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  await db.userLikedPlaylist.upsert({
    where: {
      userId_playlistId: { userId, playlistId },
    },
    update: {},
    create: { userId, playlistId },
  });
};

export type LikePlaylistOutput = AwaitedReturnType<typeof likePlaylist>;

export const unlikePlaylist = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  await db.userLikedPlaylist.deleteMany({
    where: { userId, playlistId },
  });
};

export type UnlikePlaylistOutput = AwaitedReturnType<typeof unlikePlaylist>;

export const toggleLikeTrack = async ({
  userId,
  trackId,
}: {
  userId: string;
  trackId: string;
}) => {
  const likedPlaylist = await db.playlist.findFirstOrThrow({
    where: { userId, systemType: "LIKED_TRACKS" },
  });

  const existing = await db.playlistTrack.findUnique({
    where: {
      playlistId_trackId: {
        playlistId: likedPlaylist.id,
        trackId,
      },
    },
  });

  if (existing) {
    await removeTrackFromPlaylist({
      playlistId: likedPlaylist.id,
      trackId,
    });
    return { isLiked: false };
  }

  await addTrackToPlaylist(likedPlaylist.id, trackId);
  return { isLiked: true };
};

export type ToggleLikeTrackOutput = AwaitedReturnType<typeof toggleLikeTrack>;
