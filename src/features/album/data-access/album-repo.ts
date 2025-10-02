import "server-only";
import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";

export const getAlbumDetail = async (albumId: string) => {
  return await db.album.findUniqueOrThrow({
    where: {
      id: albumId,
    },
    include: {
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
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
      artist: {
        select: {
          id: true,
          name: true,
          imageId: true,
        },
      },
    },
  });
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
