import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { UserGridSkeleton } from "@/components/shared/user-grid-skeleton";
import { getUserFollowedUsers } from "@/lib/data/user-data";
import { Suspense } from "react";
import { FollowingUsersSectionClient } from "./following-users-section-client";

export const FollowingUsersSection = async ({
  targetUserId,
}: {
  targetUserId: string;
}) => {
  const data = await getUserFollowedUsers({
    targetUserId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<UserGridSkeleton />} />}
    >
      <FollowingUsersSectionClient initialData={data} userId={targetUserId} />
    </Suspense>
  );
};
