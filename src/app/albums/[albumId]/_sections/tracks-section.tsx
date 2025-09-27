import { TrackList } from "@/components/features/track-list";
import { TrackListItem } from "@/features/track/contracts/track-dto";

type TracksSectionProps = {
  tracks: TrackListItem[];
  albumId: string;
};

export const TracksSection = ({ tracks, albumId }: TracksSectionProps) => {
  return (
    <section>
      <TrackList contextId={albumId} tracks={tracks} contextType="ALBUM" />
    </section>
  );
};
