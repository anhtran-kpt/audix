import { zCuidType } from "@/contracts/common";
import { CreatePlaylistInput } from "@/contracts/playlist";
import db from "@/lib/db";

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
