import "server-only";
import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";
import { AppError } from "@/lib/errors";
import { playlistItemSelect } from "@/features/playlist/data-access/playlist-select";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { getPaginationMeta } from "@/types/get-pagination-meta";

export const getUserOverview = async (targetUserId: string) => {
  return await db.user.findUniqueOrThrow({
    where: {
      id: targetUserId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          playlists: true,
          followedArtists: true,
          followers: true,
          following: true,
        },
      },
    },
  });
};

export type UserOverview = AwaitedReturnType<typeof getUserOverview>;

export const getUserPlaylists = async ({
  targetUserId,
  params,
}: {
  targetUserId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [playlists, total] = await Promise.all([
    db.playlist.findMany({
      where: { userId: targetUserId, isPublic: true },
      select: playlistItemSelect,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),

    db.playlist.count({
      where: { userId: targetUserId },
    }),
  ]);

  return {
    items: playlists,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type UserPlaylists = AwaitedReturnType<typeof getUserPlaylists>;

export const getUserFollowedArtists = async ({
  targetUserId,
  params,
}: {
  targetUserId: string;
  params: PaginationParams;
}) => {
  const { limit, offset } = params;

  const [artists, total] = await Promise.all([
    db.userFollowedArtist
      .findMany({
        where: {
          userId: targetUserId,
        },
        select: {
          artist: {
            select: artistItemSelect,
          },
        },
        skip: offset,
        take: limit,
      })
      .then((data) => data.map((item) => item.artist)),

    db.userFollowedArtist.count({
      where: {
        userId: targetUserId,
      },
    }),
  ]);

  return {
    items: artists,
    pagination: getPaginationMeta({ offset, limit, total }),
  };
};

export type UserFollowedArtists = AwaitedReturnType<
  typeof getUserFollowedArtists
>;

export const getUserFollowedUsers = async ({
  targetUserId,
  params,
}: {
  targetUserId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [users, total] = await Promise.all([
    db.userFollow
      .findMany({
        where: {
          followingId: targetUserId,
        },
        select: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          followedAt: "desc",
        },
        skip: offset,
        take: limit,
      })
      .then((data) => data.map((item) => item.following)),

    db.userFollow.count({
      where: {
        followingId: targetUserId,
      },
    }),
  ]);

  return {
    items: users,
    pagination: getPaginationMeta({ offset, limit, total }),
  };
};

export type UserFollowedUsers = AwaitedReturnType<typeof getUserFollowedUsers>;

export const getUserFollowers = async ({
  targetUserId,
  params,
}: {
  targetUserId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [users, total] = await Promise.all([
    db.userFollow
      .findMany({
        where: {
          followerId: targetUserId,
        },
        select: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          followedAt: "desc",
        },
      })
      .then((data) => data.map((item) => item.follower)),

    db.userFollow.count({
      where: {
        followerId: targetUserId,
      },
    }),
  ]);

  return {
    items: users,
    pagination: getPaginationMeta({ offset, limit, total }),
  };
};

export type UserFollowers = AwaitedReturnType<typeof getUserFollowers>;

export const getFollowStatus = async ({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  const isFollowing = !!(await db.userFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetUserId,
      },
    },
  }));

  return { isFollowing };
};

export type FollowStatus = AwaitedReturnType<typeof getFollowStatus>;

export const followUser = async ({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) => {
  await db.userFollow
    .create({ data: { followerId: userId, followingId: targetUserId } })
    .then(() => true)
    .catch(() => false);

  return { isFollowing: true };
};

export const unfollowUser = async ({
  userId,
  targetUserId,
}: {
  userId: string;
  targetUserId: string;
}) => {
  await db.userFollow.deleteMany({
    where: { followerId: userId, followingId: targetUserId },
  });

  return { isFollowing: false };
};
