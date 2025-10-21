import SectionHeading from "@/components/ui/section-heading";
import PlaylistGrid from "@/components/shared/playlist-grid";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function PlaylistsSection({
  data,
  q,
}: {
  data: SearchResults["playlists"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Playlists"
        showAllHref={
          data.pagination.hasMore && q
            ? `/search?q=${q}&type=playlists`
            : undefined
        }
      />
      <PlaylistGrid playlists={data.items} />
    </section>
  );
}
