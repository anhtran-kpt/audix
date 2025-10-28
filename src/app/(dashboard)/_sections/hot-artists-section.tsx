"use client";

import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const HotArtistsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);

  const { data, status } = useQuery({
    ...artistQueryOptions.hotArtists({ limit }),
    enabled: limit > 0,
  });

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section ref={sectionRef}>
      <SectionHeading
        title="Hot Artists"
        isLoading={status === "pending"}
        // showAllHref={
        //   data?.pagination.hasMore ? `/artists/hot-artists` : undefined
        // }
      />
      <ArtistGrid
        artists={data?.items ?? []}
        isLoading={status === "pending"}
      />
    </section>
  );
};
