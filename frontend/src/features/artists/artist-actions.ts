"use server";

import { getUserIdOrThrow } from "@/lib/auth";
import db from "@/lib/db";

export const followArtist = async (artistId: string) => {
  const userId = await getUserIdOrThrow();

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
  });
};

export const unfollowArtist = async (artistId: string) => {
  const userId = await getUserIdOrThrow();

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
  });
};
