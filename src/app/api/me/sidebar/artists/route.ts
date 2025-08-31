import { makeGET } from "@/lib/route-factory";
import { getSidebarArtists } from "@/server/modules/artist/services";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getSidebarArtists(userId!);
  },
});
