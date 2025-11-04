import "server-only";
import db from "../db";
import { AwaitedReturnType } from "@/utils/type";
import { getFullTracks } from "@/features/track/data-access/track-repo";
import { authorizePlaylist } from "@/features/playlist/data-access/playlist-repo";
import { AppError } from "../errors";

export const getPlaylistBanner = async ({
  playlistId,
  userId,
}: {
  playlistId: string;
  userId: string;
}) => {
  const auth = await authorizePlaylist({ userId, playlistId });

  if (!auth.canView) {
    throw new AppError("FORBIDDEN", "Forbidden");
  }

  const playlist = await db.playlist.findUniqueOrThrow({
    where: { id: playlistId },
    select: {
      id: true,
      title: true,
      imageId: true,
      totalTracks: true,
      duration: true,
      isPublic: true,
      description: true,
      systemType: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const isLiked = await db.userLikedPlaylist
    .findUnique({
      where: { userId_playlistId: { userId, playlistId } },
    })
    .then((data) => !!data);

  return {
    ...playlist,
    isLiked: isLiked,
    role: auth.role,
    canEdit: auth.canEdit,
    canView: auth.canView,
  };
};

export type PlaylistBanner = AwaitedReturnType<typeof getPlaylistBanner>;

export const getPlaylistTracks = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const auth = await authorizePlaylist({ userId, playlistId });

  if (!auth.canView) {
    throw new AppError("FORBIDDEN", "Forbidden");
  }

  const playlist = await db.playlist.findUniqueOrThrow({
    where: {
      id: playlistId,
    },
    select: {
      tracks: {
        select: {
          addedAt: true,
          trackId: true,
        },
        orderBy: { position: "asc" },
      },
    },
  });

  const fullTracks = await getFullTracks({
    userId,
    trackIds: playlist.tracks.map((t) => t.trackId),
  });

  const addedAtMap = new Map(
    playlist.tracks.map((t) => [t.trackId, t.addedAt])
  );

  const mergedTracks = fullTracks.map((track) => ({
    ...track,
    addedAt: addedAtMap.get(track.id) ?? null,
  }));

  return {
    tracks: mergedTracks,
    role: auth.role,
    canEdit: auth.canEdit,
    canView: auth.canView,
  };
};

export type PlaylistTracks = AwaitedReturnType<typeof getPlaylistTracks>;
