import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { SearchResults } from "@/features/search/data-access/search-repo";

export default function ProfilesSection({
  data,
}: {
  data: SearchResults["profiles"];
}) {
  console.log(data);
  return (
    <section>
      <SectionHeading
        title="Profiles"
        showAllHref={
          data.pagination.hasMore ? `/search?type=profiles` : undefined
        }
      />
      <UserGrid users={data.items} />
    </section>
  );
}
