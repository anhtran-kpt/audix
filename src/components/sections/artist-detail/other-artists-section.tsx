"use client";

import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { ArtistBase } from "@/features/artist/contracts/artist-dto";

type OtherArtistsSectionProps = {
  suggestions: Pick<ArtistBase, "id" | "imageId" | "name">[];
};

export const OtherArtistsSection = ({
  suggestions,
}: OtherArtistsSectionProps) => {
  return (
    <section>
      <SectionHeading title="Fans also like" href={`/artists`} hasShowAll />
      <ArtistGrid artists={suggestions} />
    </section>
  );
};
