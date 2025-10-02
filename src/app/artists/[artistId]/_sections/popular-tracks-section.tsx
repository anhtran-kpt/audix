import { TrackList } from "@/components/features/track-list";
import { TrackItem } from "@/features/track/contracts/track-dto";

export const PopularTracksSection = ({
  artistId,
  tracks,
}: {
  artistId: string;
  tracks: TrackItem[];
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6 ">
        <h2 className="font-bold text-2xl select-none capitalize">Popular</h2>
      </div>
      <TrackList contextId={artistId} contextType="ARTIST" tracks={tracks} />
    </section>
  );
};
