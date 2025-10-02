import ArtistGrid from "@/components/shared/artist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";

type FollowingSectionProps = {
  artists: ArtistItem[];
};

export const FollowingSection = ({ artists }: FollowingSectionProps) => {
  return (
    <section>
      <SectionHeading title="Following" />
      <ArtistGrid artists={artists} />
    </section>
  );
};
