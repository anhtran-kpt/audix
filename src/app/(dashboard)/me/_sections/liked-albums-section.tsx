import { Suspense } from "react";
import { LikedAlbumsSectionClient } from "./liked-albums-section-client";
import { getMyLikedAlbums } from "@/features/me/me-data";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { AlbumGridSkeleton } from "@/components/shared/album-grid-skeleton";

export const LikedAlbumsSection = async ({ userId }: { userId: string }) => {
  const data = await getMyLikedAlbums({
    userId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<AlbumGridSkeleton />} />}
    >
      <LikedAlbumsSectionClient initialData={data} />
    </Suspense>
  );
};
