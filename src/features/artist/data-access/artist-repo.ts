import "server-only";
import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";
import { artistItemSelect } from "./artist-select";
import { AppError } from "@/lib/errors";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { getUserIdOrThrow } from "@/lib/auth";
import { getFullTracks } from "@/features/track/data-access/track-repo";

export const getFollowStatus = async (userId: string, artistId: string) => {
  const [artist, link] = await Promise.all([
    db.artist.findUnique({
      where: { id: artistId },
      select: { followersCount: true },
    }),
    db.userFollowedArtist.findUnique({
      where: { userId_artistId: { userId, artistId } },
    }),
  ]);

  return { isFollowing: !!link, followersCount: artist?.followersCount ?? 0 };
};

export type FollowStatus = AwaitedReturnType<typeof getFollowStatus>;

export const followArtist = async (userId: string, artistId: string) => {
  return await db.$transaction(async (tx) => {
    const created = await tx.userFollowedArtist
      .create({ data: { userId, artistId } })
      .then(() => true)
      .catch(() => false);

    if (created) {
      await tx.artist.update({
        where: { id: artistId },
        data: { followersCount: { increment: 1 } },
      });
    }

    const { followersCount } = await tx.artist.findUniqueOrThrow({
      where: { id: artistId },
      select: { followersCount: true },
    });

    return { isFollowing: true as const, followersCount };
  });
};

export const unfollowArtist = async (userId: string, artistId: string) => {
  return await db.$transaction(async (tx) => {
    const del = await tx.userFollowedArtist.deleteMany({
      where: { userId, artistId },
    });

    if (del.count > 0) {
      await tx.artist.update({
        where: { id: artistId },
        data: { followersCount: { decrement: 1 } },
      });
    }

    const { followersCount } = await tx.artist.findUniqueOrThrow({
      where: { id: artistId },
      select: { followersCount: true },
    });

    return { isFollowing: false as const, followersCount };
  });
};

export const getArtistBanner = async (artistId: string) => {
  const artist = await db.artist.findUnique({
    where: {
      id: artistId,
    },
    select: {
      name: true,
      imageId: true,
      bannerId: true,
    },
  });

  if (!artist) {
    throw new AppError("NOT_FOUND", "Artist not found");
  }

  return artist;
};

export type ArtistBannerReturn = AwaitedReturnType<typeof getArtistBanner>;

export const getArtistPopularTracks = async (
  artistId: string,
  params: PaginationParams
) => {
  const { limit, offset } = params;
  const userId = await getUserIdOrThrow();

  const [artist, total] = await Promise.all([
    db.artist.findUniqueOrThrow({
      where: {
        id: artistId,
      },
      select: {
        tracks: {
          select: {
            trackId: true,
          },
          take: limit,
          skip: offset,
          orderBy: {
            track: {
              playCount: "asc",
            },
          },
        },
      },
    }),
    db.trackArtist.count({
      where: {
        artistId,
      },
    }),
  ]);

  console.log(artist.tracks);

  const fullTracks = await getFullTracks({
    userId,
    trackIds: artist.tracks.map((t) => t.trackId),
  });

  return {
    items: fullTracks,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type ArtistPopularTracksReturn = AwaitedReturnType<
  typeof getArtistPopularTracks
>;

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

export type ArtistDiscographyReturn = AwaitedReturnType<
  typeof getArtistDiscography
>;

export const getArtistAbout = async (artistId: string) => {
  const artist = await db.artist.findUnique({
    where: {
      id: artistId,
    },
    select: {
      name: true,
      bannerId: true,
      bio: true,
    },
  });

  if (!artist) {
    throw new AppError("NOT_FOUND", "Artist not found");
  }

  return artist;
};

export type ArtistAboutReturn = AwaitedReturnType<typeof getArtistAbout>;

export const getArtistSuggestions = async (
  artistId: string,
  paginationParams: PaginationParams
) => {
  const { limit, offset } = paginationParams;

  const artist = await db.artist.findUnique({
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

  if (!artist) {
    throw new AppError("NOT_FOUND", "Artist not found");
  }

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

export type ArtistSuggestionsReturn = AwaitedReturnType<
  typeof getArtistSuggestions
>;
