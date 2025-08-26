import { zCuidType } from "@/contracts/common";
import db from "@/lib/db";
import { trackDetailSelect } from "../track/presets";

export const getSidebarArtists = async (userId: zCuidType) => {
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
    })
    .then((data) => data.map((item) => item.artist));
};

export const getFollowStatus = async (
  userId: zCuidType,
  artistId: zCuidType
) => {
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

export const followArtist = async (userId: zCuidType, artistId: zCuidType) => {
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

export const unfollowArtist = async (
  userId: zCuidType,
  artistId: zCuidType
) => {
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

export const getArtistDetailPage = async (artistId: zCuidType) => {
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
        tracks: {
          select: {
            track: {
              select: trackDetailSelect,
            },
          },
          take: 5,
        },
      },
    })
    .then((artist) => ({
      ...artist,
      genres: artist.genres.map((data) => data.genre),
      tracks: artist.tracks.map((data) => data.track),
    }));

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
    suggestions,
  };
};

export const getArtistReleases = async (artistId: string, take = 12) => {
  return db.$transaction(async (tx) => {
    const [popular, albums, singlesAndEps] = await Promise.all([
      tx.album.findMany({
        where: { artistId },
        orderBy: [
          { likedBy: { _count: "desc" } },
          { releaseDate: "desc" },
          { id: "desc" }, // phá tie để ổn định
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
