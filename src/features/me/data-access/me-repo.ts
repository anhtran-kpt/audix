import "server-only";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { AwaitedReturnType } from "@/utils/type";
import { playlistItemSelect } from "@/features/playlist/data-access/playlist-select";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";
import { albumItemSelect } from "@/features/album/data-access/album-select";

export const getMyProfile = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      likedAlbums: {
        select: {
          album: {
            select: albumItemSelect,
          },
        },
      },
      playlists: {
        select: {
          imageId: true,
          isPublic: true,
          id: true,
          title: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      followedArtists: {
        select: {
          artist: {
            select: {
              id: true,
              imageId: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          playlists: true,
          followedArtists: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found!");
  }

  const artists = user.followedArtists.map((a) => a.artist);
  const albums = user.likedAlbums.map((a) => a.album);

  return { ...user, followedArtists: artists, likedAlbums: albums };
};

export type MyProfile = AwaitedReturnType<typeof getMyProfile>;

export const getMyBanner = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          playlists: true,
          followedArtists: true,
          followers: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found!");
  }

  return user;
};

export type MyBanner = AwaitedReturnType<typeof getMyBanner>;

export const getMyPlaylists = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      playlists: {
        select: { ...playlistItemSelect, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) throw new AppError("NOT_FOUND", "User not found");

  return user.playlists;
};

export type MyPlaylists = AwaitedReturnType<typeof getMyPlaylists>;

export const getMyFollowers = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
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
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  const users = user.followers.map((item) => item.follower);

  return users;
};

export type MyFollower = AwaitedReturnType<typeof getMyFollowers>[number];

export const getMyFollowedArtists = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
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

export type MyFollowedArtists = AwaitedReturnType<typeof getMyFollowedArtists>;

export const getMyFollowedUsers = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
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

  const users = user.following.map((u) => u.following);

  return users;
};

export type MyFollowedUser = AwaitedReturnType<
  typeof getMyFollowedUsers
>[number];

export const getMyLikedAlbums = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      likedAlbums: {
        select: {
          album: {
            select: albumItemSelect,
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

  const albums = user.likedAlbums.map((a) => a.album);

  return albums;
};

export type MyLikedAlbum = AwaitedReturnType<typeof getMyLikedAlbums>[number];

export const getMyLikedPlaylists = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      likedPlaylists: {
        select: {
          playlist: {
            select: playlistItemSelect,
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

  const playlists = user.likedPlaylists.map((a) => a.playlist);

  return playlists;
};

export type MyLikedPlaylist = AwaitedReturnType<
  typeof getMyLikedPlaylists
>[number];

export const getLikedPlaylistStatus = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      likedPlaylists: {
        select: {
          playlistId: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  return {
    isLiked: user.likedPlaylists
      .map((pl) => pl.playlistId)
      .includes(playlistId),
  };
};

export type LikedPlaylistStatus = AwaitedReturnType<
  typeof getLikedPlaylistStatus
>;

export const getLikedAlbumStatus = async ({
  userId,
  albumId,
}: {
  userId: string;
  albumId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      likedAlbums: {
        select: {
          albumId: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  return {
    isLiked: user.likedAlbums.map((pl) => pl.albumId).includes(albumId),
  };
};

export type LikedAlbumStatus = AwaitedReturnType<typeof getLikedAlbumStatus>;

export const likeAlbum = async ({
  userId,
  albumId,
}: {
  userId: string;
  albumId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  await db.userLikedAlbum.upsert({
    where: {
      userId_albumId: { userId, albumId },
    },
    update: {},
    create: { userId, albumId },
  });
};

export type LikeAlbumOutput = AwaitedReturnType<typeof likeAlbum>;

export const unlikeAlbum = async ({
  userId,
  albumId,
}: {
  userId: string;
  albumId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  await db.userLikedAlbum.deleteMany({
    where: { userId, albumId },
  });
};

export type UnlikeAlbumOutput = AwaitedReturnType<typeof unlikeAlbum>;

export const likePlaylist = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  await db.userLikedPlaylist.upsert({
    where: {
      userId_playlistId: { userId, playlistId },
    },
    update: {},
    create: { userId, playlistId },
  });
};

export type LikePlaylistOutput = AwaitedReturnType<typeof likePlaylist>;

export const unlikePlaylist = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  await db.userLikedPlaylist.deleteMany({
    where: { userId, playlistId },
  });
};

export type UnlikePlaylistOutput = AwaitedReturnType<typeof unlikePlaylist>;
