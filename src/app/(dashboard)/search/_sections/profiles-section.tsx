import { UserItem } from "@/components/features/entity-item/user-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { SearchResults } from "@/features/search/search-actions";

export default function ProfilesSection({
  data,
  q,
}: {
  data: SearchResults["profiles"];
  q?: string;
}) {
  return (
    <Section
      title="Profiles"
      showAllHref={
        data.pagination.hasMore && q
          ? `/search?q=${q}&type=profiles`
          : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(user) => <UserItem user={user} />}
      />
    </Section>
  );
}
