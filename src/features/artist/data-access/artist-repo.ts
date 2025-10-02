import "server-only";
import { trackDetailSelect } from "@/features/track/data-access/track-select";
import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";

export const getSidebarArtists = async (userId: string) => {
  return await db.userFollowedArtist
    .findMany({
      where: {
        userId,
      },
      select: {
        artist: {
          select: {
            id: true,
            name: true,
            imageId: true,
          },
        },
      },
      orderBy: {
        likedAt: "desc",
      },
    })
    .then((data) => data.map((item) => item.artist));
};

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
                color: true,
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
          select: trackDetailSelect,
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
        },
      }),
    ]);

    return { popular, albums, singlesAndEps };
  });
};

export type ArtistReleases = AwaitedReturnType<typeof getArtistReleases>;
