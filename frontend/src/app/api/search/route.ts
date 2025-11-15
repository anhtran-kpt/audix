import { searchQuerySchema } from "@/features/search/search-schemas";
import { search } from "@/features/search/search-actions";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  query: searchQuerySchema,
  handler: async ({ query }) => {
    return search(query);
  },
});
