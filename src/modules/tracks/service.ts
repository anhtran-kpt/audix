import "server-only";
import { findTrackById } from "./dao";

export const findTrackByIdService = async (trackId: string) => {
  return await findTrackById(trackId);
};
