import { ArtistGridSkeleton } from "@/components/shared/artist-grid-skeleton";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { Suspense } from "react";
import { FollowingArtistsSectionClient } from "./following-artists-section-client";
import { getMyFollowedArtists } from "@/features/me/me-data";

export const FollowingArtistsSection = async ({
  userId,
}: {
  userId: string;
}) => {
  const data = await getMyFollowedArtists({
    userId,
    params: { limit: 8, offset: 0 },
  });
  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<ArtistGridSkeleton />} />}
    >
      <FollowingArtistsSectionClient initialData={data} />
    </Suspense>
  );
};
