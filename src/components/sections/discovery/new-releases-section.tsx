"use client";

import { RowPlayButton } from "@/components/features/row-play-button";
import TrackItem from "@/components/features/track-item";
import SectionHeading from "@/components/ui/section-heading";
import { FullTrack } from "@/features/track/contracts/track-dto";

type NewReleasesSectionProps = {
  tracks: Pick<
    FullTrack,
    "id" | "title" | "album" | "artists" | "isExplicit"
  >[];
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
            playButton={
              <RowPlayButton
                trackId={track.id}
                context={{ type: "NEW_RELEASES", name: "New Releases" }}
              />
            }
          />
        ))}
      </ol>
    </section>
  );
};
