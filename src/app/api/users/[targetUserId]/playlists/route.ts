import { PaginationParamsSchema } from "@/features/shared/contracts/shared-schema";
import { UserParamsSchema } from "@/features/user/contracts/user-schema";
import { getUserPlaylists } from "@/features/user/data-access/user-repo";
import { makeGET } from "@/lib/route-factory";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  query: PaginationParamsSchema,
  handler: async ({ params, query }) => {
    return getUserPlaylists({
      targetUserId: params.targetUserId,
      params: query,
    });
  },
});
