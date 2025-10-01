import { removeTrackFromPlaylist } from "@/features/playlist/data-access/playlist-repo";
import { zCuidSchema } from "@/features/shared/contracts/shared-schema";
import { makeDELETE } from "@/lib/route-factory";
import { object } from "zod";

export const DELETE = makeDELETE({
  auth: "required",
  params: object({ playlistId: zCuidSchema, trackId: zCuidSchema }),
  handler: async ({ params }) => {
    return removeTrackFromPlaylist(params);
  },
});
