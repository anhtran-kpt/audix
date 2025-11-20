import { SearchResults } from "@/features/search/search-actions";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { AlbumItem } from "@/features/albums/components/album-item";
import { Section } from "@/components/shared/section";

export default function AlbumsSection({
  data,
  q,
}: {
  data: SearchResults["albums"];
  q?: string;
}) {
  return (
    <Section
      title="Albums"
      showAllHref={
        data.pagination.hasMore && q ? `/search?q=${q}&type=albums` : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(album) => <AlbumItem album={album} />}
      />
    </Section>
  );
}
