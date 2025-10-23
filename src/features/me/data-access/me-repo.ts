import "server-only";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { AwaitedReturnType } from "@/utils/type";
import { playlistItemSelect } from "@/features/playlist/data-access/playlist-select";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";
import { albumItemSelect } from "@/features/album/data-access/album-select";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from "@/features/playlist/data-access/playlist-repo";

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
          following: true,
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

export const getMyPlaylists = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const likedSongs = await db.playlist.findFirst({
    where: {
      userId,
      systemType: "LIKED_SONGS",
    },
    select: { ...playlistItemSelect },
  });

  const others = await db.playlist.findMany({
    where: {
      userId,
      NOT: {
        systemType: "LIKED_SONGS",
      },
    },
    select: { ...playlistItemSelect },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
  });

  const total = await db.playlist.count({
    where: {
      userId,
    },
  });

  const items = likedSongs
    ? [likedSongs, ...others.slice(0, limit - 1)]
    : others;

  return {
    items,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type MyPlaylists = AwaitedReturnType<typeof getMyPlaylists>;

export const getMyFollowers = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [users, total] = await Promise.all([
    db.userFollow
      .findMany({
        where: {
          followingId: userId,
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
        skip: offset,
        take: limit,
      })
      .then((data) => data.map((item) => item.following)),

    db.userFollow.count({
      where: {
        followingId: userId,
      },
    }),
  ]);

  return {
    items: users,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type MyFollowers = AwaitedReturnType<typeof getMyFollowers>;

export const getMyFollowedArtists = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { limit, offset } = params;

  const [artists, total] = await Promise.all([
    db.userFollowedArtist
      .findMany({
        where: {
          userId,
        },
        skip: offset,
        take: limit,
        select: {
          artist: {
            select: artistItemSelect,
          },
        },
        orderBy: {
          likedAt: "desc",
        },
      })
      .then((data) => data.map((item) => item.artist)),

    db.userFollowedArtist.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    items: artists,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type MyFollowedArtists = AwaitedReturnType<typeof getMyFollowedArtists>;

export const getMyFollowedUsers = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { limit, offset } = params;

  const [users, total] = await Promise.all([
    db.userFollow
      .findMany({
        where: {
          followerId: userId,
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
        take: limit,
        skip: offset,
        orderBy: {
          followedAt: "desc",
        },
      })
      .then((data) => data.map((item) => item.following)),

    db.userFollow.count({
      where: {
        followerId: userId,
      },
    }),
  ]);

  return {
    items: users,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type MyFollowedUsers = AwaitedReturnType<typeof getMyFollowedUsers>;

export const getMyLikedAlbums = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [albums, total] = await Promise.all([
    db.userLikedAlbum
      .findMany({
        where: {
          userId,
        },
        select: {
          album: {
            select: albumItemSelect,
          },
        },
        orderBy: {
          likedAt: "desc",
        },
        skip: offset,
        take: limit,
      })
      .then((data) => data.map((item) => item.album)),

    db.userLikedAlbum.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    items: albums,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type MyLikedAlbums = AwaitedReturnType<typeof getMyLikedAlbums>;

export const getMyLikedPlaylists = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [playlists, total] = await Promise.all([
    db.userLikedPlaylist
      .findMany({
        where: {
          userId,
        },
        select: {
          playlist: {
            select: playlistItemSelect,
          },
        },
        orderBy: {
          likedAt: "desc",
        },
        skip: offset,
        take: limit,
      })
      .then((data) => data.map((item) => item.playlist)),

    db.userLikedPlaylist.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    items: playlists,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type MyLikedPlaylists = AwaitedReturnType<typeof getMyLikedPlaylists>;

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

export const toggleLikeTrack = async ({
  userId,
  trackId,
}: {
  userId: string;
  trackId: string;
}) => {
  const likedPlaylist = await db.playlist.findFirstOrThrow({
    where: { userId, systemType: "LIKED_SONGS" },
  });

  const existing = await db.playlistTrack.findUnique({
    where: {
      playlistId_trackId: {
        playlistId: likedPlaylist.id,
        trackId,
      },
    },
  });

  if (existing) {
    await removeTrackFromPlaylist({
      playlistId: likedPlaylist.id,
      trackId,
    });
    return { isLiked: false };
  }

  await addTrackToPlaylist(likedPlaylist.id, trackId);
  return { isLiked: true };
};

export type ToggleLikeTrackOutput = AwaitedReturnType<typeof toggleLikeTrack>;
