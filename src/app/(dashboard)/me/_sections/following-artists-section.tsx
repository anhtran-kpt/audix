"use client";

import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";

export const FollowingArtistsSection = () => {
  const limit = useResponsiveLimit();
  const { data, status } = useQuery({
    ...meQueryOptions.followedArtists({ limit }),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading
        title="Following Artists"
        showAllHref={
          data.pagination.hasMore ? `/me/following/artists` : undefined
        }
      />
      <ArtistGrid artists={data.items} />
    </section>
  );
};
