"use client";

import { TrackGrid } from "@/components/features/track-grid";
import SectionHeading from "@/components/ui/section-heading";
import { FullTrack } from "@/contracts/track";

export const PopularTracksSection = ({
  artistId,
  tracks,
}: {
  artistId: string;
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
}) => {
  return (
    <section>
      <SectionHeading title="Popular" />
      <TrackGrid artistId={artistId} type="popular" tracks={tracks} />
    </section>
  );
};
