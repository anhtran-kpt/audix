import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { ArtistGridItem } from "@/features/artist/contracts/artist-dto";

type SuggestionSectionProps = {
  artists: ArtistGridItem[];
};

export const SuggestionSection = ({ artists }: SuggestionSectionProps) => {
  return (
    <section>
      <SectionHeading title="Fans also like" href={`/artists`} hasShowAll />
      <ArtistGrid artists={artists} />
    </section>
  );
};
