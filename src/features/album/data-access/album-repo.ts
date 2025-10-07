import "server-only";
import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";
import { AppError } from "@/lib/errors";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { albumItemSelect } from "./album-select";

export const getAlbumBanner = async (albumId: string) => {
  const album = await db.album.findUnique({
    where: {
      id: albumId,
    },
    select: {
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
    },
  });

  if (!album) {
    throw new AppError("NOT_FOUND", "Album not found");
  }

  return album;
};

export type AlbumBanner = AwaitedReturnType<typeof getAlbumBanner>;

export const getAlbumTracks = async (albumId: string) => {
  const album = await db.album.findUnique({
    where: {
      id: albumId,
    },
    select: {
      tracks: {
        select: {
          id: true,
          title: true,
          audioId: true,
          duration: true,
          isExplicit: true,
          playCount: true,
          album: {
            select: {
              artistId: true,
              id: true,
              imageId: true,
              title: true,
            },
          },
          artists: {
            select: {
              artist: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!album) {
    throw new AppError("NOT_FOUND", "Album not found");
  }

  return album.tracks.map((track) => ({
    ...track,
    artists: track.artists.map((a) => a.artist),
  }));
};

export type AlbumTracks = AwaitedReturnType<typeof getAlbumTracks>;

export const getAlbumSuggestions = async (
  albumId: string,
  params: PaginationParams
) => {
  const { offset, limit } = params;

  const album = await db.album.findUnique({
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

  if (!album) {
    throw new AppError("NOT_FOUND", "Album not found");
  }

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

export type AlbumSuggestions = AwaitedReturnType<typeof getAlbumSuggestions>;
