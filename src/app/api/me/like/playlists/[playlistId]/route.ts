import { ToggleLikePlaylistInputSchema } from "@/features/me/me-schemas";
import { getLikedPlaylistStatus } from "@/features/me/me-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: ToggleLikePlaylistInputSchema,
  handler: async ({ userId, params }) => {
    return getLikedPlaylistStatus({
      userId: userId!,
      playlistId: params.playlistId,
    });
  },
});
