import { uploadPlaylistCover } from "@/features/playlist/data-access/playlist-repo";
import { makePOST } from "@/lib/route-factory";
import z, { object } from "zod";

export const POST = makePOST({
  auth: "required",
  params: object({ playlistId: z.cuid2() }),
  body: object({ imageIds: z.string().array() }),
  handler: async ({ body, params }) => {
    return uploadPlaylistCover(params.playlistId, body.imageIds);
  },
});
