import { removeTrackFromPlaylist } from "@/features/playlist/playlist-actions";
import { makeDELETE } from "@/lib/route-factory";
import z, { object } from "zod";

export const DELETE = makeDELETE({
  auth: "required",
  params: object({ playlistId: z.cuid2(), trackId: z.cuid2() }),
  handler: async ({ params }) => {
    return removeTrackFromPlaylist(params);
  },
});
