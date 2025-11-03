import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { UserGridSkeleton } from "@/components/shared/user-grid-skeleton";
import { Suspense } from "react";
import { FollowersSectionClient } from "./followers-section-client";
import { getUserFollowers } from "@/lib/data/user-data";

export const FollowersSection = async ({
  targetUserId,
}: {
  targetUserId: string;
}) => {
  const data = await getUserFollowers({
    targetUserId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<UserGridSkeleton />} />}
    >
      <FollowersSectionClient initialData={data} userId={targetUserId} />
    </Suspense>
  );
};
