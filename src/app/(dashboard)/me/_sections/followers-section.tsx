import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { UserGridSkeleton } from "@/components/shared/user-grid-skeleton";
import { Suspense } from "react";
import { FollowersSectionClient } from "./followers-section-client";
import { getMyFollowedUsers } from "@/lib/data/me-data";

export const FollowersSection = async ({ userId }: { userId: string }) => {
  const data = await getMyFollowedUsers({
    userId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<UserGridSkeleton />} />}
    >
      <FollowersSectionClient initialData={data} />
    </Suspense>
  );
};
