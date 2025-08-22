import { zCuidType } from "@/contracts/common";
import db from "@/lib/db";

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
