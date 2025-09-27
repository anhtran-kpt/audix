import { TrackList } from "@/components/features/track-list";
import SectionHeading from "@/components/ui/section-heading";
import { TrackListItem } from "@/features/track/contracts/track-dto";

export const PopularTracksSection = ({
  artistId,
  tracks,
}: {
  artistId: string;
  tracks: TrackListItem[];
}) => {
  return (
    <section>
      <SectionHeading title="Popular" />
      <TrackList contextId={artistId} contextType="ARTIST" tracks={tracks} />
    </section>
  );
};
