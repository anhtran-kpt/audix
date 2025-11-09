import db from "@/lib/db";
import {
  CreatePlaylistInput,
  UpdatePlaylistInput,
} from "@/features/playlist/contracts/playlist-dto";
import { trackItemSelect } from "@/features/track/data-access/track-select";
import cloudinary from "@/lib/config/cloudinary";
import { buildPlaylistCoverUrl } from "@/utils/string";
import { AwaitedReturnType } from "@/utils/type";
import { AppError } from "@/lib/errors";
import { shuffleArray } from "@/utils/array";
import { DEFAULT_USER_PLAYLIST_TYPE } from "@/lib/constants";
import { getFullTracksByIds } from "@/lib/data/track-data";

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
      isSystem: true,
    },
  });

  if (!playlist) {
    return {
      playlist: null,
      role: "NONE" as const,
      canView: false,
      canEdit: false,
    };
  }

  if (playlist.isSystem) {
    return {
      playlist,
      role: "SYSTEM" as const,
      canView: playlist.isPublic,
      canEdit: false,
    };
  }

  const isOwner = userId && playlist.userId === userId;

  if (isOwner) {
    return {
      playlist,
      role: "OWNER" as const,
      canView: true,
      canEdit: true,
    };
  }

  if (playlist.isPublic) {
    return {
      playlist,
      role: "VIEWER" as const,
      canView: true,
      canEdit: false,
    };
  }

  return {
    playlist,
    role: "NONE" as const,
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
        systemType: true,
      },
    });

    if (playlist.systemType === DEFAULT_USER_PLAYLIST_TYPE) {
      return {
        removedTrackId: trackId,
        position,
      };
    }

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
      systemType: true,
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

export const getRecommendedTracks = async ({
  userId,
  playlistId,
  take = 5,
}: {
  userId: string;
  playlistId: string;
  take?: number;
}) => {
  const auth = await authorizePlaylist({ userId, playlistId });

  if (!auth.canView) throw new AppError("FORBIDDEN", "Forbidden");

  const playlist = await db.playlist.findUniqueOrThrow({
    where: { id: playlistId },
    select: {
      tracks: {
        select: {
          trackId: true,
          track: {
            select: {
              id: true,
              genres: { select: { genreId: true } },
            },
          },
        },
      },
    },
  });

  const trackIds = playlist.tracks.map((t) => t.track.id);
  const genreIds = [
    ...new Set(
      playlist.tracks.flatMap((t) => t.track.genres.map((g) => g.genreId))
    ),
  ];

  if (trackIds.length === 0) {
    const allTrackIds = await db.track.findMany({
      select: { id: true },
    });

    const randomIds = shuffleArray(allTrackIds)
      .slice(0, take)
      .map((t) => t.id);

    const fullTracks = await getFullTracksByIds(randomIds);

    return { tracks: fullTracks, ...auth };
  }

  const candidateIds = await db.track.findMany({
    where: {
      id: { notIn: trackIds },
      genres:
        genreIds.length > 0
          ? { some: { genreId: { in: genreIds } } }
          : undefined,
    },
    select: { id: true },
  });

  const shuffledCandidates = shuffleArray(candidateIds);
  const selectedIds = shuffledCandidates.slice(0, take).map((t) => t.id);

  if (selectedIds.length < take) {
    const missing = take - selectedIds.length;

    const fallbackIds = await db.track.findMany({
      where: {
        id: { notIn: [...trackIds, ...selectedIds] },
      },
      select: { id: true },
    });

    const shuffledFallback = shuffleArray(fallbackIds);
    const additionalIds = shuffledFallback.slice(0, missing).map((t) => t.id);

    selectedIds.push(...additionalIds);
  }

  const fullTracks = await getFullTracksByIds(selectedIds);

  return {
    tracks: fullTracks,
    ...auth,
  };
};

export type RecommendedTracks = Awaited<
  ReturnType<typeof getRecommendedTracks>
>;

export const uploadPlaylistCover = async ({
  playlistId,
  imageIds,
}: {
  playlistId: string;
  imageIds: string[];
}) => {
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

    return await db.playlist.update({
      where: { id: playlistId },
      data: { imageId: process.env.NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER! },
      select: { imageId: true },
    });
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
