import { getMyLikedAlbums } from "@/features/me/data-access/me-repo";
import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: PaginationParamsSchema,
  handler: async ({ userId, query }) => {
    return getMyLikedAlbums({ userId: userId!, params: query });
  },
});
