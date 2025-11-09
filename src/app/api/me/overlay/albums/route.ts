import { getMyLikedAlbumIds } from "@/lib/data/me-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return await getMyLikedAlbumIds(userId!);
  },
});
