"use client";

import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";

export const SuggestionSection = ({ artistId }: { artistId: string }) => {
  const limit = useResponsiveLimit();

  const { data, status } = useQuery({
    ...artistQueryOptions.suggestions(artistId, { limit }),
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
        title="Fans also like"
        showAllHref={data.pagination.hasMore ? `/artists` : undefined}
      />
      <ArtistGrid artists={data.items} />
    </section>
  );
};
