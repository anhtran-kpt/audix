"use client";

import { ArtistItem } from "@/components/features/entity-item/artist-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { useResponsiveLimit } from "@/features/shared/hooks/use-responsive-limit";
import { MyFollowedArtists } from "@/features/me/me-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { meQueryOptions } from "@/features/me/me-query-options";

type FollowingArtistsSectionClient = {
  initialData: MyFollowedArtists;
};
export const FollowingArtistsSectionClient = ({
  initialData,
}: FollowingArtistsSectionClient) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...meQueryOptions.followedArtists({ limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section
      title="Following Artists"
      showAllHref={
        data.pagination.hasMore ? `/me/following/artists` : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(artist) => <ArtistItem artist={artist} />}
      />
    </Section>
  );
};
