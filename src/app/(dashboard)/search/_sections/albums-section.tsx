import SectionHeading from "@/components/ui/section-heading";
import AlbumGrid from "@/components/shared/album-grid";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function AlbumsSection({
  data,
  q,
}: {
  data: SearchResults["albums"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Albums"
        showAllHref={
          data.pagination.hasMore && q
            ? `/search?q=${q}&type=albums`
            : undefined
        }
      />
      <AlbumGrid albums={data.items} />
    </section>
  );
}
