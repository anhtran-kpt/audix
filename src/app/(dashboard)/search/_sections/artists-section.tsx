import SectionHeading from "@/components/ui/section-heading";
import ArtistGrid from "@/components/shared/artist-grid";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function ArtistsSection({
  data,
  q,
}: {
  data: SearchResults["artists"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Artists"
        showAllHref={
          data.pagination.hasMore && q
            ? `/search?q=${q}&type=artists`
            : undefined
        }
      />
      <ArtistGrid artists={data.items} />
    </section>
  );
}
