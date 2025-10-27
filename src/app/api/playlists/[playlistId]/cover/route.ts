import { PlaylistParamsSchema } from "@/features/playlist/contracts/playlist-schema";
import { uploadPlaylistCover } from "@/features/playlist/data-access/playlist-repo";
import { makePOST } from "@/lib/route-factory";
import z, { object } from "zod";

export const POST = makePOST({
  auth: "required",
  params: PlaylistParamsSchema,
  body: object({ imageIds: z.string().array() }),
  handler: async ({ body, params }) => {
    return uploadPlaylistCover({
      playlistId: params.playlistId,
      imageIds: body.imageIds,
    });
  },
});
