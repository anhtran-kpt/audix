import { SearchResult } from "@/features/search/contracts/search-dtos";
import SectionHeading from "../ui/section-heading";
import { AlbumGrid } from "./album-grid";

export default function AlbumsSection({
  albums,
}: {
  albums: SearchResult["albums"];
}) {
  return (
    <section>
      <SectionHeading title="Albums" />
      <AlbumGrid albums={albums} />
    </section>
  );
}
