"use client";

import AlbumGrid from "@/components/shared/album-grid";
import SectionHeading from "@/components/ui/section-heading";
import { albumQueryOptions } from "@/features/album/api/album-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const PopularAlbumSections = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);

  const { data, status } = useQuery({
    ...albumQueryOptions.popularAlbums({ limit }),
    enabled: limit > 0,
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
        title="Popular Albums"
        // showAllHref={
        //   data.pagination.hasMore ? `/albums/popular-albums` : undefined
        // }
      />
      <AlbumGrid albums={data.items} />
    </section>
  );
};
