"use client";

import PlaylistGrid from "@/components/shared/playlist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";

export const PlaylistSection = ({ userId }: { userId: string }) => {
  const limit = useResponsiveLimit();
  const { data, status } = useQuery({
    ...userQueryOptions.playlists(userId, { limit }),
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
        title="Public Playlists"
        showAllHref={
          data.pagination.hasMore ? `/users/${userId}/playlists` : undefined
        }
      />
      <PlaylistGrid playlists={data.items} />
    </section>
  );
};
