"use client";

import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useQuery } from "@tanstack/react-query";

export const FollowingArtistsSection = () => {
  const { data: artists, status } = useQuery({
    ...meQueryOptions.followedArtists(),
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
