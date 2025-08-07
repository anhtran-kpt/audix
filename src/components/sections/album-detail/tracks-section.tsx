"use client";

import { TrackGrid } from "@/components/features/track-grid";
import { TTrack } from "@/types/track";

export const TracksSection = ({ tracks }: { tracks: TTrack[] }) => {
  return (
    <section>
      <TrackGrid type="album" tracks={tracks} />
    </section>
  );
};
