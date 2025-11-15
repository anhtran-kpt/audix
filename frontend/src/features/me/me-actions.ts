"use server";

import db from "@/lib/db";
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from "@/features/playlist/playlist-actions";
import { DEFAULT_USER_PLAYLIST_TYPE } from "@/lib/constants";
import { getUserIdOrThrow } from "@/lib/auth";

export const likeAlbum = async (albumId: string) => {
  const userId = await getUserIdOrThrow();

  await db.userLikedAlbum.upsert({
    where: {
      userId_albumId: { userId, albumId },
    },
    update: {},
    create: { userId, albumId },
  });
};

export const unlikeAlbum = async (albumId: string) => {
  const userId = await getUserIdOrThrow();

  await db.userLikedAlbum.deleteMany({
    where: { userId, albumId },
  });
};

export const likePlaylist = async (playlistId: string) => {
  const userId = await getUserIdOrThrow();

  await db.userLikedPlaylist.upsert({
    where: {
      userId_playlistId: { userId, playlistId },
    },
    update: {},
    create: { userId, playlistId },
  });
};

export const unlikePlaylist = async (playlistId: string) => {
  const userId = await getUserIdOrThrow();

  await db.userLikedPlaylist.deleteMany({
    where: { userId, playlistId },
  });
};

export const toggleLikeTrack = async (trackId: string) => {
  const userId = await getUserIdOrThrow();

  const likedPlaylist = await db.playlist.findFirstOrThrow({
    where: { userId, systemType: DEFAULT_USER_PLAYLIST_TYPE },
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

  await addTrackToPlaylist({ playlistId: likedPlaylist.id, trackId });
  return { isLiked: true };
};
