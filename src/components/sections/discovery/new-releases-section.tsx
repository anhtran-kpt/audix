"use client";

import TrackItem from "@/components/features/track-item";
import SectionHeading from "@/components/ui/section-heading";
import { TTrack } from "@/types";

type NewReleasesSectionProps = {
  tracks: TTrack[];
};

export const NewReleasesSection = ({ tracks }: NewReleasesSectionProps) => {
  return (
    <section>
      <SectionHeading title="New Releases" hasShowAll href="/new-releases" />
      <ol
        role="list"
        className="grid gap-x-4 gap-y-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      >
        {tracks.map((track) => (
          <TrackItem track={track} key={track.id} hasCreatedAt={true} />
        ))}
      </ol>
    </section>
  );
};
