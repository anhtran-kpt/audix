import { SearchResult } from "@/features/search/contracts/search-dtos";
import SectionHeading from "../../ui/section-heading";
import { GridWrapper } from "../../ui/grid-wrapper";
import PlaylistItem from "../playlist-item";
import SeeAllButton from "./see-all-button";

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
      <GridWrapper>
        {playlists.map((playlist) => (
          <PlaylistItem key={playlist.id} playlist={playlist} />
        ))}
      </GridWrapper>
    </section>
  );
}
