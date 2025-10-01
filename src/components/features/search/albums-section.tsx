import { SearchResult } from "@/features/search/contracts/search-dto";
import SectionHeading from "../../ui/section-heading";
import SeeAllButton from "./see-all-button";
import AlbumGrid from "@/components/shared/album-grid";

export default function AlbumsSection({
  albums,
  q,
}: {
  albums: SearchResult["albums"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Albums"
        seeAllBtn={q && <SeeAllButton q={q} targetType="albums" />}
      />
      <AlbumGrid albums={albums} />
    </section>
  );
}
