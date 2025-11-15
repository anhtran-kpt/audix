import { PaginationParamsSchema } from "@/features/shared/shared-schemas";
import { getMyFollowedArtists } from "@/features/me/me-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: PaginationParamsSchema,
  handler: async ({ userId, query }) => {
    return getMyFollowedArtists({ userId: userId!, params: query });
  },
});
