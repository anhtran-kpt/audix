import "server-only";
import db from "../../lib/db";

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
