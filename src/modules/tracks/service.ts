import "server-only";
import { findTrackById, listTracksByIds } from "./dao";

export const findTrackByIdService = async (trackId: string) => {
  return await findTrackById(trackId);
};

export const listTracksByIdsService = async (trackIds: string[]) => {
  const rows = await listTracksByIds(trackIds);

  const byId = new Map(rows.map((t) => [t.id, t]));

  return trackIds
    .map((id) => byId.get(id))
    .filter((x): x is (typeof rows)[number] => !!x);
};
