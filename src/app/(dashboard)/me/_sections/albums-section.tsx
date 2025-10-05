import AlbumGrid from "@/components/shared/album-grid";
import SectionHeading from "@/components/ui/section-heading";
import { AlbumItem } from "@/features/album/contracts/album-dto";

type AlbumsSectionProps = {
  albums: AlbumItem[];
};

export const AlbumSection = ({ albums }: AlbumsSectionProps) => {
  return (
    <section>
      <SectionHeading title="Liked Albums" />
      <AlbumGrid albums={albums} />
    </section>
  );
};
