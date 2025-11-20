"use client";

import { AlbumItem } from "@/features/albums/components/album-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { useResponsiveLimit } from "@/features/shared/hooks/use-responsive-limit";
import { MyLikedAlbums } from "@/features/me/me-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { meQueryOptions } from "@/features/me/me-query-options";

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
