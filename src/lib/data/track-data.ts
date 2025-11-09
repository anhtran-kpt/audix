import "server-only";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { trackItemSelect } from "@/features/track/data-access/track-select";

export const getFullTrackById = async (id: string) => {
  const track = await db.track.findUnique({
    where: { id },
    select: trackItemSelect,
  });

  if (!track) {
    throw new AppError("NOT_FOUND", "Track not found!");
  }

  return {
    ...track,
    artists: track.artists.map((ta) => ta.artist),
  };
};

export const getFullTracksByIds = async (ids: string[]) => {
  const tracks = await db.track.findMany({
    where: {
      id: { in: ids },
    },
    select: trackItemSelect,
  });

  return tracks.map((track) => ({
    ...track,
    artists: track.artists.map((ta) => ta.artist),
  }));
};
