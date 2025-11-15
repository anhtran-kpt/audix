import { PaginationParamsSchema } from "@/features/shared/shared-schemas";
import { getMyPlaylists } from "@/features/me/me-data";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: PaginationParamsSchema,
  handler: async ({ userId, query }) => {
    return getMyPlaylists({ userId: userId!, params: query });
  },
});
