import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function ProfilesSection({
  data,
  q,
}: {
  data: SearchResults["profiles"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Profiles"
        showAllHref={
          data.pagination.hasMore && q
            ? `/search?q=${q}&type=profiles`
            : undefined
        }
      />
      <UserGrid users={data.items} />
    </section>
  );
}
