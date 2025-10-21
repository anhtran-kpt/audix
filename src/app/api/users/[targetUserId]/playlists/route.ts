import { UserParamsSchema } from "@/features/user/contracts/user-schema";
import { getUserPlaylists } from "@/features/user/data-access/user-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  handler: async ({ params }) => {
    return getUserPlaylists(params.targetUserId);
  },
});
