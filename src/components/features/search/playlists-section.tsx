import { SearchResult } from "@/features/search/contracts/search-dtos";
import SectionHeading from "../../ui/section-heading";
import SeeAllButton from "./see-all-button";
import PlaylistGrid from "@/components/shared/playlist-grid";

export default function PlaylistsSection({
  playlists,
  q,
}: {
  playlists: SearchResult["playlists"];
  q?: string;
}) {
  if (playlists.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeading
        title="Playlists"
        seeAllBtn={q && <SeeAllButton q={q} targetType="playlists" />}
      />
      <PlaylistGrid playlists={playlists} />
    </section>
  );
}
