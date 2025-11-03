import { Suspense } from "react";
import { RelatedArtistsClient } from "./related-artists-client";
import { getRelatedArtists } from "@/lib/data/artist-data";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { ArtistGridSkeleton } from "@/components/shared/artist-grid-skeleton";

export const RelatedArtistsSection = async ({
  artistId,
}: {
  artistId: string;
}) => {
  const initialData = await getRelatedArtists(artistId, {
    limit: 8,
    offset: 0,
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<ArtistGridSkeleton />} />}
    >
      <RelatedArtistsClient artistId={artistId} initialData={initialData} />
    </Suspense>
  );
};
