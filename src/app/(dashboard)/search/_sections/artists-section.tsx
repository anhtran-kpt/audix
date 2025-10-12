import SectionHeading from "../../../../components/ui/section-heading";
import ArtistGrid from "@/components/shared/artist-grid";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function ArtistsSection({
  data,
}: {
  data: SearchResults["artists"];
}) {
  return (
    <section>
      <SectionHeading
        title="Artists"
        showAllHref={
          data.pagination.hasMore ? "/search?type=artists" : undefined
        }
      />
      <ArtistGrid artists={data.items} />
    </section>
  );
}
