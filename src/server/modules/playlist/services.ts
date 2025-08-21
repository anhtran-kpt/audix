import { zCuidType } from "@/contracts/common";
import { CreatePlaylistInput } from "@/contracts/playlist";
import db from "@/lib/db";

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
    },
  });
};
