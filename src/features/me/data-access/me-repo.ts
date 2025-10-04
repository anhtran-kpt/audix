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

  return { ...user, followedArtists: artists };
};

export type MyProfile = AwaitedReturnType<typeof getMyProfile>;

export const getLibraryPlaylists = async (userId: string) => {
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
          likedAt: true,
        },
        orderBy: {
          likedAt: "desc",
        },
      },
      playlists: {
        select: { ...playlistItemSelect, createdAt: true },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found");
  }

  const liked = user.likedPlaylists.map((lp) => ({
    playlist: lp.playlist,
    date: lp.likedAt,
  }));

  const owned = user.playlists.map((p) => ({
    playlist: p,
    date: p.createdAt,
  }));

  const merged = [...liked, ...owned].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return merged.map((item) => item.playlist);
};

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
