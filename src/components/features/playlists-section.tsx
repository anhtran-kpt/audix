import { SearchResult } from "@/features/search/contracts/search-dtos";
import SectionHeading from "../ui/section-heading";
import { GridWrapper } from "../ui/grid-wrapper";
import PlaylistItem from "./playlist-item";

export default function PlaylistsSection({
  playlists,
}: {
  playlists: SearchResult["playlists"];
}) {
  return (
    <section>
      <SectionHeading title="Playlists" />
      <GridWrapper>
        {playlists.map((playlist) => (
          <PlaylistItem key={playlist.id} playlist={playlist} />
        ))}
      </GridWrapper>
    </section>
  );
}
