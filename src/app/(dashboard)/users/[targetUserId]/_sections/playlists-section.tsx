"use client";

import PlaylistGrid from "@/components/shared/playlist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useQuery } from "@tanstack/react-query";

export const PlaylistSection = ({ userId }: { userId: string }) => {
  const { data: playlists, status } = useQuery({
    ...userQueryOptions.playlists(userId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading title="Public Playlists" />
      <PlaylistGrid playlists={playlists} />
    </section>
  );
};
