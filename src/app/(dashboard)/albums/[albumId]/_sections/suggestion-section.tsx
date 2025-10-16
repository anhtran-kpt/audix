"use client";

import AlbumGrid from "@/components/shared/album-grid";
import SectionHeading from "@/components/ui/section-heading";
import { albumQueryOptions } from "@/features/album/api/album-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";

export const SuggestionSection = ({ albumId }: { albumId: string }) => {
  const limit = useResponsiveLimit();

  const { data, status } = useQuery({
    ...albumQueryOptions.suggestions(albumId, { limit }),
    enabled: limit > 0,
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
        title={`More by ${data.artist.name}`}
        showAllHref={
          data.pagination.hasMore
            ? `/artists/${data.artist.id}/albums`
            : undefined
        }
      />
      <AlbumGrid albums={data.items} />
    </section>
  );
};
