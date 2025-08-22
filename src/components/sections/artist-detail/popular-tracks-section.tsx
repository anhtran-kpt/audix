"use client";

import { TrackGrid } from "@/components/features/track-grid";
import SectionHeading from "@/components/ui/section-heading";
import { FullTrack } from "@/contracts/track";

export const PopularTracksSection = ({
  artistId,
  tracks,
}: {
  artistId: string;
  tracks: FullTrack[];
}) => {
  return (
    <section>
      <SectionHeading title="Popular" />
      <TrackGrid artistId={artistId} type="popular" tracks={tracks} />
    </section>
  );
};
