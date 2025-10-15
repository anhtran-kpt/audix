"use client";

import AlbumGrid from "@/components/shared/album-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useQuery } from "@tanstack/react-query";

export const AlbumSection = () => {
  const { data: albums, status } = useQuery({
    ...meQueryOptions.likedAlbums(),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading title="Liked Albums" />
      <AlbumGrid albums={albums} />
    </section>
  );
};
