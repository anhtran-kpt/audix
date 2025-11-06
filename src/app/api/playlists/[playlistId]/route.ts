import { UpdatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-schema";
import {
  deletePlaylist,
  updatePlaylistInfo,
} from "@/features/playlist/data-access/playlist-repo";
import { makeDELETE, makePATCH } from "@/lib/route-factory";
import z, { object } from "zod";

export const DELETE = makeDELETE({
  auth: "required",
  params: object({ playlistId: z.cuid2() }),
  handler: async ({ params, userId }) => {
    return deletePlaylist({ playlistId: params.playlistId, userId: userId! });
  },
});

export const PATCH = makePATCH({
  auth: "required",
  body: UpdatePlaylistInputSchema,
  params: object({
    playlistId: z.cuid2(),
  }),
  handler: async ({ body, params, userId }) => {
    return updatePlaylistInfo({
      userId: userId!,
      playlistId: params.playlistId,
      input: body,
    });
  },
});
