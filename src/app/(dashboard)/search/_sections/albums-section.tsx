import SectionHeading from "../../../../components/ui/section-heading";
import AlbumGrid from "@/components/shared/album-grid";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function AlbumsSection({
  data,
}: {
  data: SearchResults["albums"];
}) {
  return (
    <section>
      <SectionHeading
        title="Albums"
        showAllHref={
          data.pagination.hasMore ? `/search?type=albums` : undefined
        }
      />
      <AlbumGrid albums={data.items} />
    </section>
  );
}
