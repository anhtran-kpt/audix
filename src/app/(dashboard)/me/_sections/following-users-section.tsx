import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { UserGridSkeleton } from "@/components/shared/user-grid-skeleton";
import { getMyFollowedUsers } from "@/lib/data/me-data";
import { Suspense } from "react";
import { FollowingUsersSectionClient } from "./following-users-section-client";

export const FollowingUsersSection = async ({ userId }: { userId: string }) => {
  const data = await getMyFollowedUsers({
    userId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<UserGridSkeleton />} />}
    >
      <FollowingUsersSectionClient initialData={data} />
    </Suspense>
  );
};
