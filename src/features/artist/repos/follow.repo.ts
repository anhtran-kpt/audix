import prisma from "@/lib/db";

export const followRepo = {
  isFollowing(userId: string, artistId: string) {
    return prisma.userLikedArtist
      .findUnique({
        where: { userId_artistId: { userId, artistId } },
        select: { userId: true },
      })
      .then(Boolean);
  },
  async follow(userId: string, artistId: string) {
    try {
      await prisma.userLikedArtist.create({ data: { userId, artistId } });
      return true;
    } catch (e: any) {
      if (e?.code === "P2002") return true;
      throw e;
    }
  },

  async unfollow(userId: string, artistId: string) {
    return prisma.userLikedArtist
      .deleteMany({ where: { userId, artistId } })
      .then(() => true);
  },

  followersCount(artistId: string) {
    return prisma.userLikedArtist.count({ where: { artistId } });
  },
};
