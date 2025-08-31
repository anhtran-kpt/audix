import { getSidebarArtists } from "@/features/artist/data-access/artist-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getSidebarArtists(userId!);
  },
});
