import { zCuidType } from "@/features/shared/contracts/shared-dto";
import db from "@/lib/db";
import {
  CreatePlaylistInput,
  RemoveTrackFromPlaylistInput,
} from "@/features/playlist/contracts/playlist-dto";
import {
  recommendedTrackItemSelect,
  trackDetailSelect,
  trackItemSelect,
} from "@/features/track/data-access/track-selects";
import { Prisma } from "@/app/generated/prisma";
import { generatePlaylistCover } from "@/lib/helpers/build-playlist-cover";
import { shouldUpdateCover } from "@/lib/helpers/should-update-cover";

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
  trackId: zCuidType
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

  const tracks = await db.playlistTrack.findMany({
    where: { playlistId },
    select: { track: { select: { album: { select: { imageId: true } } } } },
    orderBy: { position: "asc" },
  });

  const imageIds = tracks.map((x) => x.track.album.imageId!).filter(Boolean);

  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    select: { imageId: true },
  });

  if (
    shouldUpdateCover(playlist?.imageId ? [playlist.imageId] : [], imageIds)
  ) {
    await generatePlaylistCover(imageIds, playlistId);
  }

  const addedTrack = await db.track.findUnique({
    where: { id: track.trackId },
    select: { ...trackDetailSelect },
  });

  return { ...addedTrack, addedAt: new Date() };
};

export const removeTrackFromPlaylist = async ({
  playlistId,
  trackId,
}: RemoveTrackFromPlaylistInput) => {
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
        track: { select: { duration: true } },
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

    await tx.playlist.update({
      where: { id: playlistId },
      data: {
        totalTracks: { decrement: 1 },
        duration: { decrement: track.duration },
      },
    });

    // Cập nhật cover
    const trackImages = await tx.playlistTrack.findMany({
      where: { playlistId },
      select: { track: { select: { album: { select: { imageId: true } } } } },
      orderBy: { position: "asc" },
    });

    const imageIds = trackImages
      .map((x) => x.track.album.imageId!)
      .filter(Boolean);

    await generatePlaylistCover(imageIds, playlistId);

    return { removedTrackId: trackId, position };
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

export const getRecommendedTracks = async (playlistId: zCuidType, take = 5) => {
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
    select: recommendedTrackItemSelect,
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
        select: recommendedTrackItemSelect,
      });

      tracks = [...tracks, ...moreTracks];
    }
  }

  return tracks.map((track) => ({
    ...track,
    addedAt: new Date(),
  }));
};
