import { getHotArtists } from "@/features/artist/data-access/artist-repo";
import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: PaginationParamsSchema,
  handler: async ({ query }) => {
    return await getHotArtists(query);
  },
});
