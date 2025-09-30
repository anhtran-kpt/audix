import "server-only";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { trackDetailSelect, trackItemSelect } from "./track-selects";
import { zCuidType } from "@/features/shared/contracts/shared-dto";

export const getTrackOrThrow = async (trackId: string) => {
  const track = await db.track.findUnique({
    where: {
      id: trackId,
    },
    select: trackDetailSelect,
  });

  if (!track) throw new AppError("NOT_FOUND", "Track not found");

  return track;
};

export const getTrackListByIds = async (trackIds: string[]) => {
  const rows = await db.track.findMany({
    where: { id: { in: trackIds } },
    select: trackDetailSelect,
  });

  const byId = new Map(rows.map((t) => [t.id, t]));

  return trackIds
    .map((id) => byId.get(id))
    .filter((x): x is (typeof rows)[number] => !!x);
};

export const getRecentlyPlayedTracks = async (userId: string) => {
  return db.playHistory
    .findMany({
      where: {
        userId,
      },
      orderBy: {
        playedAt: "desc",
      },
      select: {
        id: true,
        track: {
          select: trackItemSelect,
        },
      },
    })
    .then((data) =>
      data.map((item) => ({
        ...item,
        track: {
          ...item.track,
          artists: item.track.artists.map((a) => a.artist),
        },
      }))
    );
};

export const getNewReleases = async () => {
  return await db.track.findMany({
    select: trackItemSelect,
    take: 9,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getNowPlayingTrack = async (trackId: zCuidType) => {
  const track = await db.track.findUniqueOrThrow({
    where: {
      id: trackId,
    },
    select: {
      id: true,
      title: true,
      album: {
        select: {
          id: true,
          imageId: true,
          artist: {
            select: {
              name: true,
              bannerId: true,
              id: true,
              bio: true,
            },
          },
        },
      },
      artists: {
        select: {
          order: true,
          role: true,
          artist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      credits: {
        select: {
          id: true,
          name: true,
          role: true,
          details: true,
          order: true,
          artist: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (!track) throw new AppError("NOT_FOUND", "Track not found");

  return track;
};

export const getAlbumTracks = async (albumId: zCuidType) => {
  const album = await db.album.findUniqueOrThrow({
    where: { id: albumId },
    select: {
      tracks: { select: { id: true }, orderBy: { trackNumber: "asc" } },
    },
  });

  return album.tracks;
};

export const getCredits = async (trackId: zCuidType) => {
  return await db.track.findUniqueOrThrow({
    where: { id: trackId },
    select: {
      title: true,
      artists: {
        select: {
          role: true,
          order: true,
          artist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      credits: {
        select: {
          id: true,
          name: true,
          role: true,
          details: true,
          order: true,
          artist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
};
