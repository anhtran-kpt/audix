import { zCuidType } from "@/features/shared/contracts/shared-dto";
import db from "@/lib/db";
import { CreatePlaylistInput } from "@/features/playlist/contracts/playlist-dto";
import {
  recommendedTrackItemSelect,
  trackItemSelect,
} from "@/features/track/data-access/track-selects";

export const getSidebarPlaylists = async (userId: zCuidType) => {
  return await db.playlist.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      imageId: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createPlaylist = async (
  userId: zCuidType,
  input: CreatePlaylistInput
) => {
  return await db.playlist.create({
    data: {
      userId,
      description: input.description ?? null,
      ...input,
    },
    select: {
      id: true,
      title: true,
      imageId: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const addTrackToPlaylist = async (
  playlistId: zCuidType,
  trackId: zCuidType,
  position: number
) => {
  return await db.playlistTrack.create({
    data: {
      playlistId,
      trackId,
      position,
    },
  });
};

export const getPlaylistTracks = async (playlistId: zCuidType) => {
  return await db.playlist
    .findUniqueOrThrow({
      where: {
        id: playlistId,
      },
      select: {
        tracks: {
          select: {
            track: {
              select: trackItemSelect,
            },
          },
        },
      },
    })
    .then((data) => data.tracks.map((item) => item.track));
};

export const getPlaylistDetail = async (playlistId: zCuidType) => {
  return await db.playlist
    .findUniqueOrThrow({
      where: {
        id: playlistId,
      },
      select: {
        id: true,
        title: true,
        imageId: true,
        totalTracks: true,
        duration: true,
        isPublic: true,
        description: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tracks: {
          select: {
            track: {
              select: {
                id: true,
                title: true,
                duration: true,
                playCount: true,
                album: {
                  select: {
                    imageId: true,
                  },
                },
                artists: {
                  select: {
                    artist: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
                isExplicit: true,
              },
            },
          },
        },
      },
    })
    .then((playlist) => ({
      ...playlist,
      tracks: playlist.tracks.map((item) => item.track),
    }));
};

export const getRecommendedTracks = async (playlistId: zCuidType) => {
  const playlist = await db.playlist.findUniqueOrThrow({
    where: { id: playlistId },
    select: {
      tracks: {
        select: {
          track: {
            select: {
              id: true,
              genres: {
                select: {
                  genre: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const trackIds = playlist.tracks.map((t) => t.track.id);

  if (playlist.tracks.length === 0) {
    return db.track.findMany({
      select: recommendedTrackItemSelect,
      orderBy: { playCount: "desc" },
      take: 5,
    });
  }

  const genreIds = playlist.tracks.flatMap((t) =>
    t.track.genres.map((g) => g.genre.id)
  );

  if (genreIds.length === 0) {
    return db.track.findMany({
      where: { id: { notIn: trackIds } },
      select: recommendedTrackItemSelect,
      orderBy: { playCount: "desc" },
      take: 5,
    });
  }

  const genreCount: Record<string, number> = {};
  for (const g of genreIds) {
    genreCount[g] = (genreCount[g] ?? 0) + 1;
  }

  const topGenreIds = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => id);

  return db.track.findMany({
    where: {
      id: { notIn: trackIds },
      genres: { some: { genreId: { in: topGenreIds } } },
    },
    select: recommendedTrackItemSelect,
    orderBy: { playCount: "desc" },
    take: 5,
  });
};
