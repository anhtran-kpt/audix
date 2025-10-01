import { UpdatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-schema";
import {
  deletePlaylist,
  getPlaylistDetail,
  updatePlaylistInfo,
} from "@/features/playlist/data-access/playlist-repo";
import { zCuidSchema } from "@/features/shared/contracts/shared-schema";
import { makeDELETE, makeGET, makePATCH } from "@/lib/route-factory";
import { object } from "zod";

export const GET = makeGET({
  auth: "public",
  params: object({ playlistId: zCuidSchema }),
  handler: async ({ params }) => {
    return getPlaylistDetail(params.playlistId);
  },
});

export const DELETE = makeDELETE({
  auth: "required",
  params: object({ playlistId: zCuidSchema }),
  handler: async ({ params, userId }) => {
    return deletePlaylist({ playlistId: params.playlistId, userId: userId! });
  },
});

export const PATCH = makePATCH({
  auth: "required",
  body: UpdatePlaylistInputSchema,
  params: object({
    playlistId: zCuidSchema,
  }),
  handler: async ({ body, params }) => {
    return updatePlaylistInfo(params.playlistId, body);
  },
});
