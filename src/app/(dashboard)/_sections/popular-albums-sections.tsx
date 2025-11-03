"use client";

import { AlbumItem } from "@/components/features/entity-item/album-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { PopularAlbums } from "@/lib/data/album-data";

type PopularAlbumSectionsProps = {
  initialData: PopularAlbums;
};
export const PopularAlbumSections = ({
  initialData,
}: PopularAlbumSectionsProps) => {
  return (
    <Section
      title="Popular Albums"
      showAllHref={
        initialData.pagination.hasMore ? `/albums/popular-albums` : undefined
      }
    >
      <EntityCarousel
        data={initialData.items}
        renderItem={(album) => <AlbumItem album={album} />}
      />
    </Section>
  );
};
