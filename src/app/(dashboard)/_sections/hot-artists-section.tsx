"use client";

import { ArtistItem } from "@/components/features/entity-item/artist-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { HotArtists } from "@/lib/data/artist-data";

type HotArtistsSectionProps = {
  initialData: HotArtists;
};
export const HotArtistsSection = ({ initialData }: HotArtistsSectionProps) => {
  return (
    <Section
      title="Hot Artists"
      showAllHref={
        initialData?.pagination.hasMore ? `/artists/hot-artists` : undefined
      }
    >
      <EntityCarousel
        data={initialData.items}
        renderItem={(artist) => <ArtistItem artist={artist} />}
      />
    </Section>
  );
};
