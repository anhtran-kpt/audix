import { SearchResults } from "@/features/search/search-actions";
import { Section } from "@/components/shared/section";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { ArtistItem } from "@/components/features/entity-item/artist-item";

export default function ArtistsSection({
  data,
  q,
}: {
  data: SearchResults["artists"];
  q?: string;
}) {
  return (
    <Section
      title="Artists"
      showAllHref={
        data.pagination.hasMore && q ? `/search?q=${q}&type=artists` : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(artist) => <ArtistItem artist={artist} />}
      />
    </Section>
  );
}
