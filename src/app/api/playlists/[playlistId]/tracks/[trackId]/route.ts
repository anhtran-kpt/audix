import { removeTrackFromPlaylist } from "@/features/playlist/data-access/playlist-repos";
import { zCuidSchema } from "@/features/shared/contracts/shared-dto";
import { makeDELETE } from "@/lib/route-factory";
import { object } from "zod";

export const DELETE = makeDELETE({
  auth: "required",
  params: object({ playlistId: zCuidSchema, trackId: zCuidSchema }),
  handler: async ({ params }) => {
    return removeTrackFromPlaylist(params);
  },
});
