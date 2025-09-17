"use client";

import { RowPlayButton } from "@/components/features/row-play-button";
import TrackItem from "@/components/features/track-item";
import SectionHeading from "@/components/ui/section-heading";
import { TrackItem as TrackItemType } from "@/features/track/data-access/track-selects";

type NewReleasesSectionProps = {
  tracks: TrackItemType[];
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
          <TrackItem
            track={track}
            key={track.id}
            isActive={false}
            playButton={
              <RowPlayButton
                context={{ type: "NEW_RELEASES", name: "New Releases" }}
              />
            }
          />
        ))}
      </ol>
    </section>
  );
};
