import { SearchResult } from "@/features/search/contracts/search-dtos";
import SectionHeading from "../../ui/section-heading";
import SeeAllButton from "./see-all-button";
import { TrackItemCompact } from "@/components/shared/track-item-compact";

export default function TracksSection({
  tracks,
  q,
}: {
  tracks: SearchResult["tracks"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Tracks"
        seeAllBtn={q && <SeeAllButton q={q} targetType="tracks" />}
      />
      <div className="flex flex-col gap-1">
        {tracks.map((track) => (
          <TrackItemCompact
            key={track.id}
            track={{
              ...track,
              artists: track.artists.map((item) => item.artist),
            }}
            context={{
              contextId: q!,
              contextType: "SEARCH",
            }}
          />
        ))}
      </div>
    </section>
  );
}
