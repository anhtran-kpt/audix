import {
  deletePlaylist,
  getPlaylistDetail,
} from "@/features/playlist/data-access/playlist-repos";
import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { makeDELETE, makeGET } from "@/lib/route-factory";
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
