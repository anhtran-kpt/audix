import { searchQuerySchema } from "@/features/search/contracts/search-schema";
import { search } from "@/features/search/data-access/search-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: searchQuerySchema,
  handler: async ({ query }) => {
    return search(query);
  },
});
