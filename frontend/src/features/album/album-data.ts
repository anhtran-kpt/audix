import "server-only";
import db from "@/lib/db";
import { PaginationParams } from "@/features/shared/shared-types";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { trackItemSelect } from "@/features/track/track-selects";
import { albumItemSelect } from "./album-selects";

export const getAllAlbums = async () => {
  return await db.album.findMany({
    select: {
      id: true,
    },
  });
};

export const getAlbumOverview = async (albumId: string) => {
  const album = await db.album.findUniqueOrThrow({
    where: { id: albumId },
    select: {
      id: true,
      imageId: true,
      title: true,
      albumType: true,
      releaseDate: true,
      artist: {
        select: {
          name: true,
          id: true,
          imageId: true,
        },
      },
      totalTracks: true,
      duration: true,
      tracks: {
        select: trackItemSelect,
        orderBy: {
          trackNumber: "asc",
        },
      },
    },
  });

  return {
    ...album,
    tracks: album.tracks.map((track) => ({
      ...track,
      artists: track.artists.map((ta) => ta.artist),
    })),
  };
};

export const getRelatedAlbums = async (
  albumId: string,
  params: PaginationParams
) => {
  const { offset, limit } = params;

  const album = await db.album.findUniqueOrThrow({
    where: {
      id: albumId,
    },
    select: {
      artist: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const [items, total] = await Promise.all([
    db.album.findMany({
      where: {
        artistId: album.artist.id,
        id: {
          not: albumId,
        },
      },
      select: albumItemSelect,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    db.album.count({
      where: {
        artistId: album.artist.id,
        id: {
          not: albumId,
        },
      },
    }),
  ]);

  return {
    artist: album.artist,
    items,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export const getAlbumNewReleases = async (params: PaginationParams) => {
  const { offset, limit } = params;

  const [items, total] = await Promise.all([
    db.album.findMany({
      select: albumItemSelect,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    db.album.count(),
  ]);

  return {
    items,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export const getPopularAlbums = async (params: PaginationParams) => {
  const { offset, limit } = params;

  const [items, total] = await Promise.all([
    db.album.findMany({
      select: albumItemSelect,
      take: limit,
      orderBy: {
        likedBy: {
          _count: "desc",
        },
      },
    }),

    db.album.count(),
  ]);

  return {
    items,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};
