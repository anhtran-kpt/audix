"use client";

import { TrackGrid } from "@/components/features/track-grid";
import SectionHeading from "@/components/ui/section-heading";
import { TTrack } from "@/types/track";

export const PopularTracksSection = ({ tracks }: { tracks: TTrack[] }) => {
  return (
    <section>
      <SectionHeading heading="Popular" />
      <TrackGrid type="popular" tracks={tracks} />
    </section>
  );
};
