"use client";

import { AlbumItem } from "@/components/features/entity-item/album-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { MyLikedAlbums } from "@/lib/data/me-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const LikedAlbumsSectionClient = ({
  initialData,
}: {
  initialData: MyLikedAlbums;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...meQueryOptions.likedAlbums({ limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section title="Liked Albums">
      <EntityCarousel
        data={data.items}
        renderItem={(album) => <AlbumItem album={album} />}
      />
    </Section>
  );
};
