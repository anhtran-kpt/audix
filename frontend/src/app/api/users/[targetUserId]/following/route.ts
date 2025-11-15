import { UserParamsSchema } from "@/features/user/user-schemas";
import { makeGET } from "@/lib/route-factory";
import { PaginationParamsSchema } from "@/features/shared/shared-schemas";
import { getUserFollowedArtists } from "@/features/user/user-data";

export const GET = makeGET({
  auth: "required",
  params: UserParamsSchema,
  query: PaginationParamsSchema,
  handler: async ({ params, query }) => {
    return await getUserFollowedArtists({
      targetUserId: params.targetUserId,
      params: query,
    });
  },
});
