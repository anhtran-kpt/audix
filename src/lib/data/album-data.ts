import "server-only";
import db from "../db";
import { AwaitedReturnType } from "@/utils/type";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { albumItemSelect } from "@/features/album/data-access/album-select";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { trackItemSelect } from "@/features/track/data-access/track-select";

export const getAlbumOverview = async ({
  albumId,
  userId,
}: {
  albumId: string;
  userId: string;
}) => {
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

  const isLiked = await db.userLikedAlbum
    .findUnique({
      where: { userId_albumId: { userId, albumId } },
    })
    .then((data) => !!data);

  return {
    ...album,
    tracks: album.tracks.map((track) => ({
      ...track,
      artists: track.artists.map((ta) => ta.artist),
    })),
    isLiked: isLiked,
  };
};

export type AlbumOverview = AwaitedReturnType<typeof getAlbumOverview>;

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

export type RelatedAlbums = AwaitedReturnType<typeof getRelatedAlbums>;

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

export type AlbumNewReleases = AwaitedReturnType<typeof getAlbumNewReleases>;

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

export type PopularAlbums = AwaitedReturnType<typeof getPopularAlbums>;
