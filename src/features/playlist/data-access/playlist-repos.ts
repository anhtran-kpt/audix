import { zCuidSchemaType } from "@/features/shared/contracts/shared-dto";
import db from "@/lib/db";
import { CreatePlaylistInput } from "@/features/playlist/contracts/playlist-dto";

export const getSidebarPlaylists = async (userId: zCuidSchemaType) => {
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
  userId: zCuidSchemaType,
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
