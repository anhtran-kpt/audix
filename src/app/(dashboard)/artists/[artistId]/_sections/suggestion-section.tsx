"use client";

import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { artistSuggestionsOptions } from "@/features/artist/api/artist-options";
import { useQuery } from "@tanstack/react-query";

export const SuggestionSection = ({ artistId }: { artistId: string }) => {
  const { data: artists } = useQuery({ ...artistSuggestionsOptions(artistId) });

  return (
    <section>
      <SectionHeading title="Fans also like" href={`/artists`} hasShowAll />
      <ArtistGrid artists={artists} />
    </section>
  );
};
