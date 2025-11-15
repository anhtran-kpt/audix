import "server-only";
import db from "../../lib/db";
import { authorizePlaylist } from "@/features/playlist/playlist-actions";
import { AppError } from "../../lib/errors";
import { trackItemSelect } from "@/features/track/track-selects";
import { shuffleArray } from "@/utils/array";
import { getFullTracksByIds } from "../track/track-data";

export const getPlaylistOverview = async ({
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
          track: {
            select: trackItemSelect,
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  const addedAtMap = new Map(
    playlist.tracks.map((t) => [t.track.id, t.addedAt])
  );

  const mergedTracks = playlist.tracks.map((pt) => ({
    ...pt.track,
    artists: pt.track.artists.map((ta) => ta.artist),
    addedAt: addedAtMap.get(pt.track.id) ?? null,
  }));

  return {
    tracks: mergedTracks,
    role: auth.role,
    canEdit: auth.canEdit,
    canView: auth.canView,
  };
};

export const getRecommendedTracks = async ({
  userId,
  playlistId,
  take = 5,
}: {
  userId: string;
  playlistId: string;
  take?: number;
}) => {
  const auth = await authorizePlaylist({ userId, playlistId });

  if (!auth.canView) throw new AppError("FORBIDDEN", "Forbidden");

  const playlist = await db.playlist.findUniqueOrThrow({
    where: { id: playlistId },
    select: {
      tracks: {
        select: {
          trackId: true,
          track: {
            select: {
              id: true,
              genres: { select: { genreId: true } },
            },
          },
        },
      },
    },
  });

  const trackIds = playlist.tracks.map((t) => t.track.id);
  const genreIds = [
    ...new Set(
      playlist.tracks.flatMap((t) => t.track.genres.map((g) => g.genreId))
    ),
  ];

  if (trackIds.length === 0) {
    const allTrackIds = await db.track.findMany({
      select: { id: true },
    });

    const randomIds = shuffleArray(allTrackIds)
      .slice(0, take)
      .map((t) => t.id);

    const fullTracks = await getFullTracksByIds(randomIds);

    return { tracks: fullTracks, ...auth };
  }

  const candidateIds = await db.track.findMany({
    where: {
      id: { notIn: trackIds },
      genres:
        genreIds.length > 0
          ? { some: { genreId: { in: genreIds } } }
          : undefined,
    },
    select: { id: true },
  });

  const shuffledCandidates = shuffleArray(candidateIds);
  const selectedIds = shuffledCandidates.slice(0, take).map((t) => t.id);

  if (selectedIds.length < take) {
    const missing = take - selectedIds.length;

    const fallbackIds = await db.track.findMany({
      where: {
        id: { notIn: [...trackIds, ...selectedIds] },
      },
      select: { id: true },
    });

    const shuffledFallback = shuffleArray(fallbackIds);
    const additionalIds = shuffledFallback.slice(0, missing).map((t) => t.id);

    selectedIds.push(...additionalIds);
  }

  const fullTracks = await getFullTracksByIds(selectedIds);

  return {
    tracks: fullTracks,
    ...auth,
  };
};
