import "server-only";
import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";
import { trackItemSelect } from "@/features/track/data-access/track-select";
import { artistItemSelect } from "./artist-select";
import { AppError } from "@/lib/errors";

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

export const getArtistDetailPage = async (artistId: string) => {
  const artist = await db.artist
    .findUniqueOrThrow({
      where: {
        id: artistId,
      },
      select: {
        name: true,
        isVerified: true,
        imageId: true,
        bannerId: true,
        bio: true,
        followersCount: true,
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
    })
    .then((data) => ({
      ...data,
      genres: data.genres.map((data) => data.genre),
    }));

  const popularTracks = await db.trackArtist
    .findMany({
      where: {
        artistId,
      },
      select: {
        track: {
          select: trackItemSelect,
        },
      },
      orderBy: {
        track: {
          playCount: "desc",
        },
      },
    })
    .then((tracks) =>
      tracks.map((item) => ({
        ...item.track,
        artists: item.track.artists.map((a) => a.artist),
      }))
    );

  const genreIds = artist.genres.map((genre) => genre.id);

  const candidates = await db.artist.findMany({
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
  });

  const suggestions = candidates
    .map((a) => ({
      a,
      overlap: a.genres.filter((g) => genreIds.includes(g.genreId)).length,
    }))
    .sort((x, y) => y.overlap - x.overlap)
    .slice(0, 5)
    .map((x) => ({
      id: x.a.id,
      imageId: x.a.imageId,
      name: x.a.name,
    }));

  return {
    artist,
    popularTracks,
    suggestions,
  };
};

export const getArtistBanner = async (artistId: string) => {
  const artist = await db.artist.findUnique({
    where: {
      id: artistId,
    },
    select: {
      name: true,
      imageId: true,
      isVerified: true,
    },
  });

  if (!artist) {
    throw new AppError("NOT_FOUND", "Artist not found");
  }

  return artist;
};

export type ArtistBannerReturn = AwaitedReturnType<typeof getArtistBanner>;

export type ArtistDetailPage = AwaitedReturnType<typeof getArtistDetailPage>;

export const getArtistReleases = async (artistId: string, take = 12) => {
  return db.$transaction(async (tx) => {
    const [popular, albums, singlesAndEps] = await Promise.all([
      tx.album.findMany({
        where: { artistId },
        orderBy: [
          { likedBy: { _count: "desc" } },
          { releaseDate: "desc" },
          { id: "desc" },
        ],
        take,
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
        take,
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
        orderBy: [{ releaseDate: "desc" }, { id: "desc" }],
        take,
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
  });
};

export type ArtistReleases = AwaitedReturnType<typeof getArtistReleases>;
