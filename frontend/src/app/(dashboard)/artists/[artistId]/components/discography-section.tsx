import { Suspense } from "react";
import { DiscographyClient } from "./discography-client";
import { getArtistDiscography } from "@/features/artist/artist-data";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { AlbumGridSkeleton } from "@/components/shared/album-grid-skeleton";

export const DiscographySection = async ({
  artistId,
}: {
  artistId: string;
}) => {
  const initialData = await getArtistDiscography(artistId, {
    limit: 8,
    offset: 0,
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<AlbumGridSkeleton />} />}
    >
      <DiscographyClient artistId={artistId} initialData={initialData} />
    </Suspense>
  );
};
