"use client";

import { ArtistItem } from "@/features/artists/components/artist-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { useResponsiveLimit } from "@/features/shared/hooks/use-responsive-limit";
import { UserFollowedArtists } from "@/features/user/user-data";
import { userQueryOptions } from "@/features/user/user-query-options";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

type FollowingArtistsSectionClientProps = {
  userId: string;
  initialData: UserFollowedArtists;
};
export const FollowingArtistsSectionClient = ({
  userId,
  initialData,
}: FollowingArtistsSectionClientProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...userQueryOptions.followingArtists(userId, { limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section
      title="Following Artists"
      showAllHref={
        data.pagination.hasMore
          ? `/users/${userId}/following/artists`
          : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(artist) => <ArtistItem artist={artist} />}
      />
    </Section>
  );
};
