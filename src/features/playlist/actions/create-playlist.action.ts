"use server";

import { requireAuth } from "@/server/auth";
import { createPlaylistService } from "../services/playlist.service";
import { revalidateTag } from "next/cache";

export const createPlaylistAction = async (input: unknown) => {
  const user = await requireAuth();
  const userId = user.id;

  const res = await createPlaylistService(input, userId);

  if (!res.ok) return res;

  revalidateTag(`playlists:${userId}`);

  return {
    ok: true,
    playlistId: res.playlistId,
    redirectTo: `/playlists/${res.playlistId}`,
  };
};
