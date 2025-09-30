import { SearchResult } from "@/features/search/contracts/search-dtos";
import SectionHeading from "../../ui/section-heading";
import SeeAllButton from "./see-all-button";
import ArtistGrid from "@/components/shared/artist-grid";

export default function ArtistsSection({
  artists,
  q,
}: {
  artists: SearchResult["artists"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Artists"
        seeAllBtn={q && <SeeAllButton q={q} targetType="artists" />}
      />
      <ArtistGrid artists={artists} />
    </section>
  );
}
