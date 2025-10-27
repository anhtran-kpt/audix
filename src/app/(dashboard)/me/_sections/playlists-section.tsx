"use client";

import PlaylistGrid from "@/components/shared/playlist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const PlaylistSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data, status } = useQuery({
    ...meQueryOptions.myPlaylists({ limit }),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section ref={sectionRef}>
      <SectionHeading
        title="My Playlists"
        showAllHref={data.pagination.hasMore ? `/me/playlists` : undefined}
      />
      <PlaylistGrid playlists={data.items} />
    </section>
  );
};
