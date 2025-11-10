import "server-only";
import db from "../../lib/db";
import { AwaitedReturnType } from "@/utils/type";
import { PaginationParams } from "@/features/shared/shared-types";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { playlistItemSelect } from "@/features/playlist/playlist-selects";
import { artistItemSelect } from "@/features/artist/artist-selects";
import { DEFAULT_USER_PLAYLIST_TYPE } from "../../lib/constants";
import { albumItemSelect } from "@/features/album/album-selects";

export const getMyOverview = async (userId: string) => {
  return await db.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          playlists: {
            where: {
              isPublic: true,
              isSystem: false,
              OR: [
                { systemType: null },
                { systemType: { not: DEFAULT_USER_PLAYLIST_TYPE } },
              ],
            },
          },
          followedArtists: true,
        },
      },
    },
  });
};

export type MyOverview = AwaitedReturnType<typeof getMyOverview>;

export const getSidebarOverview = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [
    favoriteSongsPlaylist,
    likedAlbums,
    likedAlbumTotal,
    likedPlaylists,
    likedPlaylistTotal,
    followedArtists,
    followedArtistTotal,
    myPlaylists,
    myPlaylistTotal,
  ] = await Promise.all([
    db.playlist.findFirstOrThrow({
      where: {
        userId,
        systemType: DEFAULT_USER_PLAYLIST_TYPE,
      },
      select: {
        ...playlistItemSelect,
        systemType: true,
        totalTracks: true,
      },
    }),

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
        OR: [
          { systemType: null },
          { systemType: { not: DEFAULT_USER_PLAYLIST_TYPE } },
        ],
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
        OR: [
          { systemType: null },
          { systemType: { not: DEFAULT_USER_PLAYLIST_TYPE } },
        ],
      },
    }),
  ]);

  return {
    favoriteSongsPlaylist,
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
};

export type SidebarOverview = AwaitedReturnType<typeof getSidebarOverview>;

export const getLikedAlbumStatus = async ({
  userId,
  albumId,
}: {
  userId: string;
  albumId: string;
}) => {
  const user = await db.user.findUniqueOrThrow({
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

  return {
    isLiked: user.likedAlbums.map((pl) => pl.albumId).includes(albumId),
  };
};

export type LikedAlbumStatus = AwaitedReturnType<typeof getLikedAlbumStatus>;

export const getLikedPlaylistStatus = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const user = await db.user.findUniqueOrThrow({
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

  return {
    isLiked: user.likedPlaylists
      .map((pl) => pl.playlistId)
      .includes(playlistId),
  };
};

export type LikedPlaylistStatus = AwaitedReturnType<
  typeof getLikedPlaylistStatus
>;

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

export const getMyPlaylists = async ({
  userId,
  params,
}: {
  userId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [items, total] = await Promise.all([
    db.playlist.findMany({
      where: {
        userId,
        OR: [
          { systemType: null },
          { systemType: { not: DEFAULT_USER_PLAYLIST_TYPE } },
        ],
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
        OR: [
          { systemType: null },
          { systemType: { not: DEFAULT_USER_PLAYLIST_TYPE } },
        ],
      },
    }),
  ]);

  return {
    items,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type MyPlaylists = AwaitedReturnType<typeof getMyPlaylists>;

export const getMyFavoriteSongsPlaylist = async (userId: string) => {
  return await db.playlist.findFirstOrThrow({
    where: {
      userId,
      systemType: DEFAULT_USER_PLAYLIST_TYPE,
    },
    select: {
      ...playlistItemSelect,
      systemType: true,
      totalTracks: true,
    },
  });
};

export type MyFavoriteSongsPlaylist = AwaitedReturnType<
  typeof getMyFavoriteSongsPlaylist
>;

export const getMyLikedTrackIds = async (userId: string) => {
  const playlist = await db.playlist.findFirstOrThrow({
    where: {
      userId,
      systemType: DEFAULT_USER_PLAYLIST_TYPE,
      isSystem: true,
    },
    select: {
      tracks: {
        select: {
          trackId: true,
        },
      },
    },
  });

  return Object.fromEntries(playlist.tracks.map((t) => [t.trackId, true]));
};

export const getMyFollowedArtistIds = async (userId: string) => {
  const followedArtists = await db.userFollowedArtist.findMany({
    where: {
      userId,
    },
    select: {
      artistId: true,
    },
  });

  return Object.fromEntries(followedArtists.map((a) => [a.artistId, true]));
};

export const getMyLikedAlbumIds = async (userId: string) => {
  const likedAlbums = await db.userLikedAlbum.findMany({
    where: {
      userId,
    },
    select: {
      albumId: true,
    },
  });

  return Object.fromEntries(likedAlbums.map((a) => [a.albumId, true]));
};

export const getMyLikedPlaylistIds = async (userId: string) => {
  const likedPlaylists = await db.userLikedPlaylist.findMany({
    where: {
      userId,
    },
    select: {
      playlistId: true,
    },
  });

  return Object.fromEntries(likedPlaylists.map((a) => [a.playlistId, true]));
};
