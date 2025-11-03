import "server-only";
import { unstable_cache } from "next/cache";
import db from "../db";
import { AwaitedReturnType } from "@/utils/type";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { albumItemSelect } from "@/features/album/data-access/album-select";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { playlistItemSelect } from "@/features/playlist/data-access/playlist-select";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";

export const getMyOverview = unstable_cache(async (userId: string) => {
  return await db.user.findUniqueOrThrow({
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
});

export type MyOverview = AwaitedReturnType<typeof getMyOverview>;

export const getSidebarOverview = unstable_cache(
  async ({ userId, params }: { userId: string; params: PaginationParams }) => {
    const { offset, limit } = params;

    const [
      likedAlbums,
      likedAlbumTotal,
      likedPlaylists,
      likedPlaylistTotal,
      followedArtists,
      followedArtistTotal,
      myPlaylists,
      myPlaylistTotal,
    ] = await Promise.all([
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

      db.playlist.findMany({
        where: {
          userId,
          OR: [{ systemType: null }, { systemType: { not: "LIKED_TRACKS" } }],
        },
        select: { ...playlistItemSelect },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),

      db.playlist.count({
        where: {
          userId,
          OR: [{ systemType: null }, { systemType: { not: "LIKED_TRACKS" } }],
        },
      }),
    ]);

    return {
      likedAlbums: {
        items: likedAlbums,
        pagination: getPaginationMeta({
          limit,
          offset,
          total: likedAlbumTotal,
        }),
      },
      likedPlaylists: {
        items: likedPlaylists,
        pagination: getPaginationMeta({
          limit,
          offset,
          total: likedPlaylistTotal,
        }),
      },
      followedArtists: {
        items: followedArtists,
        pagination: getPaginationMeta({
          limit,
          offset,
          total: followedArtistTotal,
        }),
      },
      myPlaylists: {
        items: myPlaylists,
        pagination: getPaginationMeta({
          limit,
          offset,
          total: myPlaylistTotal,
        }),
      },
    };
  }
);

export type SidebarOverview = AwaitedReturnType<typeof getSidebarOverview>;

export const getMyLikedAlbums = unstable_cache(
  async ({ userId, params }: { userId: string; params: PaginationParams }) => {
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
  }
);

export type MyLikedAlbums = AwaitedReturnType<typeof getMyLikedAlbums>;

export const getMyLikedPlaylists = unstable_cache(
  async ({ userId, params }: { userId: string; params: PaginationParams }) => {
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
  }
);

export type MyLikedPlaylists = AwaitedReturnType<typeof getMyLikedPlaylists>;

export const getMyFollowedArtists = unstable_cache(
  async ({ userId, params }: { userId: string; params: PaginationParams }) => {
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
  }
);

export type MyFollowedArtists = AwaitedReturnType<typeof getMyFollowedArtists>;

export const getMyPlaylists = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const likedTracks = await db.playlist.findFirst({
    where: {
      userId,
      systemType: "LIKED_TRACKS",
    },
    select: { ...playlistItemSelect },
  });

  const others = await db.playlist.findMany({
    where: {
      userId,
      OR: [{ systemType: null }, { systemType: { not: "LIKED_TRACKS" } }],
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
      OR: [{ systemType: null }, { systemType: { not: "LIKED_TRACKS" } }],
    },
  });

  const items = likedTracks
    ? [likedTracks, ...others.slice(0, limit - 1)]
    : others;

  return {
    items,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type MyPlaylists = AwaitedReturnType<typeof getMyPlaylists>;

export const getMyFollowedUsers = unstable_cache(
  async ({ userId, params }: { userId: string; params: PaginationParams }) => {
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
  }
);

export type MyFollowedUsers = AwaitedReturnType<typeof getMyFollowedUsers>;
