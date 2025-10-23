import db from "@/lib/db";
import {
  CreatePlaylistInput,
  UpdatePlaylistInput,
} from "@/features/playlist/contracts/playlist-dto";
import { trackItemSelect } from "@/features/track/data-access/track-select";
import { Prisma } from "@/app/generated/prisma";
import cloudinary from "@/lib/config/cloudinary";
import { buildPlaylistCoverUrl } from "@/utils/string";
import { AwaitedReturnType } from "@/utils/type";
import { AppError } from "@/lib/errors";
import { attachIsLikedToTracks } from "@/lib/services/liked-decorator";

export const authorizePlaylist = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    select: {
      id: true,
      title: true,
      userId: true,
      isPublic: true,
    },
  });

  if (!playlist) {
    return {
      playlist: null,
      role: "NONE",
      canView: false,
      canEdit: false,
    };
  }

  const isOwner = userId && playlist.userId === userId;

  if (isOwner) {
    return {
      playlist,
      role: "OWNER",
      canView: true,
      canEdit: true,
    };
  }

  if (playlist.isPublic) {
    return {
      playlist,
      role: "VIEWER",
      canView: true,
      canEdit: false,
    };
  }

  return {
    playlist,
    role: "NONE",
    canView: false,
    canEdit: false,
  };
};

export const createPlaylist = async (
  userId: string,
  input: CreatePlaylistInput
) => {
  return await db.playlist.create({
    data: {
      userId,
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
  playlistId: string,
  trackId: string
) => {
  const track = await db.$transaction(async (tx) => {
    const t = await tx.track.findUniqueOrThrow({
      where: { id: trackId },
      select: { duration: true },
    });

    const last = await tx.playlistTrack.findFirst({
      where: { playlistId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const finalPosition = last ? last.position + 1 : 0;

    const playlistTrack = await tx.playlistTrack.create({
      data: { playlistId, trackId, position: finalPosition },
      select: { trackId: true },
    });

    await tx.playlist.update({
      where: { id: playlistId },
      data: {
        totalTracks: { increment: 1 },
        duration: { increment: t.duration },
      },
    });

    return playlistTrack;
  });

  const addedTrack = await db.track.findUnique({
    where: { id: track.trackId },
    select: { ...trackItemSelect },
  });

  return { ...addedTrack, addedAt: new Date() };
};

export const removeTrackFromPlaylist = async ({
  playlistId,
  trackId,
}: {
  playlistId: string;
  trackId: string;
}) => {
  return db.$transaction(async (tx) => {
    const playlistTrack = await tx.playlistTrack.findUnique({
      where: {
        playlistId_trackId: {
          playlistId,
          trackId,
        },
      },
      select: {
        id: true,
        position: true,
        track: {
          select: { duration: true, album: { select: { imageId: true } } },
        },
      },
    });

    if (!playlistTrack) {
      throw new Error("Track not found in playlist");
    }

    const { position, track } = playlistTrack;

    await tx.playlistTrack.delete({
      where: { id: playlistTrack.id },
    });

    await tx.playlistTrack.updateMany({
      where: {
        playlistId,
        position: { gt: position },
      },
      data: { position: { decrement: 1 } },
    });

    const playlist = await tx.playlist.update({
      where: { id: playlistId },
      data: {
        totalTracks: { decrement: 1 },
        duration: { decrement: track.duration },
      },
      select: {
        id: true,
        totalTracks: true,
        tracks: {
          select: {
            track: { select: { album: { select: { imageId: true } } } },
          },
        },
      },
    });

    const imageIds = playlist.tracks.map((t) => t.track.album.imageId);
    const imageIdSet = new Set(imageIds);

    let newCover: string | null = null;

    if (playlist.totalTracks === 0) {
      newCover = null;
    } else if (imageIdSet.size < 4) {
      newCover = imageIds[0];
    } else if (imageIdSet.size >= 4) {
      newCover = buildPlaylistCoverUrl(Array.from(imageIdSet).slice(0, 4));
    }

    if (newCover !== null) {
      await tx.playlist.update({
        where: { id: playlistId },
        data: { imageId: newCover },
      });
    }

    return {
      removedTrackId: trackId,
      position,
      newCover,
    };
  });
};

export const getPlaylistDetail = async (playlistId: string) => {
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
            addedAt: true,
            track: {
              select: {
                id: true,
                title: true,
                duration: true,
                playCount: true,
                album: {
                  select: {
                    id: true,
                    title: true,
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
      tracks: playlist.tracks.map((track) => ({
        ...track.track,
        addedAt: track.addedAt,
      })),
    }));
};

export type PlaylistDetail = AwaitedReturnType<typeof getPlaylistDetail>;

export const getPlaylistBanner = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const auth = await authorizePlaylist({ userId, playlistId });

  if (!auth.canView) {
    throw new AppError("FORBIDDEN", "Forbidden");
  }

  const playlist = await db.playlist.findUnique({
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
    },
  });

  if (!playlist) {
    throw new AppError("NOT_FOUND", "Playlist not found");
  }

  return {
    ...playlist,
    role: auth.role,
    canEdit: auth.canEdit,
    canView: auth.canView,
  };
};

export type PlaylistBanner = AwaitedReturnType<typeof getPlaylistBanner>;

export const getPlaylistTracks = async ({
  userId,
  playlistId,
}: {
  userId: string;
  playlistId: string;
}) => {
  const auth = await authorizePlaylist({ userId, playlistId });

  if (!auth.canView) {
    throw new AppError("FORBIDDEN", "Forbidden");
  }

  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
    },
    select: {
      tracks: {
        select: {
          addedAt: true,
          track: {
            select: trackItemSelect,
          },
        },
      },
    },
  });

  if (!playlist) {
    throw new AppError("NOT_FOUND", "Playlist not found");
  }

  const tracks = playlist.tracks.map((track) => ({
    ...track.track,
    addedAt: track.addedAt,
  }));

  const rawTracks = tracks.map((track) => ({
    ...track,
    artists: track.artists.map((a) => a.artist),
  }));

  return {
    tracks: await attachIsLikedToTracks(userId, rawTracks),
    role: auth.role,
    canEdit: auth.canEdit,
    canView: auth.canView,
  };
};

export type PlaylistTracks = AwaitedReturnType<typeof getPlaylistTracks>;

export const getRecommendedTracks = async ({
  userId,
  playlistId,
  take = 5,
}: {
  userId: string;
  playlistId: string;
  take: number;
}) => {
  const auth = await authorizePlaylist({ userId, playlistId });

  if (!auth.canView) {
    throw new AppError("FORBIDDEN", "Forbidden");
  }

  const playlist = await db.playlist.findUniqueOrThrow({
    where: { id: playlistId },
    select: {
      tracks: {
        select: {
          track: {
            select: {
              id: true,
              genres: { select: { genre: { select: { id: true } } } },
            },
          },
        },
      },
    },
  });

  const trackIds = playlist.tracks.map((t) => t.track.id);
  const genreIds = playlist.tracks.flatMap((t) =>
    t.track.genres.map((g) => g.genre.id)
  );

  let candidateIds: { id: string }[] = [];

  if (genreIds.length > 0) {
    candidateIds = await db.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT t.id
      FROM "tracks" t
      JOIN "track_genres" tg ON tg."trackId" = t.id
      WHERE tg."genreId" IN (${
        genreIds.length > 0 ? Prisma.join(genreIds) : Prisma.empty
      })
      ${
        trackIds.length > 0
          ? Prisma.sql`AND t.id NOT IN (${Prisma.join(trackIds)})`
          : Prisma.empty
      }
      ORDER BY RANDOM()
      LIMIT ${take}
    `);
  }

  if (candidateIds.length < take) {
    const needed = take - candidateIds.length;

    const fallbackIds = await db.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT id
      FROM "tracks" t
      ${
        trackIds.length + candidateIds.length > 0
          ? Prisma.sql`WHERE t.id NOT IN (${Prisma.join([
              ...trackIds,
              ...candidateIds.map((r) => r.id),
            ])})`
          : Prisma.empty
      }
      ORDER BY RANDOM()
      LIMIT ${needed}
    `);

    candidateIds = [...candidateIds, ...fallbackIds];
  }

  let tracks = await db.track.findMany({
    where: { id: { in: candidateIds.map((r) => r.id) } },
    select: trackItemSelect,
  });

  if (tracks.length < take) {
    const missing = take - tracks.length;

    const moreIds = await db.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT id
      FROM "tracks" t
      WHERE t.id NOT IN (${Prisma.join([
        ...trackIds,
        ...tracks.map((t) => t.id),
      ])})
      ORDER BY RANDOM()
      LIMIT ${missing}
    `);

    if (moreIds.length > 0) {
      const moreTracks = await db.track.findMany({
        where: { id: { in: moreIds.map((r) => r.id) } },
        select: trackItemSelect,
      });

      tracks = [...tracks, ...moreTracks];
    }
  }

  const recommendedTracks = tracks.map((track) => ({
    ...track,
    addedAt: new Date(),
    artists: track.artists.map((a) => a.artist),
  }));

  return {
    tracks: recommendedTracks,
    role: auth.role,
    canEdit: auth.canEdit,
    canView: auth.canView,
  };
};

export type RecommendedTracks = AwaitedReturnType<typeof getRecommendedTracks>;

export const uploadPlaylistCover = async ({
  userId,
  playlistId,
  imageIds,
}: {
  userId: string;
  playlistId: string;
  imageIds: string[];
}) => {
  const auth = await authorizePlaylist({
    playlistId,
    userId,
  });

  if (!auth.canEdit) {
    return new AppError("FORBIDDEN", "You cannot edit this playlist");
  }

  try {
    if (imageIds.length === 1) {
      const [imageId] = imageIds;

      const response = await cloudinary.uploader.upload(
        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${imageId}`,
        {
          folder: "audix/playlists",
          public_id: playlistId,
          overwrite: true,
          resource_type: "image",
          format: "webp",
        }
      );

      return await db.playlist.update({
        where: { id: playlistId },
        data: { imageId: response.secure_url },
        select: { imageId: true },
      });
    }

    const imageIdSet = new Set(imageIds);
    if (imageIdSet.size === 4) {
      const collageUrl = buildPlaylistCoverUrl(
        Array.from(imageIdSet).slice(0, 4)
      );

      const response = await cloudinary.uploader.upload(collageUrl, {
        folder: "audix/playlists",
        public_id: playlistId,
        overwrite: true,
        resource_type: "image",
        format: "webp",
      });

      return await db.playlist.update({
        where: { id: playlistId },
        data: { imageId: response.secure_url },
        select: { imageId: true },
      });
    }

    return null;
  } catch (error) {
    console.error("Failed to upload playlist cover:", error);
    return null;
  }
};

export const deletePlaylist = async ({
  playlistId,
  userId,
}: {
  playlistId: string;
  userId: string;
}) => {
  const auth = await authorizePlaylist({
    playlistId,
    userId,
  });

  if (!auth.canEdit) {
    return new AppError("FORBIDDEN", "You cannot delete this playlist");
  }

  return db.$transaction(async (tx) => {
    const playlist = await tx.playlist.findUnique({
      where: { id: playlistId },
      select: {
        id: true,
        userId: true,
        imageId: true,
      },
    });

    if (!playlist) {
      throw new Error("Playlist not found");
    }

    if (playlist.userId !== userId) {
      throw new Error("You do not have permission to delete this playlist");
    }

    await tx.playlistTrack.deleteMany({
      where: { playlistId },
    });

    await tx.playlist.delete({
      where: { id: playlistId },
    });

    if (playlist.imageId && playlist.imageId.startsWith("http")) {
      try {
        const publicId = `audix/playlists/${playlistId}`;
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      } catch (err) {
        console.error("Failed to delete cover from Cloudinary:", err);
      }
    }

    return { deletedPlaylistId: playlistId };
  });
};

export const getUserPlaylistsWithoutTrack = async (
  userId: string,
  trackId: string
) => {
  return await db.playlist.findMany({
    where: {
      userId,
      tracks: {
        none: {
          trackId: trackId,
        },
      },
    },
    select: {
      id: true,
      title: true,
    },
  });
};

export const updatePlaylistInfo = async ({
  userId,
  playlistId,
  input,
}: {
  userId: string;
  playlistId: string;
  input: UpdatePlaylistInput;
}) => {
  const auth = await authorizePlaylist({
    playlistId,
    userId,
  });

  if (!auth.canEdit) {
    return new AppError("FORBIDDEN", "You cannot edit this playlist");
  }

  return await db.playlist.update({
    where: {
      id: playlistId,
    },
    data: input,
    select: {
      title: true,
      description: true,
    },
  });
};
