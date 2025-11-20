"use client";

import { AlbumItem } from "@/features/albums/components/album-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { AlbumNewReleases } from "@/features/album/album-types";

type NewReleasesSectionProps = {
  initialData: AlbumNewReleases;
};
export const NewReleasesSection = ({
  initialData,
}: NewReleasesSectionProps) => {
  return (
    <Section
      title="New Releases"
      showAllHref={
        initialData.pagination.hasMore ? `/albums/new-releases` : undefined
      }
    >
      <EntityCarousel
        data={initialData.items}
        renderItem={(album) => <AlbumItem album={album} />}
      />
    </Section>
  );
};
