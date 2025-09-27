"use client";

import AlbumGrid from "@/components/shared/album-grid";
import SectionHeading from "@/components/ui/section-heading";
import { AlbumBase } from "@/features/album/contracts/album-dto";
import { ArtistBase } from "@/features/artist/contracts/artist-schema";

interface OtherAlbumsSectionProps {
  artist: Pick<ArtistBase, "id" | "name">;
  albums: Pick<
    AlbumBase,
    "id" | "title" | "albumType" | "releaseDate" | "imageId"
  >[];
}

export const OtherAlbumsSection = ({
  artist,
  albums,
}: OtherAlbumsSectionProps) => {
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
