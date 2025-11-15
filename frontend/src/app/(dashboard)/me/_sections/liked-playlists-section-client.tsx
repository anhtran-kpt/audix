"use client";

import { PlaylistItem } from "@/components/features/entity-item/playlist-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { useResponsiveLimit } from "@/features/shared/hooks/use-responsive-limit";
import { MyLikedPlaylists } from "@/features/me/me-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { meQueryOptions } from "@/features/me/me-query-options";

export const LikedPlaylistsSectionClient = ({
  initialData,
}: {
  initialData: MyLikedPlaylists;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...meQueryOptions.likedPlaylists({ limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section
      title="Liked Playlists"
      showAllHref={data.pagination.hasMore ? `/me/like/playlists` : undefined}
    >
      <EntityCarousel
        data={data.items}
        renderItem={(playlist) => <PlaylistItem playlist={playlist} />}
      />
    </Section>
  );
};
