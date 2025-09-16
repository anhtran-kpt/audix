import SectionHeading from "@/components/ui/section-heading";
import { SearchResult } from "@/features/search/contracts/search-dtos";

export default function ProfilesSection({
  profiles,
}: {
  profiles: SearchResult["users"];
}) {
  return (
    <section>
      <SectionHeading title="Profiles" />
    </section>
  );
}
