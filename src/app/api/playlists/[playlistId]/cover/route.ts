import { PlaylistParamsSchema } from "@/features/playlist/playlist-schemas";
import { uploadPlaylistCover } from "@/features/playlist/playlist-actions";
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
