import { makeGET } from "@/server/api/route-factory";
import { getSidebarPlaylists } from "@/server/modules/playlist/services";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getSidebarPlaylists(userId!);
  },
});
