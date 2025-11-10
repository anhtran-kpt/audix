import { PaginationParamsSchema } from "@/features/shared/shared-schemas";
import { UserParamsSchema } from "@/features/user/user-schemas";
import { getUserPlaylists } from "@/features/user/user-data";
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
