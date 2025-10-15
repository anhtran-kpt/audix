"use client";

import PlaylistGrid from "@/components/shared/playlist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useQuery } from "@tanstack/react-query";

export const PlaylistSection = () => {
  const { data: playlists, status } = useQuery({
    ...meQueryOptions.myPlaylists(),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading title="My Playlists" />
      <PlaylistGrid playlists={playlists} />
    </section>
  );
};
