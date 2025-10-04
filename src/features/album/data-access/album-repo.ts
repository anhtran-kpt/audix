import "server-only";
import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";
import { AppError } from "@/lib/errors";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";

export const getAlbumDetail = async (albumId: string) => {
  const album = await db.album.findUnique({
    where: {
      id: albumId,
    },
    select: {
      artistId: true,
      imageId: true,
      title: true,
      albumType: true,
      releaseDate: true,
      totalTracks: true,
      duration: true,
      artist: {
        select: artistItemSelect,
      },
      id: true,
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

  return {
    ...album,
    tracks: album.tracks.map((track) => ({
      ...track,
      artists: track.artists.map((a) => a.artist),
    })),
  };
};

export type AlbumDetail = AwaitedReturnType<typeof getAlbumDetail>;

export const getSuggestionAlbums = async ({
  artistId,
  albumId,
}: {
  artistId: string;
  albumId: string;
}) => {
  return await db.album.findMany({
    where: {
      artistId,
      id: {
        not: albumId,
      },
    },
    include: {
      tracks: {
        select: {
          id: true,
          title: true,
          slug: true,
          audioId: true,
          duration: true,
          trackNumber: true,
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
      artist: {
        select: {
          id: true,
          name: true,
          imageId: true,
        },
      },
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export type SuggestionAlbums = AwaitedReturnType<typeof getSuggestionAlbums>;
