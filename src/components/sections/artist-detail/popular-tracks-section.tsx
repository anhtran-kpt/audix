"use client";

import SectionHeading from "@/components/ui/section-heading";

export const PopularTracksSection = ({
  artistSlug,
}: {
  artistSlug: string;
}) => {
  return (
    <section>
      <SectionHeading heading="Popular" />
      <TrackGrid type="popular" tracks={data} />
    </section>
  );
};
