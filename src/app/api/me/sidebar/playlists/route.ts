import { getSidebarPlaylists } from "@/features/playlist/data-access/playlist-repos";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getSidebarPlaylists(userId!);
  },
});
