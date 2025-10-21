"use client";

import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";

export const FollowingArtistsSection = ({ userId }: { userId: string }) => {
  const limit = useResponsiveLimit();
  const { data, status } = useQuery({
    ...userQueryOptions.followingArtists(userId, { limit }),
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
          data.pagination.hasMore
            ? `/users/${userId}/following/artists`
            : undefined
        }
      />
      <ArtistGrid artists={data.items} />
    </section>
  );
};
