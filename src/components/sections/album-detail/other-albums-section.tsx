"use client";

import { ContextPlayButton } from "@/components/features/context-play-button";
import { GridWrapper } from "@/components/ui/grid-wrapper";
import { NavLink } from "@/components/ui/nav-link";
import SectionHeading from "@/components/ui/section-heading";
import { AlbumBase } from "@/features/album/contracts/album-dto";
import { ArtistBase } from "@/features/artist/contracts/artist-dto";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CldImage } from "next-cloudinary";

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
      <GridWrapper>
        {albums.map((album) => (
          <div key={album.id} className="space-y-2 group">
            <div className="relative rounded-md aspect-square">
              <CldImage
                alt={album.title}
                src={album.imageId}
                fill
                className="object-cover rounded-md group-hover:brightness-75"
                sizes="20vw"
              />
              <ContextPlayButton
                context={{
                  type: "ALBUM",
                  contextId: album.id,
                }}
                className={cn(
                  "absolute bottom-2 right-2",
                  "opacity-0 translate-y-2 scale-95",
                  "transition-all duration-300",
                  "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                )}
              />
            </div>
            <NavLink href={`/albums/${album.id}`} className="text-15">
              {album.title}
            </NavLink>
            {album.releaseDate && (
              <p className="text-muted-foreground text-13">
                {formatDate(album.releaseDate, "yyyy")}
              </p>
            )}
          </div>
        ))}
      </GridWrapper>
    </section>
  );
};
