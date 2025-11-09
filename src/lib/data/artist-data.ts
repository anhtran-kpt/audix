import "server-only";
import db from "../db";
import { AwaitedReturnType } from "@/utils/type";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { trackItemSelect } from "@/features/track/data-access/track-select";
import { AppError } from "../errors";

export const getArtistOverview = async ({
  artistId,
  userId,
}: {
  artistId: string;
  userId: string;
}) => {
  const artist = await db.artist.findUnique({
    where: { id: artistId },
    select: {
      id: true,
      name: true,
      imageId: true,
      followersCount: true,
      bannerId: true,
      bio: true,
      tracks: {
        select: {
          track: {
            select: trackItemSelect,
          },
        },
        take: 5,
        orderBy: {
          track: {
            playCount: "desc",
          },
        },
      },
    },
  });

  if (!artist) {
    throw new AppError("NOT_FOUND", "Artist not found!");
  }

  const isFollowed = await db.userFollowedArtist
    .findUnique({
      where: { userId_artistId: { userId, artistId } },
    })
    .then((link) => !!link);

  return {
    ...artist,
    tracks: artist.tracks
      .map((at) => at.track)
      .map((track) => ({
        ...track,
        artists: track.artists.map((ta) => ta.artist),
      })),
    isFollowing: isFollowed,
    followersCount: artist.followersCount,
  };
};

export type ArtistOverview = AwaitedReturnType<typeof getArtistOverview>;

export const getArtistDiscography = async (
  artistId: string,
  paginationParams: PaginationParams
) => {
  const { limit, offset } = paginationParams;

  const [items, total] = await Promise.all([
    db.$transaction(async (tx) => {
      const [popular, albums, singlesAndEps] = await Promise.all([
        tx.album.findMany({
          where: { artistId },
          orderBy: [
            { likedBy: { _count: "desc" } },
            { releaseDate: "desc" },
            { id: "desc" },
          ],
          take: limit,
          select: {
            id: true,
            title: true,
            imageId: true,
            albumType: true,
            releaseDate: true,
            artist: {
              select: artistItemSelect,
            },
            _count: { select: { likedBy: true } },
          },
        }),

        tx.album.findMany({
          where: { artistId, albumType: "ALBUM" },
          orderBy: [{ releaseDate: "desc" }, { id: "desc" }],
          take: limit,
          select: {
            id: true,
            title: true,
            imageId: true,
            albumType: true,
            releaseDate: true,
            artist: {
              select: artistItemSelect,
            },
          },
        }),

        tx.album.findMany({
          where: { artistId, albumType: { in: ["SINGLE", "EP"] } },
          take: limit,
          orderBy: [{ releaseDate: "desc" }, { id: "desc" }],
          select: {
            id: true,
            title: true,
            imageId: true,
            albumType: true,
            releaseDate: true,
            artist: {
              select: artistItemSelect,
            },
          },
        }),
      ]);

      return { popular, albums, singlesAndEps };
    }),

    db.album.count({
      where: { artistId },
    }),
  ]);

  return { items, pagination: getPaginationMeta({ limit, offset, total }) };
};

export type ArtistDiscography = AwaitedReturnType<typeof getArtistDiscography>;

export const getRelatedArtists = async (
  artistId: string,
  paginationParams: PaginationParams
) => {
  const { limit, offset } = paginationParams;

  const artist = await db.artist.findUniqueOrThrow({
    where: {
      id: artistId,
    },
    select: {
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  const genreIds = artist.genres.map(({ genre }) => genre.id);

  const [candidates, total] = await Promise.all([
    db.artist.findMany({
      where: {
        id: { not: artistId },
        genres: { some: { genreId: { in: genreIds } } },
      },
      take: 20,
      select: {
        id: true,
        name: true,
        imageId: true,
        genres: { select: { genreId: true } },
      },
    }),

    db.artist.count({
      where: {
        id: { not: artistId },
        genres: { some: { genreId: { in: genreIds } } },
      },
    }),
  ]);

  const items = candidates
    .map((a) => ({
      a,
      overlap: a.genres.filter((g) => genreIds.includes(g.genreId)).length,
    }))
    .sort((x, y) => y.overlap - x.overlap)
    .slice(0, limit)
    .map((x) => ({
      id: x.a.id,
      imageId: x.a.imageId,
      name: x.a.name,
    }));

  return { items, pagination: getPaginationMeta({ limit, offset, total }) };
};

export type RelatedArtists = AwaitedReturnType<typeof getRelatedArtists>;

export const getHotArtists = async (params: PaginationParams) => {
  const { offset, limit } = params;

  const [items, total] = await Promise.all([
    db.artist.findMany({
      select: artistItemSelect,
      take: limit,
      orderBy: {
        followersCount: "desc",
      },
    }),

    db.artist.count(),
  ]);

  return {
    items,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type HotArtists = AwaitedReturnType<typeof getHotArtists>;

export const getArtistFollowersCount = async (
  userId: string,
  artistId: string
) => {
  const artist = await db.artist.findUniqueOrThrow({
    where: { id: artistId },
    select: { followersCount: true },
  });

  return artist.followersCount;
};

export type ArtistFollowersCount = AwaitedReturnType<
  typeof getArtistFollowersCount
>;
