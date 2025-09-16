import { SearchResult } from "@/features/search/contracts/search-dtos";
import SectionHeading from "../../ui/section-heading";
import { AlbumGrid } from "../album-grid";
import SeeAllButton from "./see-all-button";

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
