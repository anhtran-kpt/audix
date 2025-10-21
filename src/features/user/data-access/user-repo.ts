import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";
import { AppError } from "@/lib/errors";
import { playlistItemSelect } from "@/features/playlist/data-access/playlist-select";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";

export const getUserBanner = async (targetUserId: string) => {
  const user = await db.user.findUnique({
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

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  return user;
};

export type UserBanner = AwaitedReturnType<typeof getUserBanner>;

export const getUserPlaylists = async (targetUserId: string) => {
  const user = await db.user.findUnique({
    where: { id: targetUserId },
    select: {
      playlists: {
        where: {
          isPublic: true,
        },
        select: { ...playlistItemSelect, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) throw new AppError("NOT_FOUND", "User not found");

  return user.playlists;
};

export type UserPlaylist = AwaitedReturnType<typeof getUserPlaylists>[number];

export const getUserFollowedArtists = async (targetUserId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      followedArtists: {
        select: {
          artist: {
            select: artistItemSelect,
          },
        },
        orderBy: {
          likedAt: "desc",
        },
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  const artists = user.followedArtists.map((a) => a.artist);

  return artists;
};

export type UserFollowedArtist = AwaitedReturnType<
  typeof getUserFollowedArtists
>[number];

export const getUserFollowedUsers = async (targetUserId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      following: {
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
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  const users = user.following.map((item) => item.following);

  return users;
};

export type UserFollowedUser = AwaitedReturnType<
  typeof getUserFollowedUsers
>[number];

export const getUserFollowers = async (targetUserId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      followers: {
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
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  const users = user.followers.map((item) => item.follower);

  return users;
};

export type UserFollower = AwaitedReturnType<typeof getUserFollowers>[number];

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
