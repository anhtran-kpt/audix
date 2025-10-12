import SectionHeading from "../../../../components/ui/section-heading";
import PlaylistGrid from "@/components/shared/playlist-grid";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function PlaylistsSection({
  data,
}: {
  data: SearchResults["playlists"];
}) {
  return (
    <section>
      <SectionHeading
        title="Playlists"
        showAllHref={
          data.pagination.hasMore ? `/search?type=playlists` : undefined
        }
      />
      <PlaylistGrid playlists={data.items} />
    </section>
  );
}
