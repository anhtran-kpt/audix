import { getMyFavoriteSongsPlaylist } from "@/features/me/me-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return await getMyFavoriteSongsPlaylist(userId!);
  },
});
