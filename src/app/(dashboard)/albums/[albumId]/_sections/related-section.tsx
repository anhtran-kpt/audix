import { AlbumGridSkeleton } from "@/components/shared/album-grid-skeleton";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { Suspense } from "react";
import { RelatedAlbumsSectionClient } from "./related-albums-section-client";
import { getRelatedAlbums } from "@/features/album/album-data";

export const RelatedAlbumsSection = async ({
  albumId,
}: {
  albumId: string;
}) => {
  const data = await getRelatedAlbums(albumId, { limit: 8, offset: 0 });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<AlbumGridSkeleton />} />}
    >
      <RelatedAlbumsSectionClient initialData={data} />
    </Suspense>
  );
};
