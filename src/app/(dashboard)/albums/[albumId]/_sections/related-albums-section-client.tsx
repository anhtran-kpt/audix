"use client";

import { AlbumItem } from "@/components/features/entity-item/album-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { RelatedAlbums } from "@/lib/data/album-data";

type RelatedAlbumsSectionClient = {
  initialData: RelatedAlbums;
};
export const RelatedAlbumsSectionClient = ({
  initialData,
}: RelatedAlbumsSectionClient) => {
  return (
    <Section
      title={`More by ${initialData.artist.name}`}
      showAllHref={
        initialData.pagination.hasMore
          ? `/artists/${initialData.artist.id}/albums`
          : undefined
      }
    >
      <EntityCarousel
        data={initialData.items}
        renderItem={(album) => <AlbumItem album={album} />}
      />
    </Section>
  );
};
