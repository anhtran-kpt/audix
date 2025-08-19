import "server-only";
import db from "@/server/db";
import { trackDetailSelect } from "./selects";

export const findTrackById = async (id: string) =>
  await db.track.findUnique({
    where: {
      id,
    },
    select: trackDetailSelect,
  });

export const listTracksByIds = async (ids: string[]) =>
  await db.track.findMany({
    where: { id: { in: ids } },
    select: trackDetailSelect,
  });
