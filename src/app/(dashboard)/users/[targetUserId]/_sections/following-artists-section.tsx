"use client";

import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useQuery } from "@tanstack/react-query";

export const FollowingArtistsSection = ({ userId }: { userId: string }) => {
  const { data: artists, status } = useQuery({
    ...userQueryOptions.followingArtists(userId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading title="Following Artists" />
      <ArtistGrid artists={artists} />
    </section>
  );
};
