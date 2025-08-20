"use client";

import { ContextPlayButton } from "@/components/features/context-play-button";
import { GridWrapper } from "@/components/ui/grid-wrapper";
import { NavLink } from "@/components/ui/nav-link";
import SectionHeading from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { TAlbumGridItem, TArtist } from "@/types";
import { formatDate } from "date-fns";
import { CldImage } from "next-cloudinary";

interface OtherAlbumsSectionProps {
  artist: Partial<TArtist>;
  albums: TAlbumGridItem[];
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
            <NavLink
              href={`/albums/${album.id}`}
              className="text-[calc(15rem/16)]"
            >
              {album.title}
            </NavLink>
            <p className="text-muted-foreground text-[calc(13rem/16)]">
              {formatDate(album.releaseDate, "yyyy")}
            </p>
          </div>
        ))}
      </GridWrapper>
    </section>
  );
};
