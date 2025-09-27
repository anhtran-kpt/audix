import AlbumGrid from "@/components/shared/album-grid";
import SectionHeading from "@/components/ui/section-heading";
import { AlbumBase } from "@/features/album/contracts/album-dto";
import { ArtistBase } from "@/features/artist/contracts/artist-schema";

interface SuggestionSectionProps {
  artist: Pick<ArtistBase, "id" | "name">;
  albums: Pick<
    AlbumBase,
    "id" | "title" | "albumType" | "releaseDate" | "imageId"
  >[];
}

export const SuggestionSection = ({
  artist,
  albums,
}: SuggestionSectionProps) => {
  return (
    <section>
      <SectionHeading
        title={`More by ${artist.name}`}
        hasShowAll
        href={`/artists/${artist.id}/albums`}
      />
      <AlbumGrid albums={albums} />
    </section>
  );
};
