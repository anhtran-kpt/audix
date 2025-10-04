import { getLibraryPlaylists } from "@/features/me/data-access/me-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  handler: async ({ userId }) => {
    return getLibraryPlaylists(userId!);
  },
});
