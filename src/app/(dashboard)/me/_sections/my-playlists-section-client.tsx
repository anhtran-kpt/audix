"use client";

import { PlaylistItem } from "@/components/features/entity-item/playlist-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { MyPlaylists } from "@/lib/data/me-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const MyPlaylistsSectionClient = ({
  initialData,
}: {
  initialData: MyPlaylists;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...meQueryOptions.myPlaylists({ limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section
      title="My Playlists"
      showAllHref={data.pagination.hasMore ? `/me/playlists` : undefined}
    >
      <EntityCarousel
        data={data.items}
        renderItem={(playlist) => <PlaylistItem playlist={playlist} />}
      />
    </Section>
  );
};
