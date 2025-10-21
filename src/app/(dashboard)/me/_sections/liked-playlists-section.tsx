"use client";

import PlaylistGrid from "@/components/shared/playlist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";

export const LikedPlaylistsSection = () => {
  const limit = useResponsiveLimit();
  const { data, status } = useQuery({
    ...meQueryOptions.likedPlaylists({ limit }),
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
        title="Liked Playlists"
        showAllHref={data.pagination.hasMore ? `/me/like/playlists` : undefined}
      />
      <PlaylistGrid playlists={data.items} />
    </section>
  );
};
