import SectionHeading from "@/components/ui/section-heading";
import { SearchResult } from "@/features/search/contracts/search-dtos";
import SeeAllButton from "./see-all-button";

export default function ProfilesSection({
  profiles,
  q,
}: {
  profiles: SearchResult["profiles"];
  q?: string;
}) {
  if (profiles.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeading
        title="Profiles"
        seeAllBtn={q && <SeeAllButton q={q} targetType="profiles" />}
      />
    </section>
  );
}
