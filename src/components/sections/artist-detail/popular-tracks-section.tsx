"use client";

import { TrackGrid } from "@/components/features/track-grid";
import SectionHeading from "@/components/ui/section-heading";
import { TrackDetailDto } from "@/server/modules/track/contracts";

export const PopularTracksSection = ({
  artistId,
  tracks,
}: {
  artistId: string;
  tracks: TrackDetailDto[];
}) => {
  return (
    <section>
      <SectionHeading title="Popular" />
      <TrackGrid artistId={artistId} type="popular" tracks={tracks} />
    </section>
  );
};
