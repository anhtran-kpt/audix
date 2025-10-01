import { searchQuerySchema } from "@/features/search/contracts/search-dtos";
import { search } from "@/features/search/data-access/search-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: searchQuerySchema,
  handler: async ({ query }) => {
    return search(query);
  },
});
