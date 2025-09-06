import { zCuidType } from "@/features/shared/contracts/shared-dto";
import db from "@/lib/db";
import { CreatePlaylistInput } from "@/features/playlist/contracts/playlist-dto";
import { trackItemSelect } from "@/features/track/data-access/track-selects";

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
  return await db.playlistItem.create({
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
        items: {
          select: {
            track: {
              select: trackItemSelect,
            },
          },
        },
      },
    })
    .then((data) => data.items.map((item) => item.track));
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
        items: {
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
      tracks: playlist.items.map((item) => item.track),
    }));
};
