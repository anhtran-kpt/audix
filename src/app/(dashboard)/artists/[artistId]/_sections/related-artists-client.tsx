"use client";

import { ArtistItem } from "@/components/features/entity-item/artist-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { RelatedArtists } from "@/lib/data/artist-data";

type RelatedArtistsClient = {
  artistId: string;
  initialData: RelatedArtists;
};
export const RelatedArtistsClient = ({
  artistId,
  initialData,
}: RelatedArtistsClient) => {
  return (
    <Section
      title="Fans Also Like"
      showAllHref={
        initialData.pagination.hasMore
          ? `/artists/${artistId}/related`
          : undefined
      }
    >
      <EntityCarousel
        data={initialData.items}
        renderItem={(artist) => <ArtistItem artist={artist} key={artist.id} />}
      />
    </Section>
  );
};
