import SectionHeading from "../../../../components/ui/section-heading";
import { TrackItemCompact } from "@/components/shared/track-item-compact";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function TracksSection({
  data,
  q,
}: {
  data: SearchResults["tracks"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Tracks"
        showAllHref={
          data.pagination.hasMore && q
            ? `/search?q=${q}&type=tracks`
            : undefined
        }
      />
      <div className="flex flex-col gap-1">
        {data.items.map((track) => (
          <TrackItemCompact
            key={track.id}
            track={track}
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
