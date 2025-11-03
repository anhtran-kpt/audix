import { ArtistGridSkeleton } from "@/components/shared/artist-grid-skeleton";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { getUserFollowedArtists } from "@/lib/data/user-data";
import { Suspense } from "react";
import { FollowingArtistsSectionClient } from "./following-artists-section-client";

export const FollowingArtistsSection = async ({
  targetUserId,
}: {
  targetUserId: string;
}) => {
  const data = await getUserFollowedArtists({
    targetUserId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<ArtistGridSkeleton />} />}
    >
      <FollowingArtistsSectionClient initialData={data} userId={targetUserId} />
    </Suspense>
  );
};
