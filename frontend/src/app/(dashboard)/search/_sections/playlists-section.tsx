import { SearchResults } from "@/features/search/search-actions";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { PlaylistItem } from "@/components/features/entity-item/playlist-item";
import { Section } from "@/components/shared/section";

export default function PlaylistsSection({
  data,
  q,
}: {
  data: SearchResults["playlists"];
  q?: string;
}) {
  return (
    <Section
      title="Playlists"
      showAllHref={
        data.pagination.hasMore && q
          ? `/search?q=${q}&type=playlists`
          : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(playlist) => <PlaylistItem playlist={playlist} />}
      />
    </Section>
  );
}
