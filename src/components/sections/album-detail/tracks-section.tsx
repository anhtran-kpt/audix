"use client";

import { TrackGrid } from "@/components/features/track-grid";
import { FullTrack } from "@/contracts/track";

type TracksSectionProps = {
  tracks: Pick<
    FullTrack,
    | "id"
    | "duration"
    | "playCount"
    | "title"
    | "isExplicit"
    | "album"
    | "artists"
  >[];
};

export const TracksSection = ({ tracks }: TracksSectionProps) => {
  return (
    <section>
      <TrackGrid type="album" tracks={tracks} />
    </section>
  );
};
